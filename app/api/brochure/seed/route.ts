import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { revalidatePath } from "next/cache"
import { getDb } from "@/lib/db/connection"
import { verifyAuth } from "@/lib/auth/session"
import type { BrochureContentDocument, BrochureDirectoryMember } from "@/lib/db/models"
import { buildDefaultBrochureContent, DEFAULT_BROCHURE_DIRECTORY } from "@/lib/site/brochure-defaults"

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user || !["super_admin", "admin"].includes(user.role)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const db = await getDb()
    const now = new Date()
    const userId = new ObjectId(user.userId)

    const existing = await db.collection("brochure_content").findOne({ key: "main" })
    if (!existing) {
      const defaults = buildDefaultBrochureContent()
      await db.collection<BrochureContentDocument>("brochure_content").insertOne({
        ...defaults,
        key: "main",
        createdAt: now,
        updatedAt: now,
        updatedBy: userId,
      } as BrochureContentDocument)
    }

    const dirCount = await db.collection("brochure_directory").countDocuments()
    if (dirCount === 0) {
      await db.collection<BrochureDirectoryMember>("brochure_directory").insertMany(
        DEFAULT_BROCHURE_DIRECTORY.map((m) => ({
          ...m,
          createdAt: now,
          updatedAt: now,
          updatedBy: userId,
        })) as BrochureDirectoryMember[],
      )
    }

    revalidatePath("/brochure")

    return NextResponse.json({ success: true, seeded: true })
  } catch (error) {
    console.error("[brochure/seed POST]", error)
    return NextResponse.json({ error: "Error al inicializar" }, { status: 500 })
  }
}
