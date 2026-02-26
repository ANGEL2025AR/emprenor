import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "emprenor-secret-key-change-in-production-2024")

const protectedRoutes = ["/dashboard", "/proyectos-gestion", "/admin"]
const publicRoutes = ["/", "/contacto", "/nosotros", "/servicios", "/proyectos", "/preguntas-frecuentes"]
const authRoutes = ["/login", "/registro", "/recuperar-password", "/setup"]

// Mapa de rutas del dashboard a permisos requeridos (segunda capa de defensa)
const ROUTE_PERMISSION_MAP: Record<string, { permission: string; allowedRoles: string[] }> = {
  "/dashboard/finanzas": { permission: "finance.view", allowedRoles: ["super_admin", "admin", "gerente"] },
  "/dashboard/cotizaciones": { permission: "finance.view", allowedRoles: ["super_admin", "admin", "gerente"] },
  "/dashboard/contratos": { permission: "finance.view", allowedRoles: ["super_admin", "admin", "gerente"] },
  "/dashboard/facturas": { permission: "finance.view", allowedRoles: ["super_admin", "admin", "gerente"] },
  "/dashboard/pagos": { permission: "finance.view", allowedRoles: ["super_admin", "admin", "gerente"] },
  "/dashboard/usuarios": { permission: "users.view", allowedRoles: ["super_admin", "admin", "gerente"] },
  "/dashboard/empleados": { permission: "users.view", allowedRoles: ["super_admin", "admin", "gerente"] },
  "/dashboard/reportes": { permission: "reports.view", allowedRoles: ["super_admin", "admin", "gerente"] },
  "/dashboard/automatizaciones": { permission: "automations.view", allowedRoles: ["super_admin", "admin"] },
  "/dashboard/sitio-web": { permission: "website.view", allowedRoles: ["super_admin", "admin"] },
  "/dashboard/auditoria": { permission: "admin.logs", allowedRoles: ["super_admin", "admin"] },
  "/dashboard/contactos": { permission: "contacts.view", allowedRoles: ["super_admin", "admin"] },
  "/dashboard/roles": { permission: "admin.roles", allowedRoles: ["super_admin", "admin"] },
  "/dashboard/proveedores": { permission: "suppliers.view", allowedRoles: ["super_admin", "admin", "gerente"] },
  "/dashboard/inventario": { permission: "inventory.view", allowedRoles: ["super_admin", "admin", "gerente", "supervisor"] },
  "/dashboard/certificados": { permission: "certificates.view", allowedRoles: ["super_admin", "admin", "gerente", "supervisor", "cliente"] },
  "/dashboard/portal": { permission: "portal.dashboard", allowedRoles: ["super_admin", "admin", "gerente", "supervisor", "trabajador"] },
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("emprenor_session")?.value

  let isAuthenticated = false
  let userRole = ""

  if (token) {
    try {
      const { payload } = await jwtVerify(token, SECRET_KEY)
      isAuthenticated = true
      userRole = payload.role as string
    } catch {
      isAuthenticated = false
    }
  }

  // Rutas de auth: redirigir si ya está logueado
  if (authRoutes.some((route) => pathname.startsWith(route)) && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Rutas protegidas: redirigir al login si no está autenticado
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("from", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Admin: solo super_admin y admin
  if (pathname.startsWith("/admin") && !["super_admin", "admin"].includes(userRole)) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Verificar permisos por ruta del dashboard
  if (isAuthenticated && pathname.startsWith("/dashboard/")) {
    for (const [route, config] of Object.entries(ROUTE_PERMISSION_MAP)) {
      if (pathname.startsWith(route) && !config.allowedRoles.includes(userRole)) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|api/|favicon\\.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$|.*\\.webp$|.*\\.ico$|.*\\.css$|.*\\.js$|manifest\\.json$).*)"],
}
