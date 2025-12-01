import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const db = await getDb()

    const client = await db.collection("clients").findOne({
      _id: new ObjectId(id),
    })

    if (!client) {
      return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 })
    }

    const projects = await db.collection("projects").countDocuments({
      "clientInfo.email": client.email,
    })

    const invoices = await db
      .collection("invoices")
      .find({
        clientEmail: client.email,
      })
      .toArray()

    const totalInvoiced = invoices.reduce((sum, inv) => sum + (inv.total || 0), 0)

    return NextResponse.json({
      ...client,
      stats: {
        projects,
        totalInvoiced,
      },
    })
  } catch (error) {
    console.error("Error fetching client:", error)
    return NextResponse.json({ error: "Error al obtener el cliente" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await request.json()
    const db = await getDb()

    const result = await db.collection("clients").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...data,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating client:", error)
    return NextResponse.json({ error: "Error al actualizar el cliente" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const db = await getDb()

    const result = await db.collection("clients").deleteOne({
      _id: new ObjectId(id),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting client:", error)
    return NextResponse.json({ error: "Error al eliminar el cliente" }, { status: 500 })
  }
}
