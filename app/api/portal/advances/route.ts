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

    const advances = await db
      .collection("salary_advances")
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({
      advances: advances.map((a) => ({ ...a, _id: a._id.toString(), userId: a.userId?.toString() })),
    })
  } catch {
    return NextResponse.json({ error: "Error al cargar adelantos" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const body = await request.json()
    const { amount, reason } = body

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Monto inválido" }, { status: 400 })
    }

    if (!reason?.trim()) {
      return NextResponse.json({ error: "Motivo requerido" }, { status: 400 })
    }

    const db = await getDb()
    await db.collection("salary_advances").insertOne({
      userId: new ObjectId(user._id),
      employeeName: `${user.name} ${user.lastName}`,
      amount: Number(amount),
      reason: reason.trim(),
      status: "pendiente",
      approvalProgress: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Error al solicitar adelanto" }, { status: 500 })
  }
}
