import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { hasPermission } from "@/lib/auth/permissions"
import { ObjectId } from "mongodb"
import type { Inspection } from "@/lib/db/models"

// GET - Obtener inspección por ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { id } = await params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const db = await getDb()
    const inspection = await db.collection<Inspection>("inspections").findOne({
      _id: new ObjectId(id),
    })

    if (!inspection) {
      return NextResponse.json({ error: "Inspección no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ inspection })
  } catch {
    return NextResponse.json({ error: "Error al obtener inspección" }, { status: 500 })
  }
}

// PUT - Actualizar inspección
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    if (!hasPermission(user.role, "inspections.edit")) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()

    const db = await getDb()

    const updateResult = await db
      .collection("inspections")
      .updateOne({ _id: new ObjectId(id) }, { $set: { ...body, updatedAt: new Date() } })

    if (updateResult.matchedCount === 0) {
      return NextResponse.json({ error: "Inspección no encontrada" }, { status: 404 })
    }

    const updatedInspection = await db.collection("inspections").findOne({
      _id: new ObjectId(id),
    })

    return NextResponse.json({ success: true, inspection: updatedInspection })
  } catch {
    return NextResponse.json({ error: "Error al actualizar inspección" }, { status: 500 })
  }
}
