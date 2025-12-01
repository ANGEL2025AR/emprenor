import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"

// GET - Búsqueda global
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] })
    }

    const db = await getDb()
    const searchRegex = new RegExp(query, "i")

    // Buscar en proyectos
    const projects = await db
      .collection("projects")
      .find({
        $or: [
          { name: searchRegex },
          { code: searchRegex },
          { description: searchRegex },
          { "client.name": searchRegex },
        ],
      })
      .limit(5)
      .toArray()

    // Buscar en tareas
    const tasks = await db
      .collection("tasks")
      .find({
        $or: [{ title: searchRegex }, { code: searchRegex }, { description: searchRegex }],
      })
      .limit(5)
      .toArray()

    // Buscar en documentos
    const documents = await db
      .collection("documents")
      .find({
        $or: [{ name: searchRegex }, { description: searchRegex }],
      })
      .limit(5)
      .toArray()

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
          href: `/dashboard/tareas`,
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
