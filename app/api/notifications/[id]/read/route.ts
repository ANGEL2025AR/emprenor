import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { ObjectId } from "mongodb"

// PUT - Marcar notificación como leída
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user || !user._id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { id } = await params

    const db = await getDb()

    await db
      .collection("notifications")
      .updateOne(
        { _id: new ObjectId(id), userId: new ObjectId(user._id) },
        { $set: { read: true, readAt: new Date() } },
      )

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Error al actualizar notificación" }, { status: 500 })
  }
}
