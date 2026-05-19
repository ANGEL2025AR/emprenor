import { NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { hasPermission } from "@/lib/auth/permissions"
import { linkEmployeeToUserByEmail } from "@/lib/employee-documents/resolve-target"
import { ObjectId } from "mongodb"

type RouteParams = { params: Promise<{ id: string }> }

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    if (!hasPermission(user.role, "employees.view")) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const { id } = await params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

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

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    if (!hasPermission(user.role, "employees.manage")) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const { id } = await params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const body = await request.json()
    const db = await getDb()

    const allowedFields = [
      "name",
      "firstName",
      "lastName",
      "email",
      "phone",
      "position",
      "role",
      "department",
      "specialty",
      "salary",
      "hireDate",
      "address",
      "dni",
      "emergencyContact",
      "emergencyPhone",
      "notes",
      "status",
      "contact",
    ]
    const data: Record<string, unknown> = {}
    for (const key of allowedFields) {
      if (body[key] !== undefined) data[key] = body[key]
    }
    if (typeof data.email === "string") data.email = data.email.toLowerCase()
    data.updatedAt = new Date()

    const employeeId = new ObjectId(id)
    const result = await db.collection("employees").updateOne({ _id: employeeId }, { $set: data })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Empleado no encontrado" }, { status: 404 })
    }

    if (typeof data.email === "string") {
      await linkEmployeeToUserByEmail(employeeId, data.email)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API] Error updating employee:", error)
    return NextResponse.json({ error: "Error al actualizar empleado" }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    if (!hasPermission(user.role, "employees.manage")) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const { id } = await params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const db = await getDb()
    const employeeId = new ObjectId(id)
    const result = await db.collection("employees").deleteOne({ _id: employeeId })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Empleado no encontrado" }, { status: 404 })
    }

    await db.collection("employee_documents").deleteMany({ employeeId })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API] Error deleting employee:", error)
    return NextResponse.json({ error: "Error al eliminar empleado" }, { status: 500 })
  }
}
