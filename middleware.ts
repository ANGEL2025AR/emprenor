import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "emprenor-secret-key-change-in-production-2024")

// Rutas que requieren autenticación
const protectedRoutes = ["/dashboard", "/proyectos-gestion", "/admin"]

// Rutas públicas (no requieren auth)
const publicRoutes = ["/", "/contacto", "/nosotros", "/servicios", "/proyectos", "/preguntas-frecuentes"]

// Rutas de auth (redirigen si ya está logueado)
const authRoutes = ["/login", "/registro", "/recuperar-password", "/setup"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("emprenor_session")?.value

  // Verificar si el token es válido
  let isAuthenticated = false
  let userRole = ""

  if (token) {
    try {
      const { payload } = await jwtVerify(token, SECRET_KEY)
      isAuthenticated = true
      userRole = payload.role as string
    } catch {
      // Token inválido
      isAuthenticated = false
    }
  }

  // Si está en rutas de auth y ya está autenticado, redirigir al dashboard
  if (authRoutes.some((route) => pathname.startsWith(route)) && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Si está en rutas protegidas y no está autenticado, redirigir al login
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("from", pathname)
    return NextResponse.redirect(loginUrl)
  }

  const adminRoles: string[] = ["super_admin", "admin"]
  if (pathname.startsWith("/admin") && !adminRoles.includes(userRole)) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)"],
}
