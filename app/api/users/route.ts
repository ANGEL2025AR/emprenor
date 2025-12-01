import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { hasPermission } from "@/lib/auth/permissions"
import { hashPassword } from "@/lib/auth/password"
import { userSchema } from "@/lib/validations/schemas"
import type { User } from "@/lib/db/models"

// GET - Listar usuarios
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    if (!hasPermission(user.role, "users.view")) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role")
    const search = searchParams.get("search")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const skip = (page - 1) * limit

    const db = await getDb()

    const filter: Record<string, unknown> = {}
    if (role) filter.role = role
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ]
    }

    const [users, total] = await Promise.all([
      db
        .collection<User>("users")
        .find(filter, { projection: { password: 0 } })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection("users").countDocuments(filter),
    ])

    return NextResponse.json({
      users,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch {
    return NextResponse.json({ error: "Error al obtener usuarios" }, { status: 500 })
  }
}

// POST - Crear usuario (admin)
export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    if (!hasPermission(currentUser.role, "users.create")) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const body = await request.json()
    const result = userSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: "Datos inválidos", details: result.error.flatten() }, { status: 400 })
    }

    const db = await getDb()

    // Verificar email único
    const existing = await db.collection("users").findOne({ email: result.data.email.toLowerCase() })
    if (existing) {
      return NextResponse.json({ error: "El email ya existe" }, { status: 409 })
    }

    // Crear con contraseña temporal
    const tempPassword = Math.random().toString(36).slice(-8) + "A1"
    const hashedPassword = hashPassword(tempPassword)

    const newUser: Omit<User, "_id"> = {
      ...result.data,
      email: result.data.email.toLowerCase(),
      password: hashedPassword,
      permissions: [],
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const insertResult = await db.collection("users").insertOne(newUser)

    return NextResponse.json(
      {
        success: true,
        user: { ...newUser, _id: insertResult.insertedId, password: undefined },
        tempPassword, // En producción, enviar por email
      },
      { status: 201 },
    )
  } catch {
    return NextResponse.json({ error: "Error al crear usuario" }, { status: 500 })
  }
}
