/**
 * Rutas activas del panel — acceso por rol.
 */

/** @deprecated Usar isManagementDashboardPath */
export const PROJECT_MANAGER_PREFIXES = ["/dashboard", "/dashboard/proyectos", "/dashboard/perfil"] as const

/** @deprecated Usar isManagementDashboardPath */
export const ADMIN_DASHBOARD_PREFIXES = PROJECT_MANAGER_PREFIXES

export const CLIENT_DASHBOARD_PATTERNS = [
  /^\/dashboard\/?$/,
  /^\/dashboard\/perfil\/?$/,
  /^\/dashboard\/proyectos\/?$/,
  /^\/dashboard\/proyectos\/[a-fA-F0-9]{24}\/?$/,
  /^\/dashboard\/documentos\/?$/,
  /^\/dashboard\/mi-obra\/?$/,
  /^\/dashboard\/mi-obra\/[a-fA-F0-9]{24}\/?$/,
  /^\/dashboard\/notificaciones\/?$/,
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

const FIELD_STAFF_EXTRA_PATTERNS = [
  /^\/dashboard\/portal(\/.*)?$/,
  /^\/dashboard\/zona-empleados(\/.*)?$/,
  /^\/dashboard\/notificaciones(\/.*)?$/,
  /^\/dashboard\/chat(\/.*)?$/,
  /^\/dashboard\/bitacora-diaria(\/.*)?$/,
  /^\/dashboard\/tareas(\/.*)?$/,
  /^\/dashboard\/documentos(\/.*)?$/,
  /^\/dashboard\/incidencias(\/.*)?$/,
  /^\/dashboard\/inspecciones(\/.*)?$/,
] as const

/** @deprecated */
export const STAFF_ZONE_PATTERNS = STAFF_PROJECT_PATTERNS

/** Páginas públicas del sitio corporativo. */
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

export function isManagementDashboardPath(pathname: string): boolean {
  return pathname === "/dashboard" || pathname.startsWith("/dashboard/")
}

export function isFieldStaffDashboardPath(pathname: string): boolean {
  if (STAFF_PROJECT_PATTERNS.some((p) => p.test(pathname))) return true
  return FIELD_STAFF_EXTRA_PATTERNS.some((p) => p.test(pathname))
}

/** @deprecated Usar isManagementDashboardPath */
export function isProjectManagerPath(pathname: string): boolean {
  return isManagementDashboardPath(pathname)
}

/** @deprecated */
export function isAdminDashboardPath(pathname: string): boolean {
  return isManagementDashboardPath(pathname)
}

export function isClientDashboardPath(pathname: string): boolean {
  if (/\/(nuevo|editar)\/?$/.test(pathname)) return false
  return CLIENT_DASHBOARD_PATTERNS.some((p) => p.test(pathname))
}

/** @deprecated Usar isFieldStaffDashboardPath */
export function isStaffProjectPath(pathname: string): boolean {
  return isFieldStaffDashboardPath(pathname)
}

/** @deprecated */
export function isStaffZonePath(pathname: string): boolean {
  return isFieldStaffDashboardPath(pathname)
}
