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
    const tickets = await db
      .collection("help_desk_tickets")
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({
      tickets: tickets.map((t) => ({
        ...t,
        _id: t._id.toString(),
        userId: t.userId?.toString(),
      })),
    })
  } catch {
    return NextResponse.json({ error: "Error al cargar tickets" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const body = await request.json()
    const { subject, category, priority, message } = body

    if (!subject?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Asunto y mensaje son requeridos" }, { status: 400 })
    }

    const allowedCategories = ["rrhh", "sistemas", "nomina", "legales", "general"]
    if (!allowedCategories.includes(category)) {
      return NextResponse.json({ error: "Categoría inválida" }, { status: 400 })
    }

    const db = await getDb()
    const ticketNumber = `TK-${Date.now().toString(36).toUpperCase()}`

    const result = await db.collection("help_desk_tickets").insertOne({
      userId: new ObjectId(user._id),
      employeeName: `${user.name} ${user.lastName}`,
      ticketNumber,
      subject: subject.trim(),
      category,
      priority: priority || "media",
      messages: [
        {
          from: `${user.name} ${user.lastName}`,
          role: user.role,
          message: message.trim(),
          createdAt: new Date(),
        },
      ],
      status: "abierto",
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json({ success: true, id: result.insertedId.toString(), ticketNumber })
  } catch {
    return NextResponse.json({ error: "Error al crear ticket" }, { status: 500 })
  }
}
