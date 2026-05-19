import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { hasPermission } from "@/lib/auth/permissions"
import { canAccessProjectId } from "@/lib/auth/project-access"
import { safeDate } from "@/lib/utils"
import type { UserRole } from "@/lib/db/models"

type RouteParams = { params: Promise<{ id: string }> }

function serializeDailyLog(doc: Record<string, unknown>) {
  return {
    _id: String(doc._id),
    projectId: doc.projectId ? String(doc.projectId) : "",
    logNumber: String(doc.logNumber || ""),
    date: safeDate(doc.date as Date) || "",
    shift: String(doc.shift || ""),
    weather: doc.weather || { condition: "", temperature: 0 },
    workforce: doc.workforce || { total: 0 },
    activities: Array.isArray(doc.activities) ? doc.activities : [],
    safetyObservations: Array.isArray(doc.safetyObservations) ? doc.safetyObservations : [],
    notes: String(doc.notes || ""),
    createdAt: safeDate(doc.createdAt as Date) || "",
  }
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    if (!hasPermission(user.role as UserRole, "daily_logs.view")) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const { id } = await params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const db = await getDb()
    const doc = await db.collection("daily_logs").findOne({ _id: new ObjectId(id) })
    if (!doc) return NextResponse.json({ error: "Bitácora no encontrada" }, { status: 404 })

    const projectId = String(doc.projectId || "")
    if (projectId && !(await canAccessProjectId(user, projectId))) {
      return NextResponse.json({ error: "Sin acceso al proyecto" }, { status: 403 })
    }

    return NextResponse.json(serializeDailyLog(doc as Record<string, unknown>))
  } catch {
    return NextResponse.json({ error: "Error al obtener bitácora" }, { status: 500 })
  }
}
