import { ObjectId } from "mongodb"
import { getDb } from "@/lib/db/connection"
import type { SerializableUser } from "@/lib/auth/session"
import type { Project } from "@/lib/db/models"

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

export function isClientRole(role: string): boolean {
  return role === "cliente"
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
