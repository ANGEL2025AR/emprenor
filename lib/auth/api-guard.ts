import { NextResponse } from "next/server"
import { getCurrentUser, type SerializableUser } from "@/lib/auth/session"
import { hasPermission } from "@/lib/auth/permissions"
import type { UserRole } from "@/lib/db/models"
import { isClientRole } from "@/lib/auth/project-access"

export async function requireApiUser(): Promise<SerializableUser | NextResponse> {
  const user = await getCurrentUser()
  if (!user?._id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }
  return user
}

export function isApiUser(result: SerializableUser | NextResponse): result is SerializableUser {
  return !(result instanceof NextResponse)
}

export function denyApi(message = "Sin permisos", status = 403): NextResponse {
  return NextResponse.json({ error: message }, { status })
}

export async function requireApiPermission(
  user: SerializableUser,
  permission: string,
): Promise<NextResponse | null> {
  if (!hasPermission(user.role as UserRole, permission)) {
    return denyApi()
  }
  return null
}

/** APIs internas de staff: cliente no puede invocarlas. */
export function denyClientStaffApis(user: SerializableUser): NextResponse | null {
  if (isClientRole(user.role)) {
    return denyApi("Esta función no está disponible para clientes")
  }
  return null
}
