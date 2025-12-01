import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { hashPassword } from "@/lib/auth/password"
import { createSession } from "@/lib/auth/session"
import { registerSchema } from "@/lib/validations/schemas"
import type { User } from "@/lib/db/models"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const result = registerSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: "Datos inválidos", details: result.error.flatten() }, { status: 400 })
    }

    const { email, password, name, lastName, phone } = result.data

    const db = await getDb()

    const existingUser = await db.collection("users").findOne({
      email: email.toLowerCase(),
    })

    if (existingUser) {
      return NextResponse.json({ error: "El email ya está registrado" }, { status: 409 })
    }

    const hashedPassword = hashPassword(password)

    const newUser: Omit<User, "_id"> = {
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      lastName,
      phone,
      role: "cliente",
      permissions: [],
      isActive: true,
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const insertResult = await db.collection("users").insertOne(newUser)

    const userWithId = {
      _id: insertResult.insertedId,
      email: newUser.email,
      name: newUser.name,
      lastName: newUser.lastName,
      role: newUser.role,
      password: newUser.password,
      phone: newUser.phone,
      permissions: newUser.permissions,
      isActive: newUser.isActive,
      emailVerified: newUser.emailVerified,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    }

    await createSession(userWithId)

    const { password: _, ...userWithoutPassword } = userWithId

    return NextResponse.json(
      {
        success: true,
        message: "Registro exitoso",
        user: userWithoutPassword,
      },
      { status: 201 },
    )
  } catch {
    return NextResponse.json({ error: "Error al registrar usuario" }, { status: 500 })
  }
}
