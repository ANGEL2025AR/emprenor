import { ObjectId } from "mongodb"
import type { SessionPayload, SerializableUser } from "@/lib/auth/session"
import { hasPermission } from "@/lib/auth/permissions"
import type { UserRole } from "@/lib/db/models"
import { canAccessProjectId } from "@/lib/auth/project-access"

export function canManageCompliance(role: string): boolean {
  return hasPermission(role as UserRole, "compliance.manage")
}

export function canViewClientCompliance(role: string): boolean {
  return hasPermission(role as UserRole, "client.compliance.view") || canManageCompliance(role)
}

export function sessionToUser(session: SessionPayload): SerializableUser {
  const parts = session.name.trim().split(/\s+/)
  const firstName = parts[0] ?? session.name
  const lastName = parts.slice(1).join(" ")
  return {
    _id: session.userId,
    email: session.email,
    name: firstName,
    lastName,
    role: session.role as UserRole,
    permissions: [],
    isActive: true,
    emailVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export async function assertProjectComplianceAccess(
  session: SessionPayload,
  projectId: string,
  requireManage = false,
): Promise<{ ok: true; user: SerializableUser } | { ok: false; status: number; error: string }> {
  if (!ObjectId.isValid(projectId)) {
    return { ok: false, status: 400, error: "ID de proyecto inválido" }
  }

  if (requireManage) {
    if (!canManageCompliance(session.role)) {
      return { ok: false, status: 403, error: "Sin permisos para gestionar cumplimiento" }
    }
  } else if (!canViewClientCompliance(session.role)) {
    return { ok: false, status: 403, error: "Sin permisos" }
  }

  const user = sessionToUser(session)
  const allowed = await canAccessProjectId(user, projectId)
  if (!allowed) {
    return { ok: false, status: 403, error: "Sin acceso a este proyecto" }
  }

  return { ok: true, user }
}
