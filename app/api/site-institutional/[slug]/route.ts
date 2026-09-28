import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { revalidatePath } from "next/cache"
import { getDb } from "@/lib/db/connection"
import { verifyAuth } from "@/lib/auth/session"
import {
  getInstitutionalDefaults,
  isInstitutionalSlug,
  parseInstitutionalPage,
} from "@/lib/site/institutional-pages"

export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!isInstitutionalSlug(slug)) {
    return NextResponse.json({ error: "Página no válida" }, { status: 400 })
  }
  const user = await verifyAuth(_request)
  if (!user || !["super_admin", "admin"].includes(user.role)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  if (!process.env.MONGODB_URI?.trim()) {
    return NextResponse.json({ page: getInstitutionalDefaults(slug), fromDatabase: false })
  }

  const db = await getDb()
  const doc = await db.collection("site_institutional_pages").findOne({ slug })
  const page = doc ? parseInstitutionalPage(slug, doc) : null
  return NextResponse.json({ page: page ?? getInstitutionalDefaults(slug), fromDatabase: Boolean(page) })
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const user = await verifyAuth(request)
  if (!user || !["super_admin", "admin"].includes(user.role)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { slug } = await params
  if (!isInstitutionalSlug(slug)) {
    return NextResponse.json({ error: "Página no válida" }, { status: 400 })
  }

  const body = await request.json().catch(() => null)
  const page = parseInstitutionalPage(slug, body)
  if (!page) {
    return NextResponse.json({ error: "Completá el título y el subtítulo" }, { status: 400 })
  }

  const db = await getDb()
  const now = new Date()
  await db.collection("site_institutional_pages").updateOne(
    { slug },
    {
      $set: { ...page, updatedAt: now, updatedBy: new ObjectId(user.userId) },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true },
  )

  revalidatePath(`/${slug}`)
  return NextResponse.json({ success: true })
}
