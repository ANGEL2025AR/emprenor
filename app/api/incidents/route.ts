import { NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || !user._id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const db = await getDb()
    const incidents = await db.collection("incidents").find({}).toArray()

    return NextResponse.json({ incidents })
  } catch (error) {
    console.error("[v0] Incidents error:", error)
    return NextResponse.json({ error: "Error al cargar incidencias", incidents: [] }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || !user._id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { projectId, projectName, title, description, severity } = body

    if (!projectId || !projectName || !title) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    const db = await getDb()
    const result = await db.collection("incidents").insertOne({
      projectId: new ObjectId(projectId),
      projectName,
      title,
      description,
      severity: severity || "media",
      status: "abierta",
      date: new Date(),
      createdAt: new Date(),
      createdBy: new ObjectId(user._id),
    })

    return NextResponse.json({
      success: true,
      incidentId: result.insertedId,
    })
  } catch (error) {
    console.error("[v0] Incident create error:", error)
    return NextResponse.json({ error: "Error al crear incidencia" }, { status: 500 })
  }
}
