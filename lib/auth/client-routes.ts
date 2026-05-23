import { DEFAULT_PERMISSIONS } from "@/lib/auth/permissions"
import {
  CLIENT_DASHBOARD_PATTERNS,
  isClientDashboardPath,
} from "@/lib/platform/active-routes"

export { CLIENT_DASHBOARD_PATTERNS as CLIENT_PATH_PATTERNS, isClientDashboardPath as isClientPathAllowed }

/** Mapa middleware legacy (APIs y rutas no cubiertas por active-routes). */
export function buildMiddlewareRouteMap(): Record<string, string[]> {
  const map: Record<string, string[]> = {}

  const legacy: Record<string, string> = {
    "/dashboard/documentos": "documents.view",
    "/dashboard/mi-obra": "client.compliance.view",
    "/dashboard/proyectos": "projects.view",
    "/dashboard/clientes": "clients.view",
    "/dashboard/contactos": "contacts.view",
    "/dashboard/sitio-web": "website.view",
  }

  for (const [route, permission] of Object.entries(legacy)) {
    const roles = getRolesForPermission(permission)
    if (roles.length) map[route] = roles
  }

  return map
}

function getRolesForPermission(permission: string): string[] {
  const allowed = DEFAULT_PERMISSIONS[permission as keyof typeof DEFAULT_PERMISSIONS]
  return allowed ? [...allowed] : []
}
