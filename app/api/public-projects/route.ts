import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { verifyAuth } from "@/lib/auth/session"
import type { PublicProject } from "@/lib/db/models"

export async function GET(request: NextRequest) {
  try {
    const db = await getDb()
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")
    const published = searchParams.get("published")

    const filter: Record<string, unknown> = {}

    if (category && category !== "Todos") {
      filter.category = category
    }

    if (published === "true") {
      filter.published = true
    }

    const projects = await db
      .collection<PublicProject>("public_projects")
      .find(filter)
      .sort({ order: 1, createdAt: -1 })
      .toArray()

    return NextResponse.json({ projects })
  } catch (error) {
    console.error("Error al obtener proyectos públicos:", error)
    return NextResponse.json({ error: "Error al obtener proyectos" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user || !["super_admin", "admin"].includes(user.role)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const db = await getDb()

    const newProject: Partial<PublicProject> = {
      ...body,
      published: body.published ?? false,
      featured: body.featured ?? false,
      order: body.order ?? 999,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: user.userId,
    }

    const result = await db.collection<PublicProject>("public_projects").insertOne(newProject as PublicProject)

    return NextResponse.json({
      success: true,
      projectId: result.insertedId,
    })
  } catch (error) {
    console.error("Error al crear proyecto público:", error)
    return NextResponse.json({ error: "Error al crear proyecto" }, { status: 500 })
  }
}
