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

    for (const seed of SITE_SERVICE_DEFAULTS) {
      const result = await db.collection<SiteService>("site_services").updateOne(
        { slug: seed.slug },
        {
          $setOnInsert: {
            ...seed,
            createdAt: now,
            updatedAt: now,
            updatedBy: new ObjectId(user.userId),
          },
        },
        { upsert: true },
      )
      if (result.upsertedCount) inserted++
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
