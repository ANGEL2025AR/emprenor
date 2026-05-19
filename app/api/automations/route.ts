import { NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { hasPermission } from "@/lib/auth/permissions"
import { AUTOMATION_CATALOG } from "@/lib/automations/catalog"
import type { UserRole } from "@/lib/db/models"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    if (!hasPermission(user.role as UserRole, "admin.access")) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const db = await getDb()
    const overrides = (await db.collection("automation_presets").find({}).toArray()) as unknown as Array<{
      presetId: string
      enabled?: boolean
    }>

    const overrideMap = new Map(overrides.map((o) => [o.presetId, o.enabled]))

    const automations = AUTOMATION_CATALOG.map((item) => ({
      ...item,
      enabled: overrideMap.has(item._id) ? Boolean(overrideMap.get(item._id)) : item.enabled,
    }))

    const custom = await db.collection("automations").find({}).sort({ createdAt: -1 }).limit(50).toArray()

    const customMapped = custom.map((doc) => ({
      _id: String(doc._id),
      name: String(doc.name || ""),
      description: String(doc.description || ""),
      type: String(doc.type || "custom"),
      trigger: String(doc.trigger || ""),
      actions: Array.isArray(doc.actions) ? doc.actions : [],
      enabled: doc.enabled !== false,
      executionCount: Number(doc.executionCount || 0),
    }))

    return NextResponse.json({ automations: [...automations, ...customMapped] })
  } catch (error) {
    console.error("Error fetching automations:", error)
    return NextResponse.json({ error: "Error al obtener automatizaciones" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    if (!hasPermission(user.role as UserRole, "admin.access")) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const body = await request.json()
    const name = String(body.name || "").trim()
    if (!name) {
      return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 })
    }

    const db = await getDb()
    const doc = {
      name,
      description: String(body.description || ""),
      type: String(body.type || "custom"),
      trigger: String(body.trigger || ""),
      actions: Array.isArray(body.actions) ? body.actions : [],
      enabled: body.isActive !== false && body.enabled !== false,
      executionCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: user._id,
    }

    const result = await db.collection("automations").insertOne(doc)
    return NextResponse.json({ success: true, _id: result.insertedId.toString() }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Error al crear automatización" }, { status: 500 })
  }
}
