import { NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { ObjectId } from "mongodb"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const db = await getDb()

    const employee = await db.collection("employees").findOne({ _id: new ObjectId(id) })

    if (!employee) {
      return NextResponse.json({ error: "Empleado no encontrado" }, { status: 404 })
    }

    return NextResponse.json(employee)
  } catch (error) {
    console.error("[API] Error getting employee:", error)
    return NextResponse.json({ error: "Error al obtener empleado" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await request.json()
    const db = await getDb()

    const result = await db.collection("employees").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...data,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Empleado no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API] Error updating employee:", error)
    return NextResponse.json({ error: "Error al actualizar empleado" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const db = await getDb()

    const result = await db.collection("employees").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Empleado no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API] Error deleting employee:", error)
    return NextResponse.json({ error: "Error al eliminar empleado" }, { status: 500 })
  }
}
