import { DEFAULT_PERMISSIONS, ROUTE_PERMISSIONS } from "@/lib/auth/permissions"

/** Rutas permitidas para rol cliente (portal de obra). */
export const CLIENT_PATH_PATTERNS: RegExp[] = [
  /^\/dashboard\/?$/,
  /^\/dashboard\/perfil\/?$/,
  /^\/dashboard\/configuracion\/?$/,
  /^\/dashboard\/proyectos\/?$/,
  /^\/dashboard\/proyectos\/[a-fA-F0-9]{24}\/?$/,
  /^\/dashboard\/documentos\/?$/,
  /^\/dashboard\/certificados\/?$/,
  /^\/dashboard\/certificados\/[a-fA-F0-9]{24}\/?$/,
  /^\/dashboard\/notificaciones\/?$/,
]

const CLIENT_BLOCKED_PATTERNS: RegExp[] = [
  /\/nuevo\/?$/,
  /\/editar\/?$/,
]

export function isClientPathAllowed(pathname: string): boolean {
  if (CLIENT_BLOCKED_PATTERNS.some((p) => p.test(pathname))) return false
  return CLIENT_PATH_PATTERNS.some((p) => p.test(pathname))
}

/** Mapa middleware: prefijo → roles permitidos (derivado de permisos + reglas cliente). */
export function buildMiddlewareRouteMap(): Record<string, string[]> {
  const map: Record<string, string[]> = {}

  for (const [route, permission] of Object.entries(ROUTE_PERMISSIONS)) {
    const roles = getRolesForPermission(permission)
    if (roles.length) map[route] = roles
  }

  // Rutas adicionales no listadas en ROUTE_PERMISSIONS
  map["/dashboard/bitacora-diaria"] = ["super_admin", "admin", "gerente", "supervisor", "trabajador"]
  map["/dashboard/punch-lists"] = ["super_admin", "admin", "gerente", "supervisor"]
  map["/dashboard/rfis"] = ["super_admin", "admin", "gerente", "supervisor", "trabajador"]
  map["/dashboard/tareas"] = ["super_admin", "admin", "gerente", "supervisor", "trabajador"]
  map["/dashboard/inspecciones"] = ["super_admin", "admin", "gerente", "supervisor", "trabajador"]
  map["/dashboard/incidencias"] = ["super_admin", "admin", "gerente", "supervisor", "trabajador"]
  map["/dashboard/chat"] = ["super_admin", "admin", "gerente", "supervisor", "trabajador"]
  map["/dashboard/calendario"] = ["super_admin", "admin", "gerente", "supervisor", "trabajador"]
  map["/dashboard/clientes"] = ["super_admin", "admin", "gerente", "supervisor"]
  map["/dashboard/empleados"] = ["super_admin", "admin", "gerente"]

  return map
}

function getRolesForPermission(permission: string): string[] {
  const allowed = DEFAULT_PERMISSIONS[permission as keyof typeof DEFAULT_PERMISSIONS]
  return allowed ? [...allowed] : []
}
