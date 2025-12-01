import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { verifyPassword } from "@/lib/auth/password"
import { createSession, updateLastLogin } from "@/lib/auth/session"
import { loginSchema } from "@/lib/validations/schemas"
import type { User } from "@/lib/db/models"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const result = loginSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: "Datos inválidos", details: result.error.flatten() }, { status: 400 })
    }

    const { email, password } = result.data

    const db = await getDb()
    const user = await db.collection<User>("users").findOne({
      email: email.toLowerCase(),
      isActive: true,
    })

    if (!user) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    const isValidPassword = verifyPassword(password, user.password)
    if (!isValidPassword) {
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
