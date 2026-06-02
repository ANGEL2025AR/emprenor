import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"
import { getDefaultDashboardPath, isStaffZoneRole } from "@/lib/auth/employee-routes"
import {
  isClientDashboardPath,
  isProjectManagerPath,
  isStaffProjectPath,
} from "@/lib/platform/active-routes"

import { getJwtSecretKey } from "@/lib/auth/jwt-secret"

const protectedRoutes = ["/dashboard"]
const authRoutes = ["/login", "/registro", "/setup"]

const ADMIN_ROLES = new Set(["super_admin", "admin"])

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
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
      if (!isClientDashboardPath(pathname)) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
      return NextResponse.next()
    }

    if (isStaffZoneRole(userRole)) {
      if (pathname === "/dashboard" || pathname === "/dashboard/") {
        return NextResponse.redirect(new URL("/dashboard/proyectos", request.url))
      }
      if (!isStaffProjectPath(pathname)) {
        return NextResponse.redirect(new URL("/dashboard/proyectos", request.url))
      }
      return NextResponse.next()
    }

    if (ADMIN_ROLES.has(userRole)) {
      if (pathname === "/dashboard" || pathname === "/dashboard/") {
        return NextResponse.redirect(new URL("/dashboard/proyectos", request.url))
      }
      if (!isProjectManagerPath(pathname)) {
        return NextResponse.redirect(new URL("/dashboard/proyectos", request.url))
      }
      return NextResponse.next()
    }

    return NextResponse.redirect(new URL("/dashboard/proyectos", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next|api/|favicon\\.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$|.*\\.webp$|.*\\.ico$|.*\\.css$|.*\\.js$|manifest\\.json$).*)",
  ],
}
