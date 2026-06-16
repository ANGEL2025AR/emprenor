import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { ObjectId } from "mongodb"
import type { Document } from "@/lib/db/models"
import { hasPermission } from "@/lib/auth/permissions"
import { canAccessProjectId, withProjectScope, isClientRole, getClientVisibleDocumentFilter } from "@/lib/auth/project-access"

// GET - Listar documentos
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    if (!hasPermission(user.role, "documents.view")) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")
    const type = searchParams.get("type")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const skip = (page - 1) * limit

    const db = await getDb()

    let filter: Record<string, unknown> = {}
    if (projectId) {
      if (!(await canAccessProjectId(user, projectId))) {
        return NextResponse.json({ error: "Sin acceso a este proyecto" }, { status: 403 })
      }
      filter.projectId = new ObjectId(projectId)
    }
    if (type) filter.type = type
    if (isClientRole(user.role)) {
      filter = { ...filter, ...getClientVisibleDocumentFilter() }
    }
    filter = await withProjectScope(user, filter)

    const [documents, total] = await Promise.all([
      db.collection<Document>("documents").find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
      db.collection("documents").countDocuments(filter),
    ])

    return NextResponse.json({
      documents,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch {
    return NextResponse.json({ error: "Error al obtener documentos" }, { status: 500 })
  }
}
