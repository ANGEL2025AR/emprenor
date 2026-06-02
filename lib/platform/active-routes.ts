/**
 * Rutas activas — app exclusiva de gestión de proyectos/obras (Plan Maestro v4).
 */

export const PROJECT_MANAGER_PREFIXES = [
  "/dashboard",
  "/dashboard/proyectos",
  "/dashboard/perfil",
] as const

/** @deprecated Usar PROJECT_MANAGER_PREFIXES */
export const ADMIN_DASHBOARD_PREFIXES = PROJECT_MANAGER_PREFIXES

export const CLIENT_DASHBOARD_PATTERNS = [
  /^\/dashboard\/?$/,
  /^\/dashboard\/perfil\/?$/,
  /^\/dashboard\/proyectos\/?$/,
  /^\/dashboard\/proyectos\/[a-fA-F0-9]{24}\/?$/,
  /^\/dashboard\/documentos\/?$/,
  /^\/dashboard\/mi-obra\/?$/,
  /^\/dashboard\/mi-obra\/[a-fA-F0-9]{24}\/?$/,
] as const

export const STAFF_PROJECT_PATTERNS = [
  /^\/dashboard\/?$/,
  /^\/dashboard\/perfil\/?$/,
  /^\/dashboard\/proyectos\/?$/,
  /^\/dashboard\/proyectos\/nuevo\/?$/,
  /^\/dashboard\/proyectos\/[a-fA-F0-9]{24}\/?$/,
  /^\/dashboard\/proyectos\/[a-fA-F0-9]{24}\/editar\/?$/,
  /^\/dashboard\/proyectos\/[a-fA-F0-9]{24}\/cumplimiento-cliente\/?$/,
] as const

/** @deprecated */
export const STAFF_ZONE_PATTERNS = STAFF_PROJECT_PATTERNS

/** Páginas públicas del sitio corporativo (fuera del panel de obras). */
export const PUBLIC_PAGES = [
  "/",
  "/nosotros",
  "/servicios",
  "/contacto",
  "/proyectos",
  "/preguntas-frecuentes",
  "/politica-calidad",
  "/aviso-legal",
  "/privacidad",
  "/gestion-documental",
  "/seguridad-y-salud",
  "/licitaciones",
  "/login",
  "/registro",
] as const

export const STAFF_ZONE_FUTURE_MODULES = [
  "obra_asignada",
  "parte_diario_campo",
  "art_basico",
  "documentos_obra_lectura",
] as const

export function isProjectManagerPath(pathname: string): boolean {
  return PROJECT_MANAGER_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
}

/** @deprecated */
export function isAdminDashboardPath(pathname: string): boolean {
  return isProjectManagerPath(pathname)
}

export function isClientDashboardPath(pathname: string): boolean {
  if (/\/(nuevo|editar)\/?$/.test(pathname)) return false
  return CLIENT_DASHBOARD_PATTERNS.some((p) => p.test(pathname))
}

export function isStaffProjectPath(pathname: string): boolean {
  return STAFF_PROJECT_PATTERNS.some((p) => p.test(pathname))
}

/** @deprecated */
export function isStaffZonePath(pathname: string): boolean {
  return isStaffProjectPath(pathname)
}
