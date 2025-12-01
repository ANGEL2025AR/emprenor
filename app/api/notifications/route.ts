import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { ObjectId } from "mongodb"
import type { Notification } from "@/lib/db/models"

// GET - Listar notificaciones del usuario
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || !user._id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get("unread") === "true"
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    const db = await getDb()

    const userObjectId = new ObjectId(user._id)
    const filter: Record<string, unknown> = { userId: userObjectId }
    if (unreadOnly) filter.read = false

    const [notifications, unreadCount] = await Promise.all([
      db.collection<Notification>("notifications").find(filter).sort({ createdAt: -1 }).limit(limit).toArray(),
      db.collection("notifications").countDocuments({ userId: userObjectId, read: false }),
    ])

    return NextResponse.json({ notifications, unreadCount })
  } catch {
    return NextResponse.json({ error: "Error al obtener notificaciones" }, { status: 500 })
  }
}

// POST - Crear notificación (interno)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    const adminRoles: string[] = ["super_admin", "admin"]
    if (!user || !adminRoles.includes(user.role)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { userIds, type, category, title, message, link, data } = body

    const db = await getDb()

    const notifications = userIds.map((userId: string) => ({
      userId: new ObjectId(userId),
      type,
      category,
      title,
      message,
      data,
      link,
      read: false,
      channels: ["app"],
      createdAt: new Date(),
      updatedAt: new Date(),
    }))

    await db.collection("notifications").insertMany(notifications)

    return NextResponse.json({ success: true, count: notifications.length }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Error al crear notificaciones" }, { status: 500 })
  }
}
