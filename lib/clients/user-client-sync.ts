import { ObjectId } from "mongodb"
import { getDb } from "@/lib/db/connection"
import type { User } from "@/lib/db/models"
import type { ClientRecord } from "@/lib/clients/compliance-sync"
import { resolveClientRecordComplianceType } from "@/lib/clients/compliance-sync"

export type PortalUserInput = {
  _id: ObjectId
  email: string
  name: string
  lastName: string
  phone?: string
}

/** Crea o vincula ficha en `clients` al crear usuario con rol cliente. */
export async function ensureClientRecordForPortalUser(user: PortalUserInput): Promise<string> {
  const db = await getDb()
  const email = user.email.toLowerCase().trim()
  const displayName = [user.name, user.lastName].filter(Boolean).join(" ").trim() || email

  const existingByUser = await db.collection("clients").findOne({ userId: user._id })
  if (existingByUser?._id) {
    await db.collection("users").updateOne(
      { _id: user._id },
      { $set: { linkedClientId: existingByUser._id, updatedAt: new Date() } },
    )
    return existingByUser._id.toString()
  }

  const existingByEmail = await db.collection<ClientRecord>("clients").findOne({
    email: { $regex: new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
  })

  if (existingByEmail?._id) {
    await db.collection("clients").updateOne(
      { _id: existingByEmail._id },
      { $set: { userId: user._id, updatedAt: new Date() } },
    )
    await db.collection("users").updateOne(
      { _id: user._id },
      { $set: { linkedClientId: existingByEmail._id, updatedAt: new Date() } },
    )
    return existingByEmail._id.toString()
  }

  const clientDoc = {
    name: displayName,
    email,
    phone: user.phone?.trim() || "",
    company: displayName,
    address: "",
    city: "",
    province: "",
    complianceType: "otro" as const,
    type: "particular",
    status: "activo",
    source: "usuario_portal",
    userId: user._id,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const inserted = await db.collection("clients").insertOne(clientDoc)
  await db.collection("users").updateOne(
    { _id: user._id },
    { $set: { linkedClientId: inserted.insertedId, updatedAt: new Date() } },
  )

  return inserted.insertedId.toString()
}

/** Vincula usuario portal existente con ficha clients (bidireccional). */
export async function linkPortalUserToClient(userId: string, clientId: string): Promise<void> {
  if (!ObjectId.isValid(userId) || !ObjectId.isValid(clientId)) return
  const db = await getDb()
  const userOid = new ObjectId(userId)
  const clientOid = new ObjectId(clientId)

  await db.collection("users").updateOne(
    { _id: userOid },
    { $set: { linkedClientId: clientOid, updatedAt: new Date() } },
  )
  await db.collection("clients").updateOne(
    { _id: clientOid },
    { $set: { userId: userOid, updatedAt: new Date() } },
  )
}

/** Al vincular cliente a proyecto: asigna clientUserId si existe usuario portal. */
export async function syncPortalUserOnProject(projectId: string, clientId: string): Promise<void> {
  if (!ObjectId.isValid(projectId) || !ObjectId.isValid(clientId)) return
  const db = await getDb()
  const clientOid = new ObjectId(clientId)

  const client = await db.collection<ClientRecord>("clients").findOne({ _id: clientOid })
  if (!client) return

  let userId: ObjectId | null = null
  if (client.userId) {
    userId = typeof client.userId === "string" ? new ObjectId(client.userId) : client.userId
  } else if (client.email) {
    const user = await db.collection<User>("users").findOne({
      role: "cliente",
      email: { $regex: new RegExp(`^${client.email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
    })
    if (user?._id) {
      userId = user._id
      await db.collection("clients").updateOne({ _id: clientOid }, { $set: { userId, updatedAt: new Date() } })
      await db.collection("users").updateOne(
        { _id: userId },
        { $set: { linkedClientId: clientOid, updatedAt: new Date() } },
      )
    }
  }

  if (!userId) return

  await db.collection("projects").updateOne(
    { _id: new ObjectId(projectId) },
    { $set: { clientUserId: userId, updatedAt: new Date() } },
  )
}

/** Si la ficha cliente tiene userId, propaga clientUserId a todos sus proyectos. */
export async function syncPortalUserOnAllClientProjects(clientId: string, userId: string): Promise<number> {
  if (!ObjectId.isValid(clientId) || !ObjectId.isValid(userId)) return 0
  const db = await getDb()
  const result = await db.collection("projects").updateMany(
    { clientId: new ObjectId(clientId) },
    { $set: { clientUserId: new ObjectId(userId), updatedAt: new Date() } },
  )
  return result.modifiedCount
}

/** Al crear ficha cliente manual: vincula usuario portal si el email coincide. */
export async function linkExistingPortalUserToClient(clientId: string, email: string): Promise<void> {
  const db = await getDb()
  const user = await db.collection<User>("users").findOne({
    role: "cliente",
    email: { $regex: new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
  })
  if (!user?._id) return

  await linkPortalUserToClient(user._id.toString(), clientId)
  await syncPortalUserOnAllClientProjects(clientId, user._id.toString())
}

export { resolveClientRecordComplianceType }
