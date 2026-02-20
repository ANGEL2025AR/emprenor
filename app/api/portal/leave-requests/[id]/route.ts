import { NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { ObjectId } from "mongodb"

// PATCH: Aprobar/Rechazar solicitud (solo admin/gerente)
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    if (!["super_admin", "admin", "gerente"].includes(user.role)) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const { id } = await params
    if (!ObjectId.isValid(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 })

    const body = await request.json()
    const { status, reviewNotes } = body

    if (!["aprobado", "rechazado"].includes(status)) {
      return NextResponse.json({ error: "Estado inválido" }, { status: 400 })
    }

    const db = await getDb()
    const result = await db.collection("leave_requests").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status,
          reviewedBy: `${user.name} ${user.lastName}`,
          reviewedAt: new Date(),
          reviewNotes: reviewNotes || null,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Error al actualizar solicitud" }, { status: 500 })
  }
}
