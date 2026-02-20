import { NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const db = await getDb()
    const isAdmin = ["super_admin", "admin", "gerente"].includes(user.role)

    const filter = isAdmin ? {} : { userId: new ObjectId(user._id) }
    const payslips = await db
      .collection("payslips")
      .find(filter)
      .sort({ period: -1 })
      .toArray()

    return NextResponse.json({
      payslips: payslips.map((p) => ({
        ...p,
        _id: p._id.toString(),
        userId: p.userId?.toString(),
      })),
    })
  } catch {
    return NextResponse.json({ error: "Error al cargar recibos" }, { status: 500 })
  }
}

// POST: Cargar un recibo (solo admin)
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    if (!["super_admin", "admin", "gerente"].includes(user.role)) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const body = await request.json()
    const { employeeId, period, grossSalary, deductions, netSalary, pdfUrl, details } = body

    if (!employeeId || !period || !netSalary) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }

    const db = await getDb()
    await db.collection("payslips").insertOne({
      userId: new ObjectId(employeeId),
      period,
      grossSalary: Number(grossSalary) || 0,
      deductions: Number(deductions) || 0,
      netSalary: Number(netSalary) || 0,
      details: details || {},
      pdfUrl: pdfUrl || null,
      status: "emitido",
      createdAt: new Date(),
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Error al crear recibo" }, { status: 500 })
  }
}
