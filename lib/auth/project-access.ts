import { ObjectId } from "mongodb"
import { getDb } from "@/lib/db/connection"
import type { SerializableUser } from "@/lib/auth/session"
import type { Project, Document } from "@/lib/db/models"

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

export function isClientRole(role: string): boolean {
  return role === "cliente"
}

/** Documentos visibles para el cliente: solo los marcados privado/público, nunca internos (equipo). */
export function getClientVisibleDocumentFilter(): Record<string, unknown> {
  return { access: { $in: ["privado", "publico"] } }
}

/** Filtro MongoDB: proyectos asignados al usuario cliente (email / registro clients / clientUserId). */
export async function getClientProjectsFilter(user: SerializableUser): Promise<Record<string, unknown>> {
  const email = user.email.trim()
  const db = await getDb()
  const clientRecord = await db.collection("clients").findOne({
    email: { $regex: new RegExp(`^${escapeRegex(email)}$`, "i") },
  })

  const or: Record<string, unknown>[] = [
    { "client.email": { $regex: new RegExp(`^${escapeRegex(email)}$`, "i") } },
    { clientUserId: new ObjectId(user._id) },
  ]

  if (clientRecord?._id) {
    or.push({ clientId: clientRecord._id })
  }

  if (user.linkedClientId && ObjectId.isValid(user.linkedClientId)) {
    or.push({ clientId: new ObjectId(user.linkedClientId) })
  }

  return { $or: or }
}

export async function getAssignedProjectIds(user: SerializableUser): Promise<ObjectId[]> {
  if (!isClientRole(user.role)) return []
  const filter = await getClientProjectsFilter(user)
  const db = await getDb()
  const rows = await db.collection<Project>("projects").find(filter, { projection: { _id: 1 } }).toArray()
  return rows.map((p) => p._id!).filter(Boolean)
}

export async function findProjectForUser(
  user: SerializableUser,
  projectId: string,
): Promise<Project | null> {
  if (!ObjectId.isValid(projectId)) return null
  const db = await getDb()
  const base = { _id: new ObjectId(projectId) }
  if (isClientRole(user.role)) {
    const clientFilter = await getClientProjectsFilter(user)
    return db.collection<Project>("projects").findOne({ ...base, ...clientFilter })
  }
  return db.collection<Project>("projects").findOne(base)
}

/** Combina filtro base con alcance de proyectos del cliente. */
export async function withProjectScope(
  user: SerializableUser,
  baseFilter: Record<string, unknown> = {},
): Promise<Record<string, unknown>> {
  if (!isClientRole(user.role)) return baseFilter

  const projectIds = await getAssignedProjectIds(user)
  if (projectIds.length === 0) {
    return { ...baseFilter, projectId: { $in: [] } }
  }

  const scope = { projectId: { $in: projectIds } }
  if (Object.keys(baseFilter).length === 0) return scope
  return { $and: [baseFilter, scope] }
}

export async function canAccessProjectId(user: SerializableUser, projectId: string): Promise<boolean> {
  const project = await findProjectForUser(user, projectId)
  return project !== null
}

export async function canAccessCertificateId(user: SerializableUser, certificateId: string): Promise<boolean> {
  if (!ObjectId.isValid(certificateId)) return false
  const db = await getDb()
  const cert = await db.collection("certificates").findOne({ _id: new ObjectId(certificateId) })
  if (!cert?.projectId) return false
  return canAccessProjectId(user, cert.projectId.toString())
}

export async function canAccessDocumentId(user: SerializableUser, documentId: string): Promise<boolean> {
  if (!ObjectId.isValid(documentId)) return false
  const db = await getDb()
  const doc = await db.collection<Document>("documents").findOne({ _id: new ObjectId(documentId) })
  if (!doc?.projectId) return false
  if (!(await canAccessProjectId(user, doc.projectId.toString()))) return false
  if (isClientRole(user.role) && doc.access === "equipo") return false
  return true
}

export function isEmployeePortalRole(role: string): boolean {
  return role === "trabajador" || role === "supervisor"
}
