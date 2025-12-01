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
    const payment = await db.collection("payments").findOne({ _id: new ObjectId(id) })

    if (!payment) {
      return NextResponse.json({ error: "Pago no encontrado" }, { status: 404 })
    }

    return NextResponse.json(payment)
  } catch (error) {
    console.error("Error fetching payment:", error)
    return NextResponse.json({ error: "Error al obtener pago" }, { status: 500 })
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

    const result = await db.collection("payments").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...data,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Pago no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ message: "Pago actualizado" })
  } catch (error) {
    console.error("Error updating payment:", error)
    return NextResponse.json({ error: "Error al actualizar pago" }, { status: 500 })
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
    const result = await db.collection("payments").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Pago no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ message: "Pago eliminado" })
  } catch (error) {
    console.error("Error deleting payment:", error)
    return NextResponse.json({ error: "Error al eliminar pago" }, { status: 500 })
  }
}
