import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { hasPermission } from "@/lib/auth/permissions"
import { canAccessProjectId } from "@/lib/auth/project-access"
import { serializePunchList } from "@/lib/punch-lists/serialize-punch-list"
import type { UserRole } from "@/lib/db/models"

type RouteParams = { params: Promise<{ id: string }> }

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    if (!hasPermission(user.role as UserRole, "quality.view")) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const { id } = await params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const db = await getDb()
    const doc = await db.collection("punch_lists").findOne({ _id: new ObjectId(id) })
    if (!doc) return NextResponse.json({ error: "Punch list no encontrada" }, { status: 404 })

    const projectId = String(doc.projectId || "")
    if (projectId && !(await canAccessProjectId(user, projectId))) {
      return NextResponse.json({ error: "Sin acceso al proyecto" }, { status: 403 })
    }

    return NextResponse.json(serializePunchList(doc as Record<string, unknown>))
  } catch {
    return NextResponse.json({ error: "Error al obtener punch list" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    if (!hasPermission(user.role as UserRole, "quality.create")) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const { id } = await params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const body = await request.json()
    const db = await getDb()
    const existing = await db.collection("punch_lists").findOne({ _id: new ObjectId(id) })
    if (!existing) return NextResponse.json({ error: "Punch list no encontrada" }, { status: 404 })

    const projectId = String(existing.projectId || "")
    if (projectId && !(await canAccessProjectId(user, projectId))) {
      return NextResponse.json({ error: "Sin acceso al proyecto" }, { status: 403 })
    }

    const update: Record<string, unknown> = { updatedAt: new Date() }
    if (body.status) update.status = body.status
    if (body.listName) update.listName = String(body.listName).trim()
    if (body.description !== undefined) update.description = String(body.description)
    if (Array.isArray(body.items)) {
      update.items = body.items
      update.summary = {
        totalItems: body.items.length,
        openItems: body.items.filter((i: { status?: string }) => i.status === "abierto").length,
        inProgressItems: body.items.filter((i: { status?: string }) => i.status === "en_progreso").length,
        resolvedItems: body.items.filter((i: { status?: string }) => i.status === "resuelto").length,
        closedItems: body.items.filter((i: { status?: string }) => i.status === "cerrado").length,
        criticalItems: body.items.filter((i: { priority?: string }) => i.priority === "critica").length,
      }
    }

    await db.collection("punch_lists").updateOne({ _id: new ObjectId(id) }, { $set: update })
    const updated = await db.collection("punch_lists").findOne({ _id: new ObjectId(id) })
    return NextResponse.json(serializePunchList(updated as Record<string, unknown>))
  } catch {
    return NextResponse.json({ error: "Error al actualizar punch list" }, { status: 500 })
  }
}
