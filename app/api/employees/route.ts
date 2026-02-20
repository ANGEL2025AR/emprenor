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

    // Support both form format (name as full name) and API format (name + lastName)
    const fullName = body.name || ""
    const nameParts = fullName.split(" ")
    const firstName = body.firstName || nameParts[0] || fullName
    const lastName = body.lastName || nameParts.slice(1).join(" ") || ""
    const role = body.role || body.position || ""

    if (!fullName || !role) {
      return NextResponse.json({ error: "Nombre y cargo son requeridos" }, { status: 400 })
    }

    const db = await getDb()
    const result = await db.collection("employees").insertOne({
      name: fullName,
      firstName,
      lastName,
      role,
      position: body.position || role,
      specialty: body.specialty || "",
      email: body.email || "",
      phone: body.phone || "",
      dni: body.dni || "",
      address: body.address || "",
      salary: Number(body.salary) || 0,
      contact: body.contact || { email: body.email, phone: body.phone },
      hireDate: body.hireDate ? new Date(body.hireDate) : new Date(),
      emergencyContact: body.emergencyContact || "",
      emergencyPhone: body.emergencyPhone || "",
      notes: body.notes || "",
      status: "activo",
      createdAt: new Date(),
      updatedAt: new Date(),
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
