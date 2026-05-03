import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { verifyPassword } from "@/lib/auth/password"
import { createSession, updateLastLogin } from "@/lib/auth/session"
import { loginSchema } from "@/lib/validations/schemas"
import { rateLimit } from "@/lib/rate-limiter"
import type { User } from "@/lib/db/models"

const loginRateLimit = rateLimit({ windowMs: 60000 * 15, maxRequests: 5 })

export async function POST(request: NextRequest) {
  try {
    const rateLimitResult = await loginRateLimit(request)
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Demasiados intentos de inicio de sesión. Intenta de nuevo en 15 minutos." },
        { status: 429 }
      )
    }

    const body = await request.json()

    const result = loginSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: "Datos inválidos", details: result.error.flatten() }, { status: 400 })
    }

    const { email, password } = result.data

    const db = await getDb()
    
    // Debug: Check all users first
    const allUsers = await db.collection<User>("users").find({}).toArray()
    console.log("[v0] Total users in DB:", allUsers.length)
    allUsers.forEach(u => {
      console.log("[v0] User:", u.email, "isActive:", u.isActive, "role:", u.role)
    })
    
    // Search for user - handle both isActive: true and isActive: undefined (legacy users)
    const user = await db.collection<User>("users").findOne({
      email: email.toLowerCase(),
      $or: [{ isActive: true }, { isActive: { $exists: false } }, { isActive: undefined }],
    })

    console.log("[v0] Login attempt for:", email.toLowerCase())
    console.log("[v0] User found:", user ? "Yes" : "No")
    if (user) {
      console.log("[v0] User role:", user.role)
    }

    if (!user) {
      console.log("[v0] User not found, returning 401")
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    const isValidPassword = verifyPassword(password, user.password)
    console.log("[v0] Password valid:", isValidPassword)
    if (!isValidPassword) {
      console.log("[v0] Password invalid, returning 401")
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    await createSession(user)
    await updateLastLogin(user._id!.toString())

    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      message: "Inicio de sesión exitoso",
      user: userWithoutPassword,
    })
  } catch {
    return NextResponse.json({ error: "Error al iniciar sesión" }, { status: 500 })
  }
}
