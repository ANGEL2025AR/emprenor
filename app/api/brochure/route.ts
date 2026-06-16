import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { revalidatePath } from "next/cache"
import { getDb } from "@/lib/db/connection"
import { verifyAuth } from "@/lib/auth/session"
import type { BrochureContentDocument } from "@/lib/db/models"
import { getBrochureContent } from "@/lib/site/get-brochure"

export async function GET() {
  try {
    const { content, fromDatabase } = await getBrochureContent()
    return NextResponse.json({ content, fromDatabase })
  } catch (error) {
    console.error("[brochure GET]", error)
    return NextResponse.json({ error: "Error al leer el brochure" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user || !["super_admin", "admin"].includes(user.role)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    if (!body?.content || typeof body.content !== "object") {
      return NextResponse.json({ error: "Contenido inválido" }, { status: 400 })
    }

    const db = await getDb()
    const now = new Date()
    const content = body.content as BrochureContentDocument

    await db.collection<BrochureContentDocument>("brochure_content").updateOne(
      { key: "main" },
      {
        $set: {
          ...content,
          key: "main",
          updatedAt: now,
          updatedBy: new ObjectId(user.userId),
        },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true },
    )

    revalidatePath("/brochure")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[brochure PUT]", error)
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 })
  }
}
