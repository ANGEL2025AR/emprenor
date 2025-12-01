import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { hasPermission } from "@/lib/auth/permissions"
import { ObjectId } from "mongodb"
import type { Task } from "@/lib/db/models"

// GET - Obtener tarea por ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { id } = await params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const db = await getDb()
    const task = await db.collection<Task>("tasks").findOne({
      _id: new ObjectId(id),
    })

    if (!task) {
      return NextResponse.json({ error: "Tarea no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ task })
  } catch {
    return NextResponse.json({ error: "Error al obtener tarea" }, { status: 500 })
  }
}

// PUT - Actualizar tarea
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    if (!hasPermission(user.role, "tasks.edit")) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()

    const db = await getDb()

    // Calcular progreso automático si se actualiza status
    let progress = body.progress
    if (body.status === "completada") progress = 100
    if (body.status === "pendiente") progress = 0

    const updateResult = await db.collection("tasks").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...body,
          progress,
          updatedAt: new Date(),
        },
      },
    )

    if (updateResult.matchedCount === 0) {
      return NextResponse.json({ error: "Tarea no encontrada" }, { status: 404 })
    }

    // Actualizar progreso del proyecto
    const task = await db.collection<Task>("tasks").findOne({ _id: new ObjectId(id) })
    if (task) {
      const projectTasks = await db.collection<Task>("tasks").find({ projectId: task.projectId }).toArray()

      const avgProgress = projectTasks.reduce((acc, t) => acc + (t.progress || 0), 0) / projectTasks.length

      await db
        .collection("projects")
        .updateOne({ _id: task.projectId }, { $set: { progress: Math.round(avgProgress), updatedAt: new Date() } })
    }

    const updatedTask = await db.collection("tasks").findOne({ _id: new ObjectId(id) })

    return NextResponse.json({ success: true, task: updatedTask })
  } catch {
    return NextResponse.json({ error: "Error al actualizar tarea" }, { status: 500 })
  }
}

// DELETE - Eliminar tarea
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    if (!hasPermission(user.role, "tasks.delete")) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const { id } = await params
    const db = await getDb()

    const deleteResult = await db.collection("tasks").deleteOne({
      _id: new ObjectId(id),
    })

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json({ error: "Tarea no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Error al eliminar tarea" }, { status: 500 })
  }
}
