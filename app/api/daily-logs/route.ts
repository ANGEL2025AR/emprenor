import { NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { ObjectId } from "mongodb"
import { logActivity } from "@/lib/audit/audit-log"
import { hasPermission } from "@/lib/auth/permissions"
import { canAccessProjectId, withProjectScope } from "@/lib/auth/project-access"
import { isClientRole } from "@/lib/auth/project-access"

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const canView = isClientRole(user.role)
      ? hasPermission(user.role, "client.project_progress.view")
      : hasPermission(user.role, "daily_logs.view")
    if (!canView) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    const db = await getDb()
    const query: {
      projectId?: ObjectId
      date?: { $gte?: Date; $lte?: Date }
    } = {}

    if (projectId) {
      if (!(await canAccessProjectId(user, projectId))) {
        return NextResponse.json({ error: "Sin acceso a este proyecto" }, { status: 403 })
      }
      query.projectId = new ObjectId(projectId)
    }

    if (startDate || endDate) {
      query.date = {}
      if (startDate) query.date.$gte = new Date(startDate)
      if (endDate) query.date.$lte = new Date(endDate)
    }

    const scopedQuery = await withProjectScope(user, query as Record<string, unknown>)

    const dailyLogs = await db
      .collection("daily_logs")
      .find(scopedQuery)
      .sort({ date: -1, createdAt: -1 })
      .limit(100)
      .toArray()

    return NextResponse.json(dailyLogs)
  } catch (error) {
    console.error("Error fetching daily logs:", error)
    return NextResponse.json({ error: "Error al obtener bitácoras" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const db = await getDb()

    // Generar número de bitácora
    const count = await db.collection("daily_logs").countDocuments()
    const logNumber = `DL-${new Date().getFullYear()}-${String(count + 1).padStart(4, "0")}`

    const dailyLog = {
      ...body,
      logNumber,
      projectId: new ObjectId(body.projectId),
      preparedBy: new ObjectId(user._id),
      preparedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("daily_logs").insertOne(dailyLog)

    await logActivity(
      user._id,
      "create",
      "daily_log",
      result.insertedId,
      null,
      dailyLog,
      request.headers.get("x-forwarded-for") || "unknown",
      request.headers.get("user-agent") || "unknown",
    )

    return NextResponse.json({ _id: result.insertedId, ...dailyLog })
  } catch (error) {
    console.error("Error creating daily log:", error)
    return NextResponse.json({ error: "Error al crear bitácora" }, { status: 500 })
  }
}
