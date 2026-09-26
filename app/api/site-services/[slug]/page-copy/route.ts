import { NextResponse, type NextRequest } from "next/server"
import { getDb } from "@/lib/db/connection"
import { verifyAuth } from "@/lib/auth/session"
import { hasPermission } from "@/lib/auth/permissions"
import type { UserRole } from "@/lib/db/models"
import { collectEditableTexts, getServicePageConfigResolved } from "@/lib/site/service-page-copy"
import { resolveServiceSlug } from "@/lib/site/services-catalog"

async function assertEditor(request: NextRequest) {
  const user = await verifyAuth(request)
  if (!user || !hasPermission(user.role as UserRole, "website.edit")) return null
  return user
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const user = await assertEditor(request)
  if (!user) return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
  const { slug } = await params
  const config = await getServicePageConfigResolved(slug)
  if (!config) return NextResponse.json({ error: "Servicio no encontrado" }, { status: 404 })
  return NextResponse.json({ fields: collectEditableTexts(config).slice(0, 40) })
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const user = await assertEditor(request)
  if (!user) return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
  const { slug } = await params
  const resolved = resolveServiceSlug(slug)
  const body = await request.json().catch(() => null)
  const fields = Array.isArray(body?.fields) ? body.fields : null
  if (!fields) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })

  const overrides: Record<string, string> = {}
  for (const field of fields) {
    if (!field || typeof field.path !== "string" || typeof field.value !== "string") continue
    if (!/^[\w.]+$/.test(field.path)) continue
    overrides[field.path] = field.value.slice(0, 2000)
  }

  const db = await getDb()
  await db.collection("site_service_pages").updateOne(
    { slug: resolved },
    { $set: { slug: resolved, overrides, updatedAt: new Date() } },
    { upsert: true },
  )
  return NextResponse.json({ success: true })
}
