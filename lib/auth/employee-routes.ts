/** Rutas por defecto del personal operativo (gestor de obras). */

import { isStaffProjectPath } from "@/lib/platform/active-routes"

const STAFF_ZONE_ROLES = new Set(["gerente", "supervisor", "trabajador"])

export function isStaffZoneRole(role: string): boolean {
  return STAFF_ZONE_ROLES.has(role)
}

/** @deprecated Usar isStaffZoneRole */
export function isEmployeeRole(role: string): boolean {
  return isStaffZoneRole(role)
}

export function isStaffZonePathAllowed(pathname: string, role: string): boolean {
  if (!isStaffZoneRole(role)) return true
  return isStaffProjectPath(pathname)
}

/** @deprecated */
export function isEmployeePathAllowed(pathname: string, role?: string): boolean {
  return isStaffZonePathAllowed(pathname, role ?? "")
}

export function getDefaultDashboardPath(role: string): string {
  if (role === "cliente") return "/dashboard"
  if (isStaffZoneRole(role)) return "/dashboard/proyectos"
  if (role === "super_admin" || role === "admin") return "/dashboard/proyectos"
  return "/dashboard/proyectos"
}
