import { NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const db = await getDb()
    const file = await db.collection("personnel_files").findOne({ userId: new ObjectId(user._id) })

    if (!file) {
      return NextResponse.json({
        file: {
          userId: user._id,
          afipRegistration: null,
          artCredential: null,
          lifeInsurance: null,
          personalDocs: [],
          medicalExams: [],
          trainings: [],
        },
      })
    }

    return NextResponse.json({
      file: { ...file, _id: file._id.toString(), userId: file.userId?.toString() },
    })
  } catch {
    return NextResponse.json({ error: "Error al cargar legajo" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    if (!["super_admin", "admin", "gerente"].includes(user.role)) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const body = await request.json()
    const allowedFields = [
      "afipRegistration", "artCredential", "lifeInsurance",
      "personalDocs", "medicalExams", "trainings",
      "cuil", "cbu", "obraSocial", "sindicato",
    ]
    const updateData: Record<string, unknown> = {}
    for (const key of allowedFields) {
      if (body[key] !== undefined) updateData[key] = body[key]
    }
    updateData.updatedAt = new Date()

    const db = await getDb()
    const targetUserId = body.targetUserId || user._id

    await db.collection("personnel_files").updateOne(
      { userId: new ObjectId(targetUserId) },
      { $set: updateData },
      { upsert: true },
    )

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Error al actualizar legajo" }, { status: 500 })
  }
}
