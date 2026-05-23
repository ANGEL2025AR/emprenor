/** Rutas permitidas para empleados de obra (trabajador / supervisor). Solo portal RRHH. */

const EMPLOYEE_ALLOWED_PATTERNS: RegExp[] = [
  /^\/dashboard\/?$/,
  /^\/dashboard\/perfil\/?$/,
  /^\/dashboard\/portal(\/.*)?$/,
]

export function isEmployeeRole(role: string): boolean {
  return role === "trabajador" || role === "supervisor"
}

export function isEmployeePathAllowed(pathname: string, _role?: string): boolean {
  if (!isEmployeeRole(_role ?? "")) return true
  return EMPLOYEE_ALLOWED_PATTERNS.some((p) => p.test(pathname))
}

/** Redirección post-login según rol. */
export function getDefaultDashboardPath(role: string): string {
  if (role === "cliente") return "/dashboard"
  if (isEmployeeRole(role)) return "/dashboard/portal"
  return "/dashboard"
}
