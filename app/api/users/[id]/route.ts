import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { hasPermission } from "@/lib/auth/permissions"
import { hashPassword } from "@/lib/auth/password"
import type { User, UserRole } from "@/lib/db/models"
import { activatePortalUser } from "@/lib/users/activate-portal-user"

const USER_ROLES: UserRole[] = ["super_admin", "admin", "gerente", "supervisor", "trabajador", "cliente"]

type RouteParams = { params: Promise<{ id: string }> }

async function getTargetUser(id: string) {
  if (!ObjectId.isValid(id)) return null
  const db = await getDb()
  return db.collection<User>("users").findOne({ _id: new ObjectId(id) })
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    if (!hasPermission(currentUser.role, "users.view")) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const { id } = await params
    const user = await getTargetUser(id)
    if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })

    const { password: _, ...safe } = user
    return NextResponse.json({ user: safe })
  } catch {
    return NextResponse.json({ error: "Error al obtener usuario" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    if (!hasPermission(currentUser.role, "users.edit")) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const { id } = await params
    const target = await getTargetUser(id)
    if (!target) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })

    if (target._id?.toString() === currentUser._id && currentUser.role !== "super_admin") {
      return NextResponse.json({ error: "No puedes modificar tu propio usuario desde aquí" }, { status: 403 })
    }

    if (target.role === "super_admin" && currentUser.role !== "super_admin") {
      return NextResponse.json({ error: "No puedes modificar un super administrador" }, { status: 403 })
    }

    const body = await request.json()
    const update: Record<string, unknown> = { updatedAt: new Date() }

    if (body.name !== undefined) update.name = String(body.name).trim()
    if (body.lastName !== undefined) update.lastName = String(body.lastName).trim()
    if (body.phone !== undefined) update.phone = String(body.phone).trim()
    if (body.isActive !== undefined) update.isActive = Boolean(body.isActive)
    if (body.emailVerified !== undefined) update.emailVerified = Boolean(body.emailVerified)

    const activating =
      (body.isActive === true || body.emailVerified === true) &&
      target.isActive === false &&
      target.role === "cliente"

    if (activating && body.isActive === true && body.emailVerified === true) {
      const result = await activatePortalUser(id)
      if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 })
      const updated = await getTargetUser(id)
      if (!updated) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
      const { password: _, ...safe } = updated
      return NextResponse.json({ success: true, user: safe })
    }

    if (body.role !== undefined) {
      if (!USER_ROLES.includes(body.role)) {
        return NextResponse.json({ error: "Rol inválido" }, { status: 400 })
      }
      if (body.role === "super_admin" && currentUser.role !== "super_admin") {
        return NextResponse.json({ error: "Solo super admin puede asignar ese rol" }, { status: 403 })
      }
      update.role = body.role
    }

    if (body.password) {
      if (String(body.password).length < 8) {
        return NextResponse.json({ error: "La contraseña debe tener al menos 8 caracteres" }, { status: 400 })
      }
      update.password = hashPassword(String(body.password))
    }

    const db = await getDb()
    await db.collection("users").updateOne({ _id: new ObjectId(id) }, { $set: update })

    const updated = await getTargetUser(id)
    if (!updated) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    const { password: _, ...safe } = updated

    return NextResponse.json({ success: true, user: safe })
  } catch {
    return NextResponse.json({ error: "Error al actualizar usuario" }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    if (!hasPermission(currentUser.role, "users.delete")) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const { id } = await params
    if (id === currentUser._id) {
      return NextResponse.json({ error: "No puedes eliminar tu propia cuenta" }, { status: 403 })
    }

    const target = await getTargetUser(id)
    if (!target) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })

    if (target.role === "super_admin") {
      return NextResponse.json({ error: "No se puede eliminar un super administrador" }, { status: 403 })
    }

    const db = await getDb()
    await db.collection("users").deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Error al eliminar usuario" }, { status: 500 })
  }
}
