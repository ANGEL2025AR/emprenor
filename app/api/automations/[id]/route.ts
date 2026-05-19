import { NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { hasPermission } from "@/lib/auth/permissions"
import { getCatalogAutomation } from "@/lib/automations/catalog"
import { ObjectId } from "mongodb"
import type { UserRole } from "@/lib/db/models"

type RouteParams = { params: Promise<{ id: string }> }

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    if (!hasPermission(user.role as UserRole, "admin.access")) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const { id } = await params
    const preset = getCatalogAutomation(id)
    if (preset) {
      const db = await getDb()
      const override = await db.collection("automation_presets").findOne({ presetId: id })
      return NextResponse.json({
        ...preset,
        enabled: override?.enabled !== undefined ? Boolean(override.enabled) : preset.enabled,
      })
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Automatización no encontrada" }, { status: 404 })
    }

    const db = await getDb()
    const automation = await db.collection("automations").findOne({ _id: new ObjectId(id) })
    if (!automation) {
      return NextResponse.json({ error: "Automatización no encontrada" }, { status: 404 })
    }

    return NextResponse.json(automation)
  } catch {
    return NextResponse.json({ error: "Error al obtener automatización" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    if (!hasPermission(user.role as UserRole, "admin.access")) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const { id } = await params
    const data = await request.json()
    const db = await getDb()

    if (getCatalogAutomation(id)) {
      await db.collection("automation_presets").updateOne(
        { presetId: id },
        { $set: { presetId: id, enabled: Boolean(data.enabled), updatedAt: new Date() } },
        { upsert: true },
      )
      return NextResponse.json({ success: true })
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Automatización no encontrada" }, { status: 404 })
    }

    const sanitized: Record<string, unknown> = { updatedAt: new Date() }
    if (data.enabled !== undefined) sanitized.enabled = Boolean(data.enabled)
    if (data.name) sanitized.name = String(data.name)
    if (data.description) sanitized.description = String(data.description)

    const result = await db.collection("automations").updateOne({ _id: new ObjectId(id) }, { $set: sanitized })
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Automatización no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Error al actualizar automatización" }, { status: 500 })
  }
}

export async function PUT(request: Request, ctx: RouteParams) {
  return PATCH(request, ctx)
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    if (!hasPermission(user.role as UserRole, "admin.access")) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const { id } = await params
    if (getCatalogAutomation(id)) {
      return NextResponse.json({ error: "Las plantillas del sistema no se pueden eliminar" }, { status: 400 })
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const db = await getDb()
    const result = await db.collection("automations").deleteOne({ _id: new ObjectId(id) })
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Automatización no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Error al eliminar automatización" }, { status: 500 })
  }
}
