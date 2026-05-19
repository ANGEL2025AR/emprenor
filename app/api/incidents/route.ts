import { NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { ObjectId } from "mongodb"
import { hasPermission } from "@/lib/auth/permissions"
import { canAccessProjectId, withProjectScope } from "@/lib/auth/project-access"
import type { UserRole } from "@/lib/db/models"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || !user._id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    if (!hasPermission(user.role as UserRole, "incidents.view")) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const db = await getDb()
    const scopedQuery = await withProjectScope(user, {})
    const incidents = await db.collection("incidents").find(scopedQuery).sort({ createdAt: -1 }).limit(100).toArray()

    return NextResponse.json({ incidents })
  } catch (error) {
    console.error("[API] Incidents error:", error)
    return NextResponse.json({ error: "Error al cargar incidencias", incidents: [] }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || !user._id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    if (!hasPermission(user.role as UserRole, "incidents.create")) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const body = await request.json()
    const projectId = String(body.projectId || "")
    const title = String(body.title || "").trim()

    if (!ObjectId.isValid(projectId) || !title) {
      return NextResponse.json({ error: "Proyecto y título son obligatorios" }, { status: 400 })
    }

    if (!(await canAccessProjectId(user, projectId))) {
      return NextResponse.json({ error: "Sin acceso al proyecto" }, { status: 403 })
    }

    const db = await getDb()
    const project = await db.collection("projects").findOne({ _id: new ObjectId(projectId) })
    const projectName = project?.name ? String(project.name) : String(body.projectName || "")

    const result = await db.collection("incidents").insertOne({
      projectId: new ObjectId(projectId),
      projectName,
      title,
      description: String(body.description || ""),
      severity: body.severity || "media",
      status: body.status || "reportada",
      location: String(body.location || ""),
      reportedBy: String(body.reportedBy || ""),
      date: new Date(),
      createdAt: new Date(),
      createdBy: new ObjectId(user._id),
    })

    return NextResponse.json({
      success: true,
      incidentId: result.insertedId.toString(),
    })
  } catch {
    return NextResponse.json({ error: "Error al crear incidencia" }, { status: 500 })
  }
}
