import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import type { PublicProject } from "@/lib/db/models"
import { toMapProject } from "@/lib/site/project-geo"

export async function GET(_request: NextRequest) {
  try {
    const db = await getDb()
    const docs = await db
      .collection<PublicProject>("public_projects")
      .find({ published: true, showOnMap: { $ne: false } })
      .sort({ order: 1, createdAt: -1 })
      .toArray()

    const projects = docs.map((doc) => toMapProject(doc)).filter(Boolean)
    return NextResponse.json({ projects })
  } catch (error) {
    console.error("Error al obtener proyectos del mapa:", error)
    return NextResponse.json({ error: "Error al obtener proyectos del mapa" }, { status: 500 })
  }
}
