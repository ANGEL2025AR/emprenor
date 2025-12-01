import { NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { ObjectId } from "mongodb"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const db = await getDb()

    const supplier = await db.collection("suppliers").findOne({ _id: new ObjectId(id) })

    if (!supplier) {
      return NextResponse.json({ error: "Proveedor no encontrado" }, { status: 404 })
    }

    return NextResponse.json(supplier)
  } catch (error) {
    console.error("[API] Error getting supplier:", error)
    return NextResponse.json({ error: "Error al obtener proveedor" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await request.json()
    const db = await getDb()

    const result = await db.collection("suppliers").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...data,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Proveedor no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API] Error updating supplier:", error)
    return NextResponse.json({ error: "Error al actualizar proveedor" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const db = await getDb()

    const result = await db.collection("suppliers").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Proveedor no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API] Error deleting supplier:", error)
    return NextResponse.json({ error: "Error al eliminar proveedor" }, { status: 500 })
  }
}
