import { ObjectId } from "mongodb"
import { getDb } from "@/lib/db/connection"
import type { User } from "@/lib/db/models"
import { assignClientUserToProjects } from "@/lib/clients/project-link"

export type PendingRegistrationRow = {
  _id: string
  email: string
  name: string
  lastName: string
  phone?: string
  publicClientType?: string
  registrationIntent?: string
  linkedClientId?: string
  createdAt: Date
}

export async function listPendingRegistrations(limit = 50): Promise<PendingRegistrationRow[]> {
  const db = await getDb()
  const rows = await db
    .collection<User & { linkedClientId?: ObjectId; publicClientType?: string; registrationIntent?: string }>(
      "users",
    )
    .find({
      role: "cliente",
      isActive: false,
      emailVerified: false,
    })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray()

  return rows.map((u) => ({
    _id: u._id!.toString(),
    email: u.email,
    name: u.name,
    lastName: u.lastName,
    phone: u.phone,
    publicClientType: u.publicClientType,
    registrationIntent: u.registrationIntent,
    linkedClientId: u.linkedClientId?.toString(),
    createdAt: u.createdAt,
  }))
}

export async function countPendingRegistrations(): Promise<number> {
  const db = await getDb()
  return db.collection("users").countDocuments({
    role: "cliente",
    isActive: false,
    emailVerified: false,
  })
}

export async function activatePortalUser(userId: string): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!ObjectId.isValid(userId)) return { ok: false, error: "ID inválido" }

  const db = await getDb()
  const oid = new ObjectId(userId)
  const user = await db
    .collection<User & { linkedClientId?: ObjectId }>("users")
    .findOne({ _id: oid })

  if (!user) return { ok: false, error: "Usuario no encontrado" }
  if (user.isActive && user.emailVerified) return { ok: false, error: "La cuenta ya está activa" }

  const now = new Date()
  await db.collection("users").updateOne(
    { _id: oid },
    { $set: { isActive: true, emailVerified: true, updatedAt: now } },
  )

  if (user.linkedClientId) {
    await db.collection("clients").updateOne(
      { _id: user.linkedClientId },
      { $set: { userId: oid, status: "activo", updatedAt: now } },
    )
    await assignClientUserToProjects(userId, user.linkedClientId.toString())
  } else if (user.role === "cliente") {
    const client = await db.collection("clients").findOne({ email: user.email.toLowerCase() })
    if (client?._id) {
      await db.collection("users").updateOne(
        { _id: oid },
        { $set: { linkedClientId: client._id, updatedAt: now } },
      )
      await db.collection("clients").updateOne(
        { _id: client._id },
        { $set: { userId: oid, status: "activo", updatedAt: now } },
      )
      await assignClientUserToProjects(userId, client._id.toString())
    }
  }

  await db.collection("contactos").updateMany(
    { userId: oid, source: "registro_publico", status: { $ne: "resuelto" } },
    { $set: { status: "resuelto", updatedAt: now, notes: "Cuenta activada desde panel admin" } },
  )

  return { ok: true }
}
