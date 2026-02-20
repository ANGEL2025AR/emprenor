import { NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const db = await getDb()
    const announcements = await db
      .collection("internal_announcements")
      .find({ $or: [{ targetRoles: user.role }, { targetRoles: "all" }] })
      .sort({ createdAt: -1 })
      .limit(30)
      .toArray()

    return NextResponse.json({
      announcements: announcements.map((a) => ({ ...a, _id: a._id.toString() })),
    })
  } catch {
    return NextResponse.json({ error: "Error al cargar comunicaciones" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    if (!["super_admin", "admin", "gerente"].includes(user.role)) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const body = await request.json()
    const { title, content, targetRoles, priority } = body

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json({ error: "Título y contenido son requeridos" }, { status: 400 })
    }

    const db = await getDb()
    await db.collection("internal_announcements").insertOne({
      title: title.trim(),
      content: content.trim(),
      targetRoles: targetRoles || "all",
      priority: priority || "normal",
      author: `${user.name} ${user.lastName}`,
      authorId: new ObjectId(user._id),
      readBy: [],
      createdAt: new Date(),
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Error al crear comunicación" }, { status: 500 })
  }
}
