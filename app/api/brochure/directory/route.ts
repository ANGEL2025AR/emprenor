import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { revalidatePath } from "next/cache"
import { getDb } from "@/lib/db/connection"
import { verifyAuth } from "@/lib/auth/session"
import type { BrochureDirectoryMember } from "@/lib/db/models"
import { getBrochureDirectory } from "@/lib/site/get-brochure"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const publishedOnly = searchParams.get("all") !== "true"
    const { members, fromDatabase } = await getBrochureDirectory({ publishedOnly })
    return NextResponse.json({ members, fromDatabase })
  } catch (error) {
    console.error("[brochure/directory GET]", error)
    return NextResponse.json({ error: "Error al leer directorio" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user || !["super_admin", "admin"].includes(user.role)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    if (!body?.name?.trim() || !body?.role?.trim() || !body?.department?.trim()) {
      return NextResponse.json({ error: "Nombre, cargo y área son obligatorios" }, { status: 400 })
    }

    const db = await getDb()
    const now = new Date()
    const member: BrochureDirectoryMember = {
      name: String(body.name).trim(),
      role: String(body.role).trim(),
      department: String(body.department).trim().toUpperCase(),
      bio: body.bio ? String(body.bio).trim() : "",
      photo: body.photo ? String(body.photo).trim() : "",
      email: body.email ? String(body.email).trim() : "",
      phone: body.phone ? String(body.phone).trim() : "",
      order: Number(body.order) || 0,
      published: body.published !== false,
      featured: Boolean(body.featured),
      createdAt: now,
      updatedAt: now,
      updatedBy: new ObjectId(user.userId),
    }

    const result = await db.collection<BrochureDirectoryMember>("brochure_directory").insertOne(member)
    revalidatePath("/brochure")

    return NextResponse.json({ success: true, id: result.insertedId.toString() })
  } catch (error) {
    console.error("[brochure/directory POST]", error)
    return NextResponse.json({ error: "Error al crear miembro" }, { status: 500 })
  }
}
