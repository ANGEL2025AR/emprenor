import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const db = await getDb()

    const item = await db.collection("inventory").findOne({
      _id: new ObjectId(id),
    })

    if (!item) {
      return NextResponse.json({ error: "Artículo no encontrado" }, { status: 404 })
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error("Error fetching inventory item:", error)
    return NextResponse.json({ error: "Error al obtener el artículo" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await request.json()
    const db = await getDb()

    let status = "available"
    if (data.quantity === 0) {
      status = "out_of_stock"
    } else if (data.quantity < 10) {
      status = "low"
    }

    const result = await db.collection("inventory").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...data,
          status,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Artículo no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating inventory item:", error)
    return NextResponse.json({ error: "Error al actualizar el artículo" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const db = await getDb()

    const result = await db.collection("inventory").deleteOne({
      _id: new ObjectId(id),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Artículo no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting inventory item:", error)
    return NextResponse.json({ error: "Error al eliminar el artículo" }, { status: 500 })
  }
}
