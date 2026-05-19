import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { withProjectScope, getClientProjectsFilter, isClientRole } from "@/lib/auth/project-access"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query || query.length < 2) {
      return NextResponse.json({ results: { projects: [], tasks: [], documents: [] } })
    }

    const db = await getDb()
    const searchRegex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")

    const projectTextFilter = {
      $or: [
        { name: searchRegex },
        { code: searchRegex },
        { description: searchRegex },
        { "client.name": searchRegex },
      ],
    }

    let projectQuery: Record<string, unknown> = projectTextFilter
    if (isClientRole(user.role)) {
      const clientFilter = await getClientProjectsFilter(user)
      projectQuery = { $and: [projectTextFilter, clientFilter] }
    }

    const projects = await db.collection("projects").find(projectQuery).limit(5).toArray()

    const taskBase = {
      $or: [{ title: searchRegex }, { code: searchRegex }, { description: searchRegex }],
    }
    const taskQuery = await withProjectScope(user, taskBase)
    const tasks = await db.collection("tasks").find(taskQuery).limit(5).toArray()

    const docBase = {
      $or: [{ name: searchRegex }, { description: searchRegex }],
    }
    const docQuery = await withProjectScope(user, docBase)
    const documents = await db.collection("documents").find(docQuery).limit(5).toArray()

    return NextResponse.json({
      results: {
        projects: projects.map((p) => ({
          id: p._id.toString(),
          type: "project",
          title: p.name,
          subtitle: p.code,
          href: `/dashboard/proyectos/${p._id}`,
        })),
        tasks: tasks.map((t) => ({
          id: t._id.toString(),
          type: "task",
          title: t.title,
          subtitle: t.code,
          href: `/dashboard/tareas/${t._id}`,
        })),
        documents: documents.map((d) => ({
          id: d._id.toString(),
          type: "document",
          title: d.name,
          subtitle: d.type,
          href: `/dashboard/documentos`,
        })),
      },
    })
  } catch {
    return NextResponse.json({ error: "Error en la búsqueda" }, { status: 500 })
  }
}
