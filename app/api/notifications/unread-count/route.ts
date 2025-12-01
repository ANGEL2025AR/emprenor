import { NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { ObjectId } from "mongodb"

// GET - Obtener solo el conteo de notificaciones sin leer
export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || !user._id) {
      return NextResponse.json({ unreadCount: 0 })
    }

    const db = await getDb()
    const unreadCount = await db.collection("notifications").countDocuments({
      userId: new ObjectId(user._id),
      read: false,
    })

    return NextResponse.json({ unreadCount })
  } catch {
    return NextResponse.json({ unreadCount: 0 })
  }
}
