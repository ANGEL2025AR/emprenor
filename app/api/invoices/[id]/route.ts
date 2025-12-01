import { NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { ObjectId } from "mongodb"
import { getCurrentUser } from "@/lib/auth/session"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const db = await getDb()
    const invoice = await db.collection("invoices").findOne({ _id: new ObjectId(id) })

    if (!invoice) {
      return NextResponse.json({ error: "Factura no encontrada" }, { status: 404 })
    }

    return NextResponse.json(invoice)
  } catch (error) {
    console.error("Error fetching invoice:", error)
    return NextResponse.json({ error: "Error al obtener factura" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const data = await request.json()
    const db = await getDb()

    const result = await db.collection("invoices").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...data,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Factura no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ message: "Factura actualizada" })
  } catch (error) {
    console.error("Error updating invoice:", error)
    return NextResponse.json({ error: "Error al actualizar factura" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const db = await getDb()
    const result = await db.collection("invoices").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Factura no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ message: "Factura eliminada" })
  } catch (error) {
    console.error("Error deleting invoice:", error)
    return NextResponse.json({ error: "Error al eliminar factura" }, { status: 500 })
  }
}
