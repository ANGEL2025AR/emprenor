import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { revalidatePath } from "next/cache"
import { getDb } from "@/lib/db/connection"
import { verifyAuth } from "@/lib/auth/session"
import type { SiteService } from "@/lib/db/models"
import { SITE_SERVICE_DEFAULTS } from "@/lib/site/service-defaults"

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user || !["super_admin", "admin"].includes(user.role)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const db = await getDb()
    const now = new Date()
    let inserted = 0

    const force =
      request.nextUrl.searchParams.get("force") === "true" ||
      request.nextUrl.searchParams.get("mode") === "force"

    for (const seed of SITE_SERVICE_DEFAULTS) {
      const { slug, ...fields } = seed
      const result = await db.collection<SiteService>("site_services").updateOne(
        { slug },
        force
          ? {
              $set: {
                ...fields,
                updatedAt: now,
                updatedBy: new ObjectId(user.userId),
              },
              $setOnInsert: { slug, createdAt: now },
            }
          : {
              $setOnInsert: {
                ...seed,
                createdAt: now,
                updatedAt: now,
                updatedBy: new ObjectId(user.userId),
              },
            },
        { upsert: true },
      )
      if (result.upsertedCount || (force && result.modifiedCount)) inserted++
    }

    revalidatePath("/servicios")
    revalidatePath("/")
    for (const s of SITE_SERVICE_DEFAULTS) {
      revalidatePath(`/servicios/${s.slug}`)
    }

    return NextResponse.json({ success: true, inserted, total: SITE_SERVICE_DEFAULTS.length })
  } catch (error) {
    console.error("[site-services seed]", error)
    return NextResponse.json({ error: "Error al inicializar servicios" }, { status: 500 })
  }
}
