import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { revalidatePath } from "next/cache"
import { getDb } from "@/lib/db/connection"
import { verifyAuth } from "@/lib/auth/session"
import type { SiteService, SiteServiceIconKey } from "@/lib/db/models"
import { getServiceBySlug, getServiceBySlugAdmin } from "@/lib/site/get-services"
import { SITE_SERVICE_DEFAULTS } from "@/lib/site/service-defaults"

const ICON_KEYS: SiteServiceIconKey[] = [
  "Building2",
  "Hammer",
  "Home",
  "Factory",
  "Flame",
  "Lightbulb",
  "Droplets",
  "Paintbrush",
]

function revalidateServicePaths(slug: string) {
  revalidatePath("/servicios")
  revalidatePath("/")
  revalidatePath(`/servicios/${slug}`)
}

function validateService(body: unknown): body is Omit<SiteService, "_id" | "createdAt" | "updatedAt" | "updatedBy"> {
  if (!body || typeof body !== "object") return false
  const b = body as Record<string, unknown>
  if (typeof b.slug !== "string" || !b.slug.trim()) return false
  if (typeof b.title !== "string" || !b.title.trim()) return false
  if (typeof b.shortDescription !== "string") return false
  if (typeof b.heroImage !== "string") return false
  if (typeof b.heroImageAlt !== "string") return false
  if (!Array.isArray(b.gallery)) return false
  if (!ICON_KEYS.includes(b.icon as SiteServiceIconKey)) return false
  if (typeof b.colorGradient !== "string") return false
  if (!Array.isArray(b.features)) return false
  if (typeof b.overviewTitle !== "string") return false
  if (!Array.isArray(b.overviewParagraphs)) return false
  if (!Array.isArray(b.processSteps)) return false
  if (!Array.isArray(b.workCategories)) return false
  if (!Array.isArray(b.benefits)) return false
  if (typeof b.published !== "boolean") return false
  if (typeof b.order !== "number") return false
  return true
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const user = await verifyAuth(request)
    const isAdmin = user && ["super_admin", "admin"].includes(user.role)

    const service = isAdmin ? await getServiceBySlugAdmin(slug) : await getServiceBySlug(slug)
    if (!service) {
      return NextResponse.json({ error: "Servicio no encontrado" }, { status: 404 })
    }
    return NextResponse.json({ service })
  } catch (error) {
    console.error("[site-services slug GET]", error)
    return NextResponse.json({ error: "Error al leer servicio" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const user = await verifyAuth(request)
    if (!user || !["super_admin", "admin"].includes(user.role)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { slug } = await params
    const body = await request.json()
    if (!validateService(body) || body.slug !== slug) {
      return NextResponse.json({ error: "Datos del servicio inválidos" }, { status: 400 })
    }

    const db = await getDb()
    const now = new Date()
    const existing = await getServiceBySlugAdmin(slug)

    await db.collection<SiteService>("site_services").updateOne(
      { slug },
      {
        $set: {
          ...body,
          updatedAt: now,
          updatedBy: new ObjectId(user.userId),
        },
        $setOnInsert: {
          createdAt: now,
        },
      },
      { upsert: true },
    )

    revalidateServicePaths(slug)
    return NextResponse.json({ success: true, created: !existing?._id })
  } catch (error) {
    console.error("[site-services PUT]", error)
    return NextResponse.json({ error: "Error al guardar servicio" }, { status: 500 })
  }
}

/** Restaura valores por defecto de un servicio desde el seed. */
export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const user = await verifyAuth(request)
    if (!user || !["super_admin", "admin"].includes(user.role)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { slug } = await params
    const seed = SITE_SERVICE_DEFAULTS.find((s) => s.slug === slug)
    if (!seed) {
      return NextResponse.json({ error: "Servicio no encontrado en defaults" }, { status: 404 })
    }

    const db = await getDb()
    const now = new Date()
    await db.collection<SiteService>("site_services").updateOne(
      { slug },
      {
        $set: {
          ...seed,
          updatedAt: now,
          updatedBy: new ObjectId(user.userId),
        },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true },
    )

    revalidateServicePaths(slug)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[site-services POST reset]", error)
    return NextResponse.json({ error: "Error al restaurar servicio" }, { status: 500 })
  }
}
