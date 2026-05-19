import { NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { ObjectId } from "mongodb"
import { logActivity } from "@/lib/audit/audit-log"
import { serializeRFI } from "@/lib/rfis/serialize-rfi"
import { canAccessProjectId, withProjectScope } from "@/lib/auth/project-access"
import { hasPermission } from "@/lib/auth/permissions"
import type { UserRole } from "@/lib/db/models"

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    if (!hasPermission(user.role as UserRole, "projects.view")) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")
    const status = searchParams.get("status")

    const db = await getDb()
    const query: Record<string, unknown> = {}

    if (projectId) {
      if (!ObjectId.isValid(projectId)) {
        return NextResponse.json({ error: "Proyecto inválido" }, { status: 400 })
      }
      query.projectId = new ObjectId(projectId)
    }

    if (status) {
      query.status = status
    }

    const scopedQuery = await withProjectScope(user, query)
    const rfis = await db.collection("rfis").find(scopedQuery).sort({ requestedDate: -1 }).limit(100).toArray()

    return NextResponse.json(rfis.map((r) => serializeRFI(r as Record<string, unknown>)))
  } catch (error) {
    console.error("Error fetching RFIs:", error)
    return NextResponse.json({ error: "Error al obtener RFIs" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const projectId = String(body.projectId || "")
    const subject = String(body.subject || "").trim()
    const description = String(body.description || "").trim()

    if (!ObjectId.isValid(projectId)) {
      return NextResponse.json({ error: "Proyecto inválido" }, { status: 400 })
    }

    if (!subject || !description) {
      return NextResponse.json({ error: "Asunto y descripción son obligatorios" }, { status: 400 })
    }

    if (!(await canAccessProjectId(user, projectId))) {
      return NextResponse.json({ error: "Sin acceso al proyecto" }, { status: 403 })
    }

    const requiredResponseDate = body.requiredResponseDate ? new Date(body.requiredResponseDate) : null
    if (!requiredResponseDate || Number.isNaN(requiredResponseDate.getTime())) {
      return NextResponse.json({ error: "Fecha de respuesta requerida inválida" }, { status: 400 })
    }

    const db = await getDb()
    const year = new Date().getFullYear()
    const count = await db.collection("rfis").countDocuments({
      rfiNumber: { $regex: new RegExp(`^RFI-${year}-`) },
    })
    const rfiNumber = `RFI-${year}-${String(count + 1).padStart(4, "0")}`

    const rfi = {
      projectId: new ObjectId(projectId),
      rfiNumber,
      subject,
      description,
      discipline: body.discipline || "otro",
      requestedBy: new ObjectId(user._id),
      requestedDate: new Date(),
      requiredResponseDate,
      priority: body.priority || "normal",
      location: String(body.location || ""),
      drawingReferences: body.drawingReferences || [],
      specificationReferences: body.specificationReferences || [],
      cost: body.cost || { hasImpact: false },
      schedule: body.schedule || { hasImpact: false },
      status: "abierto",
      reviewers: [],
      distribution: [],
      comments: [],
      attachments: body.attachments || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("rfis").insertOne(rfi)

    await logActivity(
      user._id,
      "create",
      "rfi",
      result.insertedId,
      null,
      rfi,
      request.headers.get("x-forwarded-for") || "unknown",
      request.headers.get("user-agent") || "unknown",
    )

    return NextResponse.json({
      ...serializeRFI({ ...rfi, _id: result.insertedId } as Record<string, unknown>),
    })
  } catch (error) {
    console.error("Error creating RFI:", error)
    return NextResponse.json({ error: "Error al crear RFI" }, { status: 500 })
  }
}
