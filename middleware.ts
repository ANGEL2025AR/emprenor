import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"
import { buildMiddlewareRouteMap, isClientPathAllowed } from "@/lib/auth/client-routes"
import { getDefaultDashboardPath, isEmployeePathAllowed, isEmployeeRole } from "@/lib/auth/employee-routes"

import { getJwtSecretKey } from "@/lib/auth/jwt-secret"
import { GESTION_EMPRENOR } from "@/lib/site/gestion-emprenor-portal"

const protectedRoutes = ["/dashboard"]
const authRoutes = ["/login", "/registro", "/setup"]

const ROUTE_PERMISSION_MAP = buildMiddlewareRouteMap()

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Legacy URLs con mayúsculas exactas (next.config redirects son case-insensitive en Windows → bucle en /brochure)
  if (pathname === "/Brochure") {
    return NextResponse.redirect(new URL("/brochure", request.url), 308)
  }

  const token = request.cookies.get("emprenor_session")?.value

  let isAuthenticated = false
  let userRole = ""

  if (token) {
    try {
      const { payload } = await jwtVerify(token, getJwtSecretKey())
      isAuthenticated = true
      userRole = payload.role as string
    } catch {
      isAuthenticated = false
    }
  }

  // Acceso público al portal SaaS (Gestión Emprenor) — mismo sistema que myemprenor.online
  if ((pathname === "/login" || pathname === "/registro") && !isAuthenticated) {
    const dest = pathname === "/login" ? GESTION_EMPRENOR.loginUrl : GESTION_EMPRENOR.registerUrl
    const url = new URL(dest)
    const from = request.nextUrl.searchParams.get("from")
    if (from && pathname === "/login") {
      url.searchParams.set("callbackUrl", from)
    }
    return NextResponse.redirect(url, 302)
  }

  if (authRoutes.some((route) => pathname.startsWith(route)) && isAuthenticated) {
    return NextResponse.redirect(new URL(getDefaultDashboardPath(userRole), request.url))
  }

  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("from", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthenticated && pathname.startsWith("/dashboard")) {
    if (userRole === "cliente") {
      if (!isClientPathAllowed(pathname)) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
      return NextResponse.next()
    }

    if (isEmployeeRole(userRole)) {
      if (pathname === "/dashboard" || pathname === "/dashboard/") {
        return NextResponse.redirect(new URL("/dashboard/portal", request.url))
      }
      if (!isEmployeePathAllowed(pathname, userRole)) {
        return NextResponse.redirect(new URL("/dashboard/portal", request.url))
      }
      return NextResponse.next()
    }

    // Administradores del portal no usan /dashboard/portal (solo empleados)
    if (
      pathname.startsWith("/dashboard/portal") &&
      ["super_admin", "admin", "gerente"].includes(userRole)
    ) {
      const subpath = pathname.slice("/dashboard/portal".length)
      return NextResponse.redirect(new URL(`/dashboard/admin/portal${subpath}`, request.url))
    }

    for (const [route, allowedRoles] of Object.entries(ROUTE_PERMISSION_MAP)) {
      if (pathname.startsWith(route) && !allowedRoles.includes(userRole)) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Excluir _next completo (HMR/RSC/Turbopack), API, assets estáticos.
     * Si el middleware corre sobre rutas _next, HMR falla con "Failed to fetch".
     */
    "/((?!_next|api/|favicon\\.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$|.*\\.webp$|.*\\.ico$|.*\\.css$|.*\\.js$|manifest\\.json$).*)",
  ],
}
