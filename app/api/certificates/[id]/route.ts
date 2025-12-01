import { NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { ObjectId } from "mongodb"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const db = await getDb()

    const certificate = await db.collection("certificates").findOne({ _id: new ObjectId(id) })

    if (!certificate) {
      return NextResponse.json({ error: "Certificado no encontrado" }, { status: 404 })
    }

    return NextResponse.json(certificate)
  } catch (error) {
    console.error("[API] Error getting certificate:", error)
    return NextResponse.json({ error: "Error al obtener certificado" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await request.json()
    const db = await getDb()

    const result = await db.collection("certificates").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...data,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Certificado no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API] Error updating certificate:", error)
    return NextResponse.json({ error: "Error al actualizar certificado" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const db = await getDb()

    const result = await db.collection("certificates").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Certificado no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API] Error deleting certificate:", error)
    return NextResponse.json({ error: "Error al eliminar certificado" }, { status: 500 })
  }
}
