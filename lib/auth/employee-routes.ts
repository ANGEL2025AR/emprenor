/** Rutas permitidas para empleados de obra (trabajador / supervisor). */

const EMPLOYEE_SHARED_PATTERNS: RegExp[] = [
  /^\/dashboard\/?$/,
  /^\/dashboard\/perfil\/?$/,
  /^\/dashboard\/portal(\/.*)?$/,
  /^\/dashboard\/proyectos\/?$/,
  /^\/dashboard\/proyectos\/[a-fA-F0-9]{24}\/?$/,
  /^\/dashboard\/tareas(\/.*)?$/,
  /^\/dashboard\/bitacora-diaria(\/.*)?$/,
  /^\/dashboard\/incidencias(\/.*)?$/,
  /^\/dashboard\/inspecciones(\/.*)?$/,
  /^\/dashboard\/documentos(\/.*)?$/,
  /^\/dashboard\/notificaciones(\/.*)?$/,
  /^\/dashboard\/chat(\/.*)?$/,
  /^\/dashboard\/calendario(\/.*)?$/,
]

const EMPLOYEE_SUPERVISOR_PATTERNS: RegExp[] = [
  /^\/dashboard\/punch-lists(\/.*)?$/,
  /^\/dashboard\/rfis(\/.*)?$/,
]

/** Creación/edición permitida al trabajador de campo. */
const TRABAJADOR_WRITE_PATTERNS: RegExp[] = [
  /\/bitacora-diaria\/nueva\/?$/,
  /\/bitacora-diaria\/[a-fA-F0-9]{24}\/?$/,
  /\/incidencias\/nueva\/?$/,
  /\/incidencias\/[a-fA-F0-9]{24}(\/editar)?\/?$/,
]

const TRABAJADOR_BLOCKED_PATTERNS: RegExp[] = [
  /\/nuevo\/?$/,
  /\/editar\/?$/,
]

export function isEmployeeRole(role: string): boolean {
  return role === "trabajador" || role === "supervisor"
}

export function isEmployeePathAllowed(pathname: string, role: string): boolean {
  if (!isEmployeeRole(role)) return true

  const patterns =
    role === "supervisor"
      ? [...EMPLOYEE_SHARED_PATTERNS, ...EMPLOYEE_SUPERVISOR_PATTERNS]
      : EMPLOYEE_SHARED_PATTERNS

  if (!patterns.some((p) => p.test(pathname))) return false

  if (role === "trabajador") {
    if (TRABAJADOR_WRITE_PATTERNS.some((p) => p.test(pathname))) return true
    if (TRABAJADOR_BLOCKED_PATTERNS.some((p) => p.test(pathname))) return false
  }

  return true
}

/** Redirección post-login según rol. */
export function getDefaultDashboardPath(role: string): string {
  if (role === "cliente") return "/dashboard"
  if (isEmployeeRole(role)) return "/dashboard/portal"
  return "/dashboard"
}
