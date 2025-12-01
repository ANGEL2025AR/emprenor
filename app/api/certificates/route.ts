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
    const certificates = await db.collection("certificates").find({}).toArray()

    return NextResponse.json({ certificates })
  } catch (error) {
    console.error("[v0] Certificates error:", error)
    return NextResponse.json({ error: "Error al cargar certificados", certificates: [] }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || !user._id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { projectId, projectName, certificateNumber, type, amount, notes } = body

    if (!projectId || !projectName || !certificateNumber) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    const db = await getDb()
    const result = await db.collection("certificates").insertOne({
      projectId: new ObjectId(projectId),
      projectName,
      certificateNumber,
      type: type || "avance_obra",
      status: "pendiente",
      amount: amount ? Number(amount) : 0,
      notes,
      date: new Date(),
      createdAt: new Date(),
      createdBy: new ObjectId(user._id),
    })

    return NextResponse.json({
      success: true,
      certificateId: result.insertedId,
    })
  } catch (error) {
    console.error("[v0] Certificate create error:", error)
    return NextResponse.json({ error: "Error al crear certificado" }, { status: 500 })
  }
}
