import { NextResponse } from "next/server"
import { getCurrentUser, type SerializableUser } from "@/lib/auth/session"
import { hasPermission } from "@/lib/auth/permissions"
import type { UserRole } from "@/lib/db/models"

export async function requirePortalApi(
  permission: string,
): Promise<{ user: SerializableUser } | { response: NextResponse }> {
  const user = await getCurrentUser()
  if (!user) {
    return { response: NextResponse.json({ error: "No autorizado" }, { status: 401 }) }
  }
  if (!hasPermission(user.role as UserRole, permission)) {
    return { response: NextResponse.json({ error: "Sin permisos" }, { status: 403 }) }
  }
  return { user }
}
