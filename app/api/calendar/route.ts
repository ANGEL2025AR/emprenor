import { NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { hasPermission } from "@/lib/auth/permissions"
import { withProjectScope, getClientProjectsFilter, isClientRole } from "@/lib/auth/project-access"
import type { UserRole } from "@/lib/db/models"

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || !user._id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    if (!hasPermission(user.role as UserRole, "calendar.view")) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const year = Number.parseInt(searchParams.get("year") || String(new Date().getFullYear()))
    const month = Number.parseInt(searchParams.get("month") || String(new Date().getMonth() + 1))

    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0, 23, 59, 59)

    const db = await getDb()

    const dateRange = {
      $or: [
        { "dates.start": { $gte: startDate, $lte: endDate } },
        { "dates.estimatedEnd": { $gte: startDate, $lte: endDate } },
      ],
    }

    let projectQuery: Record<string, unknown> = dateRange
    if (isClientRole(user.role)) {
      const clientFilter = await getClientProjectsFilter(user)
      projectQuery = { $and: [dateRange, clientFilter] }
    }

    const projects = await db.collection("projects").find(projectQuery).toArray()

    const taskQuery = await withProjectScope(user, {
      endDate: { $gte: startDate, $lte: endDate },
    })
    const tasks = await db.collection("tasks").find(taskQuery).toArray()

    const inspectionQuery = await withProjectScope(user, {
      date: { $gte: startDate, $lte: endDate },
    })
    const inspections = await db.collection("inspections").find(inspectionQuery).toArray()

    const events = [
      ...projects.flatMap((p) => {
        const evts = []
        if (p.dates?.start) {
          evts.push({
            _id: `${p._id}-start`,
            title: `Inicio: ${p.name}`,
            date: new Date(p.dates.start).toISOString(),
            type: "proyecto",
            projectName: p.name,
          })
        }
        if (p.dates?.estimatedEnd) {
          evts.push({
            _id: `${p._id}-end`,
            title: `Fin: ${p.name}`,
            date: new Date(p.dates.estimatedEnd).toISOString(),
            type: "proyecto",
            projectName: p.name,
          })
        }
        return evts
      }),
      ...tasks.map((t) => ({
        _id: String(t._id),
        title: t.title,
        date: t.endDate ? new Date(t.endDate).toISOString() : new Date().toISOString(),
        type: "tarea",
        status: t.status,
      })),
      ...inspections.map((i) => ({
        _id: String(i._id),
        title: `Inspeccion: ${i.title}`,
        date: i.date ? new Date(i.date).toISOString() : new Date().toISOString(),
        type: "inspeccion",
        status: i.result,
      })),
    ]

    return NextResponse.json({ events })
  } catch (error) {
    console.error("[API] Calendar error:", error)
    return NextResponse.json({ error: "Error al cargar calendario", events: [] }, { status: 500 })
  }
}
