import { NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { ObjectId } from "mongodb"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const db = await getDb()

    const automation = await db.collection("automations").findOne({ _id: new ObjectId(id) })

    if (!automation) {
      return NextResponse.json({ error: "Automatización no encontrada" }, { status: 404 })
    }

    return NextResponse.json(automation)
  } catch (error) {
    console.error("[API] Error getting automation:", error)
    return NextResponse.json({ error: "Error al obtener automatización" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await request.json()
    const db = await getDb()

    const result = await db.collection("automations").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...data,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Automatización no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API] Error updating automation:", error)
    return NextResponse.json({ error: "Error al actualizar automatización" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const db = await getDb()

    const result = await db.collection("automations").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Automatización no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API] Error deleting automation:", error)
    return NextResponse.json({ error: "Error al eliminar automatización" }, { status: 500 })
  }
}
