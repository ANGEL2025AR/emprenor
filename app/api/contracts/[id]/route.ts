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
    const contract = await db.collection("contracts").findOne({ _id: new ObjectId(id) })

    if (!contract) {
      return NextResponse.json({ error: "Contrato no encontrado" }, { status: 404 })
    }

    return NextResponse.json(contract)
  } catch (error) {
    console.error("Error fetching contract:", error)
    return NextResponse.json({ error: "Error al obtener contrato" }, { status: 500 })
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

    const result = await db.collection("contracts").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...data,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Contrato no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ message: "Contrato actualizado" })
  } catch (error) {
    console.error("Error updating contract:", error)
    return NextResponse.json({ error: "Error al actualizar contrato" }, { status: 500 })
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
    const result = await db.collection("contracts").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Contrato no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ message: "Contrato eliminado" })
  } catch (error) {
    console.error("Error deleting contract:", error)
    return NextResponse.json({ error: "Error al eliminar contrato" }, { status: 500 })
  }
}
