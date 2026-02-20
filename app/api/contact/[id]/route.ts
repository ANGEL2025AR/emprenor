import { NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { hasPermission } from "@/lib/auth/permissions"
import { ObjectId } from "mongodb"
import type { UserRole } from "@/lib/db/models"

// GET: Obtener un contacto específico
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    if (!hasPermission(user.role as UserRole, "contacts.view")) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const { id } = await params
    if (!ObjectId.isValid(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 })

    const db = await getDb()
    const contacto = await db.collection("contactos").findOne({ _id: new ObjectId(id) })

    if (!contacto) {
      return NextResponse.json({ error: "Contacto no encontrado" }, { status: 404 })
    }

    return NextResponse.json(contacto)
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// PUT: Actualizar estado de un contacto (marcar como resuelto, en proceso, etc.)
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    if (!hasPermission(user.role as UserRole, "contacts.manage")) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const { id } = await params
    if (!ObjectId.isValid(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 })

    const body = await request.json()
    const allowedFields = ["status", "notes", "assignedTo", "priority"]
    const updateData: Record<string, unknown> = {}

    for (const key of allowedFields) {
      if (body[key] !== undefined) updateData[key] = body[key]
    }

    // Validar status
    const validStatuses = ["nuevo", "en_proceso", "resuelto", "descartado"]
    if (updateData.status && !validStatuses.includes(updateData.status as string)) {
      return NextResponse.json({ error: "Estado no válido" }, { status: 400 })
    }

    updateData.updatedAt = new Date()
    updateData.updatedBy = {
      userId: user._id,
      name: `${user.name} ${user.lastName}`,
    }

    if (updateData.status === "resuelto") {
      updateData.resolvedAt = new Date()
      updateData.resolvedBy = {
        userId: user._id,
        name: `${user.name} ${user.lastName}`,
      }
    }

    const db = await getDb()
    const result = await db.collection("contactos").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Contacto no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Contacto actualizado" })
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// DELETE: Eliminar un contacto
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    if (!hasPermission(user.role as UserRole, "contacts.delete")) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const { id } = await params
    if (!ObjectId.isValid(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 })

    const db = await getDb()
    const result = await db.collection("contactos").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Contacto no encontrado" }, { status: 404 })
    }

    // Audit log
    await db.collection("audit_logs").insertOne({
      action: "contact_deleted",
      userId: user._id,
      userName: `${user.name} ${user.lastName}`,
      details: `Contacto ${id} eliminado`,
      timestamp: new Date(),
    })

    return NextResponse.json({ success: true, message: "Contacto eliminado" })
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
