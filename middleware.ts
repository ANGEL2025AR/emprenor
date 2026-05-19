import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"
import { buildMiddlewareRouteMap, isClientPathAllowed } from "@/lib/auth/client-routes"

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "emprenor-secret-key-change-in-production-2024")

const protectedRoutes = ["/dashboard", "/proyectos-gestion", "/admin"]
const authRoutes = ["/login", "/registro", "/recuperar-password", "/setup"]

const ROUTE_PERMISSION_MAP = buildMiddlewareRouteMap()

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

  if (authRoutes.some((route) => pathname.startsWith(route)) && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("from", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (pathname.startsWith("/admin") && !["super_admin", "admin"].includes(userRole)) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  if (isAuthenticated && pathname.startsWith("/dashboard")) {
    if (userRole === "cliente") {
      if (!isClientPathAllowed(pathname)) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
      return NextResponse.next()
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
  matcher: ["/((?!_next/static|_next/image|api/|favicon\\.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$|.*\\.webp$|.*\\.ico$|.*\\.css$|.*\\.js$|manifest\\.json$).*)"],
}
