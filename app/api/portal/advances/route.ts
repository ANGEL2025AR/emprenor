import { NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { ObjectId } from "mongodb"
import { requirePortalApi, requirePortalApiEmployeeOrAdmin } from "@/lib/auth/portal-api"
import { hasPermission } from "@/lib/auth/permissions"
import type { UserRole } from "@/lib/db/models"

export async function GET() {
  try {
    const auth = await requirePortalApiEmployeeOrAdmin("portal.advances")
    if ("response" in auth) return auth.response
    const { user, isAdmin } = auth

    const db = await getDb()
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
    const auth = await requirePortalApi("portal.advances")
    if ("response" in auth) return auth.response
    const user = auth.user

    if (hasPermission(user.role as UserRole, "portal.admin")) {
      return NextResponse.json(
        { error: "Los administradores gestionan adelantos desde Administración Portal Empleados" },
        { status: 403 },
      )
    }

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
