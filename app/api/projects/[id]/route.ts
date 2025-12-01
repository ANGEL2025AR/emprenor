import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { hasPermission } from "@/lib/auth/permissions"
import { ObjectId } from "mongodb"
import type { Project } from "@/lib/db/models"

// GET - Obtener proyecto por ID
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
    const project = await db.collection<Project>("projects").findOne({
      _id: new ObjectId(id),
    })

    if (!project) {
      return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ project })
  } catch {
    return NextResponse.json({ error: "Error al obtener proyecto" }, { status: 500 })
  }
}

// PUT - Actualizar proyecto
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    if (!hasPermission(user.role, "projects.edit")) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const db = await getDb()

    const updateResult = await db.collection("projects").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...body,
          updatedAt: new Date(),
        },
      },
    )

    if (updateResult.matchedCount === 0) {
      return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 })
    }

    const updatedProject = await db.collection("projects").findOne({
      _id: new ObjectId(id),
    })

    return NextResponse.json({
      success: true,
      project: updatedProject,
    })
  } catch {
    return NextResponse.json({ error: "Error al actualizar proyecto" }, { status: 500 })
  }
}

// DELETE - Eliminar proyecto
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    if (!hasPermission(user.role, "projects.delete")) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const { id } = await params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const db = await getDb()
    const deleteResult = await db.collection("projects").deleteOne({
      _id: new ObjectId(id),
    })

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Error al eliminar proyecto" }, { status: 500 })
  }
}
