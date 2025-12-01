import { NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { ObjectId } from "mongodb"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const db = await getDb()

    const incident = await db.collection("incidents").findOne({ _id: new ObjectId(id) })

    if (!incident) {
      return NextResponse.json({ error: "Incidencia no encontrada" }, { status: 404 })
    }

    return NextResponse.json(incident)
  } catch (error) {
    console.error("[API] Error getting incident:", error)
    return NextResponse.json({ error: "Error al obtener incidencia" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await request.json()
    const db = await getDb()

    const result = await db.collection("incidents").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...data,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Incidencia no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API] Error updating incident:", error)
    return NextResponse.json({ error: "Error al actualizar incidencia" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const db = await getDb()

    const result = await db.collection("incidents").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Incidencia no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API] Error deleting incident:", error)
    return NextResponse.json({ error: "Error al eliminar incidencia" }, { status: 500 })
  }
}
