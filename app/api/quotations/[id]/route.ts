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
    const quotation = await db.collection("quotations").findOne({ _id: new ObjectId(id) })

    if (!quotation) {
      return NextResponse.json({ error: "Cotización no encontrada" }, { status: 404 })
    }

    return NextResponse.json(quotation)
  } catch (error) {
    console.error("Error fetching quotation:", error)
    return NextResponse.json({ error: "Error al obtener cotización" }, { status: 500 })
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

    const result = await db.collection("quotations").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...data,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Cotización no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ message: "Cotización actualizada" })
  } catch (error) {
    console.error("Error updating quotation:", error)
    return NextResponse.json({ error: "Error al actualizar cotización" }, { status: 500 })
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
    const result = await db.collection("quotations").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Cotización no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ message: "Cotización eliminada" })
  } catch (error) {
    console.error("Error deleting quotation:", error)
    return NextResponse.json({ error: "Error al eliminar cotización" }, { status: 500 })
  }
}
