import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getDb } from "@/lib/db/connection"
import { verifyAuth } from "@/lib/auth/session"
import type { PublicProject } from "@/lib/db/models"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const db = await getDb()

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const project = await db.collection<PublicProject>("public_projects").findOne({ _id: new ObjectId(id) })

    if (!project) {
      return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ project })
  } catch (error) {
    console.error("Error al obtener proyecto:", error)
    return NextResponse.json({ error: "Error al obtener proyecto" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await verifyAuth(request)
    if (!user || !["super_admin", "admin"].includes(user.role)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const db = await getDb()

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const updateData = {
      ...body,
      updatedAt: new Date(),
    }

    delete updateData._id

    const result = await db
      .collection<PublicProject>("public_projects")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al actualizar proyecto:", error)
    return NextResponse.json({ error: "Error al actualizar proyecto" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await verifyAuth(request)
    if (!user || !["super_admin", "admin"].includes(user.role)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { id } = await params
    const db = await getDb()

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const result = await db.collection<PublicProject>("public_projects").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al eliminar proyecto:", error)
    return NextResponse.json({ error: "Error al eliminar proyecto" }, { status: 500 })
  }
}
