import { NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || !user._id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const year = Number.parseInt(searchParams.get("year") || String(new Date().getFullYear()))
    const month = Number.parseInt(searchParams.get("month") || String(new Date().getMonth() + 1))

    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0, 23, 59, 59)

    const db = await getDb()

    // Obtener eventos de proyectos (fechas de inicio y fin)
    const projects = await db
      .collection("projects")
      .find({
        $or: [
          { "dates.start": { $gte: startDate, $lte: endDate } },
          { "dates.estimatedEnd": { $gte: startDate, $lte: endDate } },
        ],
      })
      .toArray()

    // Obtener tareas con fecha límite
    const tasks = await db
      .collection("tasks")
      .find({
        endDate: { $gte: startDate, $lte: endDate },
      })
      .toArray()

    // Obtener inspecciones programadas
    const inspections = await db
      .collection("inspections")
      .find({
        date: { $gte: startDate, $lte: endDate },
      })
      .toArray()

    // Combinar todos los eventos
    const events = [
      ...projects.flatMap((p) => {
        const evts = []
        if (p.dates?.start) {
          evts.push({
            _id: `${p._id}-start`,
            title: `Inicio: ${p.name}`,
            date: p.dates.start.toISOString(),
            type: "proyecto",
            projectName: p.name,
          })
        }
        if (p.dates?.estimatedEnd) {
          evts.push({
            _id: `${p._id}-end`,
            title: `Fin: ${p.name}`,
            date: p.dates.estimatedEnd.toISOString(),
            type: "proyecto",
            projectName: p.name,
          })
        }
        return evts
      }),
      ...tasks.map((t) => ({
        _id: String(t._id),
        title: t.title,
        date: t.endDate?.toISOString() || new Date().toISOString(),
        type: "tarea",
        status: t.status,
      })),
      ...inspections.map((i) => ({
        _id: String(i._id),
        title: `Inspección: ${i.title}`,
        date: i.date?.toISOString() || new Date().toISOString(),
        type: "inspeccion",
        status: i.result,
      })),
    ]

    return NextResponse.json({ events })
  } catch (error) {
    console.error("[v0] Calendar error:", error)
    return NextResponse.json({ error: "Error al cargar calendario", events: [] }, { status: 500 })
  }
}
