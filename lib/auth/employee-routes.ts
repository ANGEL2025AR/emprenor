/** Roles que usarán la zona de empleados (desarrollo aparte del panel admin). */

const STAFF_ZONE_ROLES = new Set(["gerente", "supervisor", "trabajador"])

const STAFF_ZONE_PATTERNS: RegExp[] = [
  /^\/dashboard\/?$/,
  /^\/dashboard\/perfil\/?$/,
  /^\/dashboard\/zona-empleados\/?$/,
]

export function isStaffZoneRole(role: string): boolean {
  return STAFF_ZONE_ROLES.has(role)
}

/** @deprecated Usar isStaffZoneRole */
export function isEmployeeRole(role: string): boolean {
  return isStaffZoneRole(role)
}

export function isStaffZonePathAllowed(pathname: string, role: string): boolean {
  if (!isStaffZoneRole(role)) return true
  return STAFF_ZONE_PATTERNS.some((p) => p.test(pathname))
}

/** @deprecated */
export function isEmployeePathAllowed(pathname: string, role?: string): boolean {
  return isStaffZonePathAllowed(pathname, role ?? "")
}

export function getDefaultDashboardPath(role: string): string {
  if (role === "cliente") return "/dashboard"
  if (isStaffZoneRole(role)) return "/dashboard/zona-empleados"
  return "/dashboard"
}
