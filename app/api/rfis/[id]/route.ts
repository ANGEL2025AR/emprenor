import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { logActivity } from "@/lib/audit/audit-log"
import { serializeRFI } from "@/lib/rfis/serialize-rfi"
import { canAccessProjectId } from "@/lib/auth/project-access"
import { hasPermission } from "@/lib/auth/permissions"
import type { UserRole } from "@/lib/db/models"

type RouteParams = { params: Promise<{ id: string }> }

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const { id } = await params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const db = await getDb()
    const rfi = await db.collection("rfis").findOne({ _id: new ObjectId(id) })

    if (!rfi) {
      return NextResponse.json({ error: "RFI no encontrado" }, { status: 404 })
    }

    if (!hasPermission(user.role as UserRole, "projects.view")) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const projectId = String(rfi.projectId || "")
    if (projectId && !(await canAccessProjectId(user, projectId))) {
      return NextResponse.json({ error: "Sin acceso al proyecto" }, { status: 403 })
    }

    return NextResponse.json(serializeRFI(rfi as Record<string, unknown>))
  } catch (error) {
    console.error("Error fetching RFI:", error)
    return NextResponse.json({ error: "Error al obtener RFI" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const { id } = await params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const body = await request.json()
    const db = await getDb()
    const existing = await db.collection("rfis").findOne({ _id: new ObjectId(id) })

    if (!existing) {
      return NextResponse.json({ error: "RFI no encontrado" }, { status: 404 })
    }

    const projectId = String(existing.projectId || "")
    if (projectId && !(await canAccessProjectId(user, projectId))) {
      return NextResponse.json({ error: "Sin acceso al proyecto" }, { status: 403 })
    }

    const update: Record<string, unknown> = { updatedAt: new Date() }

    if (body.status) update.status = body.status
    if (body.priority) update.priority = body.priority
    if (body.subject) update.subject = body.subject
    if (body.description) update.description = body.description
    if (body.location !== undefined) update.location = body.location

    if (body.responseText) {
      update.response = {
        respondedBy: new ObjectId(user._id),
        respondedDate: new Date(),
        responseText: String(body.responseText),
        recommendation: String(body.recommendation || ""),
        drawingsRequired: Boolean(body.drawingsRequired),
      }
      update.status = body.status || "respondido"
    }

    if (body.comment) {
      const comments = Array.isArray(existing.comments) ? [...existing.comments] : []
      comments.push({
        userId: new ObjectId(user._id),
        comment: String(body.comment),
        date: new Date(),
      })
      update.comments = comments
    }

    await db.collection("rfis").updateOne({ _id: new ObjectId(id) }, { $set: update })
    const updated = await db.collection("rfis").findOne({ _id: new ObjectId(id) })

    if (!updated) {
      return NextResponse.json({ error: "RFI no encontrado" }, { status: 404 })
    }

    await logActivity(
      user._id,
      "update",
      "rfi",
      new ObjectId(id),
      existing as Record<string, unknown>,
      updated as Record<string, unknown>,
      request.headers.get("x-forwarded-for") || "unknown",
      request.headers.get("user-agent") || "unknown",
    )

    return NextResponse.json(serializeRFI(updated as Record<string, unknown>))
  } catch (error) {
    console.error("Error updating RFI:", error)
    return NextResponse.json({ error: "Error al actualizar RFI" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    if (!["super_admin", "admin", "gerente"].includes(user.role)) {
      return NextResponse.json({ error: "Sin permisos para eliminar" }, { status: 403 })
    }

    const { id } = await params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const db = await getDb()
    const result = await db.collection("rfis").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "RFI no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting RFI:", error)
    return NextResponse.json({ error: "Error al eliminar RFI" }, { status: 500 })
  }
}
