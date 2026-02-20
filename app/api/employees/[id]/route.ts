import { NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { ObjectId } from "mongodb"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

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
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const { id } = await params
    const body = await request.json()
    const db = await getDb()

    // Sanitize: only allow known fields
    const allowedFields = [
      "name", "firstName", "lastName", "email", "phone", "position", "role",
      "department", "specialty", "salary", "hireDate", "address", "dni",
      "emergencyContact", "emergencyPhone", "notes", "status", "contact"
    ]
    const data: Record<string, unknown> = {}
    for (const key of allowedFields) {
      if (body[key] !== undefined) data[key] = body[key]
    }
    data.updatedAt = new Date()

    const result = await db.collection("employees").updateOne(
      { _id: new ObjectId(id) },
      { $set: data },
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
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

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
