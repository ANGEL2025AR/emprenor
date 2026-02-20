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
    const requests = await db
      .collection("leave_requests")
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({
      requests: requests.map((r) => ({
        ...r,
        _id: r._id.toString(),
        userId: r.userId?.toString(),
      })),
    })
  } catch {
    return NextResponse.json({ error: "Error al cargar solicitudes" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const body = await request.json()
    const { type, startDate, endDate, reason, attachmentUrl } = body

    const allowedTypes = ["licencia", "vacaciones", "enfermo", "permiso_especial"]
    if (!allowedTypes.includes(type)) {
      return NextResponse.json({ error: "Tipo de solicitud inválido" }, { status: 400 })
    }

    if (!startDate || !endDate) {
      return NextResponse.json({ error: "Fechas requeridas" }, { status: 400 })
    }

    if (!reason || reason.trim().length < 5) {
      return NextResponse.json({ error: "Motivo requerido (min. 5 caracteres)" }, { status: 400 })
    }

    const db = await getDb()
    const result = await db.collection("leave_requests").insertOne({
      userId: new ObjectId(user._id),
      employeeName: `${user.name} ${user.lastName}`,
      type,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason: reason.trim(),
      attachmentUrl: attachmentUrl || null,
      status: "pendiente",
      reviewedBy: null,
      reviewNotes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json({ success: true, id: result.insertedId.toString() })
  } catch {
    return NextResponse.json({ error: "Error al crear solicitud" }, { status: 500 })
  }
}
