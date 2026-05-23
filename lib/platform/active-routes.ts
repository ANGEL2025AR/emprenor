/**
 * Rutas activas de la plataforma EMPRENOR (fuente única para middleware y documentación interna).
 * Todo lo demás queda fuera del menú y redirige al panel correspondiente.
 */

export const ADMIN_DASHBOARD_PREFIXES = [
  "/dashboard",
  "/dashboard/proyectos",
  "/dashboard/clientes",
  "/dashboard/contactos",
  "/dashboard/sitio-web",
  "/dashboard/perfil",
] as const

export const CLIENT_DASHBOARD_PATTERNS = [
  /^\/dashboard\/?$/,
  /^\/dashboard\/perfil\/?$/,
  /^\/dashboard\/proyectos\/?$/,
  /^\/dashboard\/proyectos\/[a-fA-F0-9]{24}\/?$/,
  /^\/dashboard\/documentos\/?$/,
  /^\/dashboard\/mi-obra\/?$/,
  /^\/dashboard\/mi-obra\/[a-fA-F0-9]{24}\/?$/,
] as const

export const STAFF_ZONE_PATTERNS = [
  /^\/dashboard\/?$/,
  /^\/dashboard\/perfil\/?$/,
  /^\/dashboard\/zona-empleados\/?$/,
] as const

/** Páginas públicas que deben responder 200 en producción. */
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

/**
 * Zona empleados (fase futura, misma MongoDB, carpeta dedicada en el repo).
 * No activar en menú hasta implementación; ver app/(dashboard)/dashboard/zona-empleados.
 */
export const STAFF_ZONE_FUTURE_MODULES = [
  "obra_asignada",
  "parte_diario_campo",
  "art_basico",
  "documentos_obra_lectura",
] as const

export function isAdminDashboardPath(pathname: string): boolean {
  return ADMIN_DASHBOARD_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
}

export function isClientDashboardPath(pathname: string): boolean {
  if (/\/(nuevo|editar)\/?$/.test(pathname)) return false
  return CLIENT_DASHBOARD_PATTERNS.some((p) => p.test(pathname))
}

export function isStaffZonePath(pathname: string): boolean {
  return STAFF_ZONE_PATTERNS.some((p) => p.test(pathname))
}
