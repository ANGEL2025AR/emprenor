import { NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { ObjectId } from "mongodb"

// PATCH: Responder ticket o cambiar estado
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const { id } = await params
    if (!ObjectId.isValid(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 })

    const body = await request.json()
    const { message, status } = body

    const db = await getDb()
    const ticket = await db.collection("help_desk_tickets").findOne({ _id: new ObjectId(id) })

    if (!ticket) return NextResponse.json({ error: "Ticket no encontrado" }, { status: 404 })

    // Solo el creador o admins pueden interactuar
    const isOwner = ticket.userId.toString() === user._id
    const isAdmin = ["super_admin", "admin", "gerente"].includes(user.role)
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const update: Record<string, unknown> = { updatedAt: new Date() }

    if (message?.trim()) {
      update.$push = {
        messages: {
          from: `${user.name} ${user.lastName}`,
          role: user.role,
          message: message.trim(),
          createdAt: new Date(),
        },
      }
    }

    if (status && isAdmin) {
      const validStatuses = ["abierto", "en_proceso", "resuelto", "cerrado"]
      if (validStatuses.includes(status)) {
        update.status = status
      }
    }

    const { $push, ...setFields } = update as Record<string, unknown> & { $push?: unknown }
    const updateOp: Record<string, unknown> = { $set: setFields }
    if ($push) updateOp.$push = $push

    await db.collection("help_desk_tickets").updateOne({ _id: new ObjectId(id) }, updateOp)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Error al actualizar ticket" }, { status: 500 })
  }
}
