import { NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || !user._id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const db = await getDb()
    const employees = await db.collection("employees").find({}).toArray()

    return NextResponse.json({ employees })
  } catch (error) {
    console.error("[v0] Employees error:", error)
    return NextResponse.json({ error: "Error al cargar empleados", employees: [] }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || !user._id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { name, lastName, role, specialty, contact, hireDate } = body

    if (!name || !lastName || !role) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    const db = await getDb()
    const result = await db.collection("employees").insertOne({
      name,
      lastName,
      role,
      specialty,
      contact: contact || {},
      hireDate: hireDate ? new Date(hireDate) : new Date(),
      status: "activo",
      createdAt: new Date(),
      createdBy: new ObjectId(user._id),
    })

    return NextResponse.json({
      success: true,
      employeeId: result.insertedId,
    })
  } catch (error) {
    console.error("[v0] Employee create error:", error)
    return NextResponse.json({ error: "Error al crear empleado" }, { status: 500 })
  }
}
