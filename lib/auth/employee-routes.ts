/** Rutas y roles del personal operativo vs gestión. */

import { isFieldStaffDashboardPath, isManagementDashboardPath } from "@/lib/platform/active-routes"

const FIELD_STAFF_ROLES = new Set(["supervisor", "trabajador"])
const MANAGEMENT_ROLES = new Set(["super_admin", "admin", "gerente"])

/** Personal de campo (supervisor / trabajador). */
export function isFieldStaffRole(role: string): boolean {
  return FIELD_STAFF_ROLES.has(role)
}

/** Gestión: administración y gerente de obra. */
export function isManagementRole(role: string): boolean {
  return MANAGEMENT_ROLES.has(role)
}

/** @deprecated Usar isFieldStaffRole */
export function isStaffZoneRole(role: string): boolean {
  return isFieldStaffRole(role)
}

/** @deprecated Usar isFieldStaffRole */
export function isEmployeeRole(role: string): boolean {
  return isFieldStaffRole(role)
}

export function isStaffZonePathAllowed(pathname: string, role: string): boolean {
  if (!isFieldStaffRole(role)) return true
  return isFieldStaffDashboardPath(pathname)
}

/** @deprecated */
export function isEmployeePathAllowed(pathname: string, role?: string): boolean {
  return isStaffZonePathAllowed(pathname, role ?? "")
}

export function isManagementPathAllowed(pathname: string, role: string): boolean {
  if (!isManagementRole(role)) return true
  return isManagementDashboardPath(pathname)
}

export function getDefaultDashboardPath(role: string): string {
  if (role === "cliente") return "/dashboard"
  if (isFieldStaffRole(role)) return "/dashboard/proyectos"
  if (isManagementRole(role)) return "/dashboard"
  return "/dashboard/proyectos"
}
