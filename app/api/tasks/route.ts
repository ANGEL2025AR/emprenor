import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { hasPermission } from "@/lib/auth/permissions"
import { taskSchema } from "@/lib/validations/schemas"
import { generateCode } from "@/lib/auth/password"
import { ObjectId } from "mongodb"
import type { Task } from "@/lib/db/models"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || !user._id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")
    const status = searchParams.get("status")
    const assignedTo = searchParams.get("assignedTo")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const skip = (page - 1) * limit

    const db = await getDb()

    const filter: Record<string, unknown> = {}

    if (projectId) filter.projectId = new ObjectId(projectId)
    if (status) filter.status = status
    if (assignedTo) filter.assignedTo = new ObjectId(assignedTo)

    if (user.role === "trabajador") {
      filter.assignedTo = new ObjectId(user._id)
    }

    const [tasks, total] = await Promise.all([
      db.collection<Task>("tasks").find(filter).sort({ priority: -1, endDate: 1 }).skip(skip).limit(limit).toArray(),
      db.collection("tasks").countDocuments(filter),
    ])

    return NextResponse.json({
      tasks,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch {
    return NextResponse.json({ error: "Error al obtener tareas" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || !user._id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    if (!hasPermission(user.role, "tasks.create")) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const body = await request.json()
    const result = taskSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: "Datos inválidos", details: result.error.flatten() }, { status: 400 })
    }

    const db = await getDb()
    const code = generateCode("TSK")

    const userObjectId = new ObjectId(user._id)

    const newTask: Omit<Task, "_id"> = {
      ...result.data,
      projectId: new ObjectId(result.data.projectId),
      code,
      status: "pendiente",
      progress: 0,
      assignedTo: result.data.assignedTo?.map((id) => new ObjectId(id)) || [],
      dependencies: [],
      checklist: [],
      attachments: [],
      notes: result.data.notes || "",
      createdBy: userObjectId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const insertResult = await db.collection("tasks").insertOne(newTask)

    return NextResponse.json(
      {
        success: true,
        task: { ...newTask, _id: insertResult.insertedId },
      },
      { status: 201 },
    )
  } catch {
    return NextResponse.json({ error: "Error al crear tarea" }, { status: 500 })
  }
}
