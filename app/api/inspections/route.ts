import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { hasPermission } from "@/lib/auth/permissions"
import { inspectionSchema } from "@/lib/validations/schemas"
import { generateCode } from "@/lib/auth/password"
import { ObjectId } from "mongodb"
import type { Inspection } from "@/lib/db/models"

// GET - Listar inspecciones
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")
    const result = searchParams.get("result")
    const type = searchParams.get("type")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const skip = (page - 1) * limit

    const db = await getDb()

    const filter: Record<string, unknown> = {}
    if (projectId) filter.projectId = new ObjectId(projectId)
    if (result) filter.result = result
    if (type) filter.type = type

    const [inspections, total] = await Promise.all([
      db.collection<Inspection>("inspections").find(filter).sort({ date: -1 }).skip(skip).limit(limit).toArray(),
      db.collection("inspections").countDocuments(filter),
    ])

    return NextResponse.json({
      inspections,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch {
    return NextResponse.json({ error: "Error al obtener inspecciones" }, { status: 500 })
  }
}

// POST - Crear inspección
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || !user._id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    if (!hasPermission(user.role, "inspections.create")) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const body = await request.json()
    const validationResult = inspectionSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({ error: "Datos inválidos", details: validationResult.error.flatten() }, { status: 400 })
    }

    const db = await getDb()
    const code = generateCode("INS")

    const { projectId, taskId, title, type, date, location, items, observations, description } = validationResult.data

    const userObjectId = new ObjectId(user._id)

    const newInspection: Omit<Inspection, "_id"> = {
      projectId: new ObjectId(projectId),
      taskId: taskId ? new ObjectId(taskId) : undefined,
      code,
      type,
      title,
      description: description || "",
      date: new Date(date),
      inspectorId: userObjectId,
      location,
      result: "pendiente",
      items: items || [],
      observations: observations || "",
      requiredActions: [],
      signatures: {},
      attachments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const insertResult = await db.collection("inspections").insertOne(newInspection)

    return NextResponse.json(
      {
        success: true,
        inspection: { ...newInspection, _id: insertResult.insertedId },
      },
      { status: 201 },
    )
  } catch {
    return NextResponse.json({ error: "Error al crear inspección" }, { status: 500 })
  }
}
