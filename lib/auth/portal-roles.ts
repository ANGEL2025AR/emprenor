/** Roles que administran el portal del empleado (no usan la vista de trabajador). */
export function isPortalAdminRole(role: string): boolean {
  return role === "super_admin" || role === "admin" || role === "gerente"
}

/** Roles que usan el portal como empleado (autogestión). */
export function isPortalEmployeeRole(role: string): boolean {
  return role === "trabajador" || role === "supervisor"
}
