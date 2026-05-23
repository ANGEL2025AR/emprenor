import type { ObjectId } from "mongodb"
import { ObjectId as MongoObjectId } from "mongodb"
import { getDb } from "@/lib/db/connection"
import type { Project, UserRole } from "@/lib/db/models"
import { ROLE_LABELS } from "@/lib/auth/permissions"

export type ProjectTeamMember = {
  id: string
  name: string
  role: string
  roleLabel: string
  phone?: string
}

export async function getProjectTeamDisplay(project: Project): Promise<ProjectTeamMember[]> {
  const ids: ObjectId[] = []
  const roleById = new Map<string, UserRole>()

  if (project.team?.managerId) {
    ids.push(project.team.managerId)
    roleById.set(project.team.managerId.toString(), "gerente")
  }
  if (project.team?.supervisorId) {
    ids.push(project.team.supervisorId)
    roleById.set(project.team.supervisorId.toString(), "supervisor")
  }
  for (const w of project.team?.workers ?? []) {
    if (w) {
      ids.push(w)
      roleById.set(w.toString(), "trabajador")
    }
  }

  if (ids.length === 0) return []

  const db = await getDb()
  const users = await db
    .collection("users")
    .find({ _id: { $in: ids } })
    .project({ name: 1, lastName: 1, phone: 1, role: 1 })
    .toArray()

  const order = new Map(ids.map((id, i) => [id.toString(), i]))

  return users
    .map((u) => {
      const id = u._id!.toString()
      const assignedRole = roleById.get(id) ?? (u.role as UserRole)
      return {
        id,
        name: [u.name, u.lastName].filter(Boolean).join(" ").trim() || "Personal EMPRENOR",
        role: assignedRole,
        roleLabel:
          assignedRole === "gerente"
            ? "Gerente de proyecto"
            : assignedRole === "supervisor"
              ? "Supervisor de obra"
              : ROLE_LABELS[assignedRole as UserRole] || "Equipo de obra",
        phone: u.phone ? String(u.phone) : undefined,
      }
    })
    .sort((a, b) => (order.get(a.id) ?? 99) - (order.get(b.id) ?? 99))
}

/** Sanitiza proyecto para vista cliente (sin presupuesto interno detallado). */
export function sanitizeProjectForClient(project: Project, teamDisplay: ProjectTeamMember[]) {
  return {
    ...project,
    budget: project.budget
      ? {
          estimated: project.budget.estimated,
          approved: project.budget.approved,
          spent: undefined,
          currency: project.budget.currency,
        }
      : project.budget,
    teamDisplay,
  }
}

export function isValidObjectId(id: string): boolean {
  return MongoObjectId.isValid(id)
}
