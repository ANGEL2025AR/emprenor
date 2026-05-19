import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { hashPassword } from "@/lib/auth/password"
import { getAdminSetupKey } from "@/lib/env"
import type { User } from "@/lib/db/models"

export async function GET() {
  try {
    const db = await getDb()
    const existingAdmin = await db.collection("users").findOne({ role: "super_admin" })
    return NextResponse.json({
      setupAvailable: !existingAdmin,
      requiresSetupKey: Boolean(getAdminSetupKey()),
    })
  } catch {
    return NextResponse.json({ setupAvailable: false, requiresSetupKey: true })
  }
}

export async function POST(request: NextRequest) {
  try {
    const setupKey = getAdminSetupKey()
    if (!setupKey) {
      return NextResponse.json(
        { error: "Configuración inicial deshabilitada. Define ADMIN_SETUP_KEY en el servidor." },
        { status: 503 },
      )
    }

    const body = await request.json()
    const { secretKey, email, password, name, lastName, phone } = body

    if (secretKey !== setupKey) {
      return NextResponse.json({ error: "Clave de configuración inválida" }, { status: 401 })
    }

    if (!email || !password || !name || !lastName) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos: email, password, name, lastName" },
        { status: 400 },
      )
    }

    if (String(password).length < 10) {
      return NextResponse.json({ error: "La contraseña debe tener al menos 10 caracteres" }, { status: 400 })
    }

    const db = await getDb()

    const existingAdmin = await db.collection("users").findOne({
      role: "super_admin",
    })

    if (existingAdmin) {
      return NextResponse.json(
        { error: "Ya existe un administrador. Usa el panel de usuarios para crear más." },
        { status: 409 },
      )
    }

    const existingUser = await db.collection("users").findOne({
      email: email.toLowerCase(),
    })

    if (existingUser) {
      return NextResponse.json({ error: "El email ya está registrado" }, { status: 409 })
    }

    const hashedPassword = hashPassword(password)

    const adminUser: Omit<User, "_id"> = {
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      lastName,
      phone: phone || "",
      role: "super_admin",
      permissions: [
        "projects.create",
        "projects.edit",
        "projects.delete",
        "projects.view",
        "tasks.create",
        "tasks.edit",
        "tasks.delete",
        "tasks.view",
        "inspections.create",
        "inspections.edit",
        "inspections.delete",
        "inspections.view",
        "finances.view",
        "finances.create",
        "finances.approve",
        "documents.upload",
        "documents.delete",
        "documents.view",
        "users.create",
        "users.edit",
        "users.delete",
        "users.view",
        "settings.edit",
      ],
      isActive: true,
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await db.collection("users").insertOne(adminUser)

    return NextResponse.json(
      {
        success: true,
        message: "Administrador creado exitosamente",
        user: {
          email: adminUser.email,
          name: adminUser.name,
          lastName: adminUser.lastName,
          role: adminUser.role,
        },
      },
      { status: 201 },
    )
  } catch {
    return NextResponse.json({ error: "Error al crear administrador" }, { status: 500 })
  }
}
