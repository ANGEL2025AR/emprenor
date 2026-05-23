import { DEFAULT_PERMISSIONS } from "@/lib/auth/permissions"

/** Rutas permitidas para rol cliente (portal de obra). */
export const CLIENT_PATH_PATTERNS: RegExp[] = [
  /^\/dashboard\/?$/,
  /^\/dashboard\/perfil\/?$/,
  /^\/dashboard\/proyectos\/?$/,
  /^\/dashboard\/proyectos\/[a-fA-F0-9]{24}\/?$/,
  /^\/dashboard\/documentos\/?$/,
  /^\/dashboard\/mi-obra\/?$/,
  /^\/dashboard\/mi-obra\/[a-fA-F0-9]{24}\/?$/,
]

const CLIENT_BLOCKED_PATTERNS: RegExp[] = [/\/nuevo\/?$/, /\/editar\/?$/]

export function isClientPathAllowed(pathname: string): boolean {
  if (CLIENT_BLOCKED_PATTERNS.some((p) => p.test(pathname))) return false
  return CLIENT_PATH_PATTERNS.some((p) => p.test(pathname))
}

/** Rutas del panel admin reducido (super_admin / admin). */
const ADMIN_DASHBOARD_ROUTES: Record<string, string[]> = {
  "/dashboard": ["super_admin", "admin"],
  "/dashboard/proyectos": ["super_admin", "admin"],
  "/dashboard/clientes": ["super_admin", "admin"],
  "/dashboard/contactos": ["super_admin", "admin"],
  "/dashboard/sitio-web": ["super_admin", "admin"],
  "/dashboard/perfil": ["super_admin", "admin", "gerente", "supervisor", "trabajador", "cliente"],
  "/dashboard/zona-empleados": ["gerente", "supervisor", "trabajador"],
  "/dashboard/mi-obra": ["cliente", "super_admin", "admin"],
}

export function buildMiddlewareRouteMap(): Record<string, string[]> {
  const map: Record<string, string[]> = { ...ADMIN_DASHBOARD_ROUTES }

  for (const [route, permission] of Object.entries({
    "/dashboard/proyectos": "projects.view",
    "/dashboard/clientes": "clients.view",
    "/dashboard/contactos": "contacts.view",
    "/dashboard/sitio-web": "website.view",
    "/dashboard/documentos": "documents.view",
    "/dashboard/mi-obra": "client.compliance.view",
  })) {
    const roles = getRolesForPermission(permission)
    if (roles.length) map[route] = roles
  }

  return map
}

function getRolesForPermission(permission: string): string[] {
  const allowed = DEFAULT_PERMISSIONS[permission as keyof typeof DEFAULT_PERMISSIONS]
  return allowed ? [...allowed] : []
}
