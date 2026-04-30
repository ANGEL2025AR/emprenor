import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { revalidatePath } from "next/cache"
import { getDb } from "@/lib/db/connection"
import { verifyAuth } from "@/lib/auth/session"
import type { SitePageDocument, SitePageHeroSlide } from "@/lib/db/models"
import { SITE_DEFAULT_HERO } from "@/lib/site/defaults"
import { isSitePageSlug, type SitePageSlug } from "@/lib/site/constants"

function revalidateSitePaths(slug: SitePageSlug) {
  if (slug === "home") {
    revalidatePath("/")
    return
  }
  revalidatePath(`/${slug}`)
}

function validateSlides(slides: unknown): slides is SitePageHeroSlide[] {
  if (!Array.isArray(slides) || slides.length === 0 || slides.length > 12) return false
  for (const s of slides) {
    if (!s || typeof s !== "object") return false
    const slide = s as Record<string, unknown>
    if (typeof slide.id !== "string" || !slide.id.trim()) return false
    if (typeof slide.title !== "string" || !slide.title.trim()) return false
    if (typeof slide.image !== "string") return false
    if (typeof slide.alt !== "string") return false
  }
  return true
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    if (!isSitePageSlug(slug)) {
      return NextResponse.json({ error: "Slug no válido" }, { status: 400 })
    }

    if (!process.env.MONGODB_URI?.trim()) {
      return NextResponse.json({ heroSlides: SITE_DEFAULT_HERO[slug], fromDatabase: false })
    }

    const db = await getDb()
    const doc = await db.collection<SitePageDocument>("site_pages").findOne({ slug })
    const defaults = SITE_DEFAULT_HERO[slug]
    if (!doc?.heroSlides?.length) {
      return NextResponse.json({ heroSlides: defaults, fromDatabase: false })
    }
    return NextResponse.json({ heroSlides: doc.heroSlides, fromDatabase: true })
  } catch (error) {
    console.error("[site-pages GET]", error)
    return NextResponse.json({ error: "Error al leer la página" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const user = await verifyAuth(request)
    if (!user || !["super_admin", "admin"].includes(user.role)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { slug } = await params
    if (!isSitePageSlug(slug)) {
      return NextResponse.json({ error: "Slug no válido" }, { status: 400 })
    }

    const body = await request.json()
    if (!validateSlides(body.heroSlides)) {
      return NextResponse.json(
        { error: "heroSlides inválido: entre 1 y 12 diapositivas, con id, title, image y alt válidos" },
        { status: 400 },
      )
    }

    const db = await getDb()
    const now = new Date()
    await db.collection<SitePageDocument>("site_pages").updateOne(
      { slug },
      {
        $set: {
          heroSlides: body.heroSlides as SitePageHeroSlide[],
          updatedAt: now,
          updatedBy: new ObjectId(user.userId),
        },
        $setOnInsert: {
          slug,
          createdAt: now,
        },
      },
      { upsert: true },
    )

    revalidateSitePaths(slug)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[site-pages PUT]", error)
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 })
  }
}
