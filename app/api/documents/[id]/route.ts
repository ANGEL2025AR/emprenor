import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { hasPermission } from "@/lib/auth/permissions"
import { ObjectId } from "mongodb"
import { del } from "@vercel/blob"
import { canAccessDocumentId, isClientRole } from "@/lib/auth/project-access"

type RouteParams = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    if (!hasPermission(user.role, "documents.view")) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const { id } = await params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    if (!(await canAccessDocumentId(user, id))) {
      return NextResponse.json({ error: "Sin acceso a este documento" }, { status: 403 })
    }

    const db = await getDb()
    const document = await db.collection("documents").findOne({ _id: new ObjectId(id) })
    if (!document) {
      return NextResponse.json({ error: "Documento no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ document })
  } catch {
    return NextResponse.json({ error: "Error al obtener documento" }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    if (isClientRole(user.role)) {
      return NextResponse.json({ error: "Los clientes no pueden eliminar documentos" }, { status: 403 })
    }

    if (!hasPermission(user.role, "documents.delete")) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const { id } = await params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    if (!(await canAccessDocumentId(user, id))) {
      return NextResponse.json({ error: "Sin acceso a este documento" }, { status: 403 })
    }

    const db = await getDb()
    const document = await db.collection("documents").findOne({ _id: new ObjectId(id) })

    if (!document) {
      return NextResponse.json({ error: "Documento no encontrado" }, { status: 404 })
    }

    const fileUrl = document.file?.url
    if (fileUrl && typeof fileUrl === "string") {
      try {
        await del(fileUrl)
      } catch (error) {
        console.error("Error deleting from blob:", error)
      }
    }

    await db.collection("documents").deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting document:", error)
    return NextResponse.json({ error: "Error al eliminar documento" }, { status: 500 })
  }
}
