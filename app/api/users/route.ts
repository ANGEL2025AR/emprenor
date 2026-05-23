import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { hasPermission } from "@/lib/auth/permissions"
import { hashPassword } from "@/lib/auth/password"
import type { User } from "@/lib/db/models"
import { assignClientUserToProjects } from "@/lib/clients/project-link"

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

    if (!body.password || body.password.length < 8) {
      return NextResponse.json({ error: "La contraseña debe tener al menos 8 caracteres" }, { status: 400 })
    }

    const db = await getDb()

    // Verificar email único
    const existing = await db.collection("users").findOne({ email: body.email.toLowerCase() })
    if (existing) {
      return NextResponse.json({ error: "El email ya existe" }, { status: 409 })
    }

    const hashedPassword = hashPassword(body.password)

    const newUser: Omit<User, "_id"> = {
      email: body.email.toLowerCase(),
      password: hashedPassword,
      name: body.name,
      lastName: body.lastName,
      phone: body.phone || "",
      role: body.role,
      permissions: [],
      isActive: body.isActive !== false,
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const insertResult = await db.collection("users").insertOne(newUser)

    if (body.role === "cliente" && typeof body.linkedClientId === "string" && body.linkedClientId) {
      const clientOid = new ObjectId(body.linkedClientId)
      await db.collection("users").updateOne(
        { _id: insertResult.insertedId },
        { $set: { linkedClientId: clientOid, updatedAt: new Date() } },
      )
      await db.collection("clients").updateOne(
        { _id: clientOid },
        { $set: { userId: insertResult.insertedId, updatedAt: new Date() } },
      )
      await assignClientUserToProjects(insertResult.insertedId.toString(), body.linkedClientId)
    }

    return NextResponse.json(
      {
        success: true,
        user: { ...newUser, _id: insertResult.insertedId, password: undefined },
      },
      { status: 201 },
    )
  } catch {
    return NextResponse.json({ error: "Error al crear usuario" }, { status: 500 })
  }
}
