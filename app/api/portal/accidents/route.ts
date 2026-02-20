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
    const reports = await db
      .collection("accident_reports")
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({
      reports: reports.map((r) => ({ ...r, _id: r._id.toString(), userId: r.userId?.toString() })),
    })
  } catch {
    return NextResponse.json({ error: "Error al cargar denuncias" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const body = await request.json()
    const { date, location, description, injuries, witnesses } = body

    if (!date || !location?.trim() || !description?.trim()) {
      return NextResponse.json({ error: "Fecha, lugar y descripción son requeridos" }, { status: 400 })
    }

    const db = await getDb()
    const result = await db.collection("accident_reports").insertOne({
      userId: new ObjectId(user._id),
      employeeName: `${user.name} ${user.lastName}`,
      date: new Date(date),
      location: location.trim(),
      description: description.trim(),
      injuries: injuries || "",
      witnesses: witnesses || "",
      status: "reportado",
      artNotified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json({ success: true, id: result.insertedId.toString() })
  } catch {
    return NextResponse.json({ error: "Error al crear denuncia" }, { status: 500 })
  }
}
