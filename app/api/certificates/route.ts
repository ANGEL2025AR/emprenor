import { NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { ObjectId } from "mongodb"
import { hasPermission } from "@/lib/auth/permissions"
import { withProjectScope } from "@/lib/auth/project-access"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || !user._id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    if (!hasPermission(user.role, "certificates.view")) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const db = await getDb()
    const filter = await withProjectScope(user, {})
    const certificates = await db.collection("certificates").find(filter).toArray()

    return NextResponse.json({ certificates })
  } catch (error) {
    console.error("[API] Certificates error:", error)
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
    console.error("[API] Certificate create error:", error)
    return NextResponse.json({ error: "Error al crear certificado" }, { status: 500 })
  }
}
