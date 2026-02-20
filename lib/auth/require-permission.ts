// Server-side permission guard para Server Components
import { redirect } from "next/navigation"
import { getCurrentUser, type SerializableUser } from "@/lib/auth/session"
import { hasPermission } from "@/lib/auth/permissions"
import type { UserRole } from "@/lib/db/models"

/**
 * Verifica autenticación y permisos en Server Components.
 * Redirige al login si no hay sesión, o al dashboard si no tiene permisos.
 */
export async function requirePermission(
  permission: string,
  redirectTo = "/dashboard"
): Promise<SerializableUser> {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (!hasPermission(user.role as UserRole, permission)) {
    redirect(redirectTo)
  }

  return user
}

/**
 * Verifica autenticación y que tenga al menos uno de los permisos dados.
 */
export async function requireAnyPermission(
  permissions: string[],
  redirectTo = "/dashboard"
): Promise<SerializableUser> {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const hasAny = permissions.some((p) => hasPermission(user.role as UserRole, p))
  if (!hasAny) {
    redirect(redirectTo)
  }

  return user
}

/**
 * Solo verifica autenticación (sin check de permisos).
 */
export async function requireAuth(): Promise<SerializableUser> {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return user
}

/**
 * Verifica que el usuario sea admin (super_admin o admin).
 */
export async function requireAdmin(): Promise<SerializableUser> {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (!["super_admin", "admin"].includes(user.role)) {
    redirect("/dashboard")
  }

  return user
}
