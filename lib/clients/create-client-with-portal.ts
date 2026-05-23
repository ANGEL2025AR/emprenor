import type { Db } from "mongodb"
import { ObjectId } from "mongodb"
import { hashPassword } from "@/lib/auth/password"
import type { ClientComplianceType, User } from "@/lib/db/models"
import { assignClientUserToProjects } from "@/lib/clients/project-link"
import {
  mapPublicClientTypeToCompliance,
  mapPublicClientTypeToLegacy,
  type PublicClientType,
} from "@/lib/clients/public-registration-types"

export type AdminClientInput = {
  contactName: string
  contactLastName: string
  email: string
  phone: string
  company?: string
  address: string
  city: string
  province: string
  cuit?: string
  taxCondition: string
  complianceType?: ClientComplianceType
  publicClientType?: PublicClientType
  status: string
  notes?: string
}

export type PortalAccessInput = {
  enabled: boolean
  password?: string
  isActive?: boolean
}

export class ClientCreateError extends Error {
  constructor(
    message: string,
    readonly status = 400,
  ) {
    super(message)
    this.name = "ClientCreateError"
  }
}

export async function createClientWithOptionalPortal(
  db: Db,
  data: AdminClientInput,
  portal: PortalAccessInput,
  createdBy?: ObjectId,
) {
  const email = data.email.toLowerCase().trim()
  const complianceType =
    data.complianceType ??
    (data.publicClientType ? mapPublicClientTypeToCompliance(data.publicClientType) : "persona")

  const organization = data.company?.trim()
  const fullName = `${data.contactName.trim()} ${data.contactLastName.trim()}`.trim()
  const displayName = organization || fullName

  const existingClient = await db.collection("clients").findOne({ email })
  if (existingClient) {
    throw new ClientCreateError("Ya existe un cliente con ese email", 409)
  }

  if (portal.enabled) {
    if (!portal.password || portal.password.length < 8) {
      throw new ClientCreateError("La contraseña del portal debe tener al menos 8 caracteres")
    }
    const existingUser = await db.collection("users").findOne({ email })
    if (existingUser) {
      throw new ClientCreateError("Ya existe un usuario con ese email. Use otro email o vincule el usuario existente.", 409)
    }
  }

  const now = new Date()
  const clientDoc = {
    name: displayName,
    email,
    phone: data.phone.trim(),
    company: organization || (data.publicClientType === "persona" ? fullName : organization || ""),
    address: data.address.trim(),
    city: data.city.trim(),
    province: data.province.trim(),
    cuit: data.cuit?.trim() || "",
    taxCondition: data.taxCondition,
    complianceType,
    publicClientType: data.publicClientType,
    type: data.publicClientType ? mapPublicClientTypeToLegacy(data.publicClientType) : undefined,
    status: data.status,
    notes: data.notes?.trim() || "",
    source: "admin",
    createdAt: now,
    updatedAt: now,
    ...(createdBy ? { createdBy } : {}),
  }

  const clientResult = await db.collection("clients").insertOne(clientDoc)
  const clientId = clientResult.insertedId

  let portalUser: { _id: string; email: string; isActive: boolean } | null = null

  if (portal.enabled && portal.password) {
    const hashedPassword = hashPassword(portal.password)
    const newUser: Omit<User, "_id"> & { linkedClientId: ObjectId } = {
      email,
      password: hashedPassword,
      name: data.contactName.trim(),
      lastName: data.contactLastName.trim(),
      phone: data.phone.trim(),
      role: "cliente",
      permissions: [],
      isActive: portal.isActive !== false,
      emailVerified: true,
      linkedClientId: clientId,
      createdAt: now,
      updatedAt: now,
    }

    const userResult = await db.collection("users").insertOne(newUser)

    await db.collection("clients").updateOne(
      { _id: clientId },
      { $set: { userId: userResult.insertedId, updatedAt: new Date() } },
    )

    await assignClientUserToProjects(userResult.insertedId.toString(), clientId.toString())

    portalUser = {
      _id: userResult.insertedId.toString(),
      email,
      isActive: newUser.isActive,
    }
  }

  return {
    client: { ...clientDoc, _id: clientId.toString() },
    portalUser,
  }
}
