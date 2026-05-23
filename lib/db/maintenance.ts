import type { Db, Document } from "mongodb"
import {
  EMPRENOR_BRAND,
  EMPRENOR_LEGAL,
  EMPRENOR_OFICINAS,
  RM_LEGAL,
} from "@/lib/company/constants"
import type { SiteService } from "@/lib/db/models"
import { DEFAULT_PORTAL_SETTINGS, mergePortalSettings } from "@/lib/portal/portal-settings-shared"
import { SITE_DEFAULT_HERO } from "@/lib/site/defaults"
import { SITE_PAGE_SLUGS } from "@/lib/site/constants"
import { SITE_SERVICE_DEFAULTS } from "@/lib/site/service-defaults"

export type DbHealthResult = {
  ok: boolean
  database: string
  pingMs: number
  collections: { name: string; count: number }[]
  error?: string
}

export type DbSyncResult = {
  connection: DbHealthResult
  indexes: string[]
  companySettings: boolean
  portalSettings: boolean
  siteServices: { updated: number; total: number }
  sitePages: { updated: number; slugs: string[] }
  brandCleanup: { siteServices: number; sitePages: number }
}

const LEGACY_BRAND_PATTERNS = [
  /EMPRENOR Construcciones(?! y Servicios)/gi,
  /empresa líder/gi,
  /15 años de experiencia/gi,
  /aggregateRating/gi,
  /construction-site-workers/gi,
] as const

/** Prueba conexión y devuelve conteos por colección relevante. */
export async function testDatabaseConnection(db: Db): Promise<DbHealthResult> {
  const database = db.databaseName
  const started = Date.now()
  try {
    await db.command({ ping: 1 })
    const pingMs = Date.now() - started
    const names = [
      "users",
      "settings",
      "site_services",
      "site_pages",
      "contactos",
      "projects",
      "clients",
    ]
    const collections = await Promise.all(
      names.map(async (name) => ({
        name,
        count: await db.collection(name).countDocuments(),
      })),
    )
    return { ok: true, database, pingMs, collections }
  } catch (error) {
    return {
      ok: false,
      database,
      pingMs: Date.now() - started,
      collections: [],
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

/** Índices de todas las áreas (dashboard, CMS, contacto, cumplimiento). */
export async function ensureAllIndexes(db: Db): Promise<string[]> {
  const created: string[] = []

  const index = async (
    collection: string,
    keys: Document,
    options?: { unique?: boolean; sparse?: boolean },
  ) => {
    try {
      const name = await db.collection(collection).createIndex(keys, options)
      created.push(`${collection}.${name}`)
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error)
      if (msg.includes("same name") || msg.includes("already exists")) {
        created.push(`${collection} (índice existente)`)
        return
      }
      throw error
    }
  }

  await index("users", { email: 1 }, { unique: true })
  await index("users", { role: 1 })
  await index("users", { isActive: 1 })

  await index("projects", { code: 1 }, { unique: true })
  await index("projects", { status: 1 })
  await index("projects", { "team.managerId": 1 })
  await index("projects", { createdAt: -1 })

  await index("tasks", { projectId: 1 })
  await index("tasks", { code: 1 }, { unique: true })
  await index("tasks", { status: 1 })
  await index("tasks", { assignedTo: 1 })

  await index("inspections", { projectId: 1 })
  await index("inspections", { code: 1 }, { unique: true })
  await index("inspections", { result: 1 })

  await index("transactions", { projectId: 1 })
  await index("transactions", { type: 1 })
  await index("transactions", { status: 1 })
  await index("transactions", { date: -1 })

  await index("documents", { projectId: 1 })
  await index("documents", { type: 1 })
  await index("documents", { createdAt: -1 })

  await index("notifications", { userId: 1 })
  await index("notifications", { read: 1 })
  await index("notifications", { createdAt: -1 })

  await index("messages", { conversationId: 1 })
  await index("messages", { createdAt: -1 })
  await index("conversations", { participants: 1 })

  await index("contactos", { createdAt: -1 })
  await index("contactos", { status: 1 })
  await index("contactos", { email: 1 })

  await index("site_services", { slug: 1 }, { unique: true })
  await index("site_services", { published: 1, order: 1 })
  await index("site_pages", { slug: 1 }, { unique: true })

  await index("workforce_rosters", { projectId: 1, period: 1 }, { unique: true })
  await index("compliance_documents", { projectId: 1, category: 1 })
  await index("work_incidents", { projectId: 1, occurredAt: -1 })
  await index("local_purchases", { projectId: 1, date: -1 })
  await index("site_complaints", { projectId: 1, date: -1 })
  await index("ethics_reports", { status: 1, createdAt: -1 })
  await index("ethics_reports", { ticket: 1 }, { unique: true })

  await index("audit_logs", { createdAt: -1 })
  await index("audit_logs", { userId: 1 })

  return created
}

/** Configuración de empresa / marca en panel admin. */
export async function syncCompanySettings(db: Db): Promise<boolean> {
  const now = new Date()
  await db.collection("settings").updateOne(
    { type: "company" },
    {
      $set: {
        type: "company",
        companyName: EMPRENOR_BRAND.siglas,
        companyLegalName: EMPRENOR_BRAND.nombreExtendido,
        brandSiglas: EMPRENOR_BRAND.siglas,
        titularLegal: RM_LEGAL.razonSocial,
        fiscalId: RM_LEGAL.cuit,
        cuit: RM_LEGAL.cuit,
        domicilioFiscal: RM_LEGAL.domicilioFiscal,
        ivaCondicion: RM_LEGAL.ivaCondicion,
        iibbRegimen: RM_LEGAL.iibb.regimen,
        iibbNumero: RM_LEGAL.iibb.numeroInscripcion,
        companyEmail: EMPRENOR_LEGAL.emailGeneral,
        email: EMPRENOR_LEGAL.emailGeneral,
        companyPhone: EMPRENOR_LEGAL.telefonoPrincipal,
        phone: EMPRENOR_LEGAL.telefonoPrincipal,
        companyAddress: EMPRENOR_OFICINAS[0].direccion,
        address: `Oficinas NOA — ${EMPRENOR_OFICINAS.map((o) => o.nombre).join(", ")}`,
        website: process.env.NEXT_PUBLIC_SITE_URL || "https://www.emprenor.com",
        fundacion: EMPRENOR_LEGAL.fundacion,
        syncSource: "maintenance-v1",
        updatedAt: now,
      },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true },
  )
  return true
}

/** Portal empleado: documento por defecto si falta. */
export async function syncPortalSettings(db: Db): Promise<boolean> {
  const now = new Date()
  const doc = await db.collection("settings").findOne({ type: "portal_employee" })
  const portal = doc?.portal
    ? mergePortalSettings(doc.portal as Partial<typeof DEFAULT_PORTAL_SETTINGS>)
    : DEFAULT_PORTAL_SETTINGS

  await db.collection("settings").updateOne(
    { type: "portal_employee" },
    {
      $set: { type: "portal_employee", portal, updatedAt: now },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true },
  )
  return true
}

type ServiceSeed = (typeof SITE_SERVICE_DEFAULTS)[number]

function serviceUpdateFields(seed: ServiceSeed) {
  const { slug: _slug, ...fields } = seed
  return fields
}

/** Sincroniza los 9 servicios del CMS con los defaults del código (marca C&S). */
export async function syncSiteServices(db: Db): Promise<{ updated: number; total: number }> {
  const now = new Date()
  let updated = 0

  for (const seed of SITE_SERVICE_DEFAULTS) {
    const result = await db.collection<SiteService>("site_services").updateOne(
      { slug: seed.slug },
      {
        $set: {
          ...serviceUpdateFields(seed),
          updatedAt: now,
        },
        $setOnInsert: {
          slug: seed.slug,
          createdAt: now,
        },
      },
      { upsert: true },
    )
    if (result.modifiedCount > 0 || result.upsertedCount > 0) updated++
  }

  return { updated, total: SITE_SERVICE_DEFAULTS.length }
}

/** Portadas CMS (home, nosotros, contacto) con textos EMPRENOR C&S. */
export async function syncSitePageHeroes(db: Db): Promise<{ updated: number; slugs: string[] }> {
  const now = new Date()
  const slugs: string[] = []
  let updated = 0

  for (const slug of SITE_PAGE_SLUGS) {
    const heroSlides = SITE_DEFAULT_HERO[slug]
    const result = await db.collection("site_pages").updateOne(
      { slug },
      {
        $set: { slug, heroSlides, updatedAt: now },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true },
    )
    slugs.push(slug)
    if (result.modifiedCount > 0 || result.upsertedCount > 0) updated++
  }

  return { updated, slugs }
}

function scrubLegacyBrandInValue(value: unknown): { value: unknown; changed: boolean } {
  if (typeof value === "string") {
    let next = value
    let changed = false
    for (const pattern of LEGACY_BRAND_PATTERNS) {
      const re = new RegExp(pattern.source, pattern.flags)
      if (re.test(next)) {
        changed = true
        next = next
          .replace(/EMPRENOR Construcciones(?! y Servicios)/gi, EMPRENOR_BRAND.nombreExtendido)
          .replace(/empresa líder/gi, EMPRENOR_BRAND.siglas)
          .replace(/15 años de experiencia/gi, `desde ${EMPRENOR_LEGAL.fundacion}`)
          .replace(/construction-site-workers[^\s"']*/gi, "")
      }
    }
    return { value: next, changed }
  }
  if (Array.isArray(value)) {
    let changed = false
    const mapped = value.map((item) => {
      const r = scrubLegacyBrandInValue(item)
      if (r.changed) changed = true
      return r.value
    })
    return { value: mapped, changed }
  }
  if (value && typeof value === "object") {
    let changed = false
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      const r = scrubLegacyBrandInValue(v)
      if (r.changed) changed = true
      out[k] = r.value
    }
    return { value: out, changed }
  }
  return { value, changed: false }
}

/** Limpia textos/imágenes obsoletos en documentos CMS ya guardados. */
export async function cleanupLegacyBrandInCms(db: Db): Promise<{
  siteServices: number
  sitePages: number
}> {
  let siteServices = 0
  let sitePages = 0

  const services = await db.collection<SiteService>("site_services").find({}).toArray()
  for (const doc of services) {
    const { value, changed } = scrubLegacyBrandInValue(doc)
    if (changed) {
      await db.collection("site_services").replaceOne({ _id: doc._id }, value as SiteService)
      siteServices++
    }
  }

  const pages = await db.collection("site_pages").find({}).toArray()
  for (const doc of pages) {
    const { value, changed } = scrubLegacyBrandInValue(doc)
    if (changed) {
      await db.collection("site_pages").replaceOne({ _id: doc._id }, value)
      sitePages++
    }
  }

  return { siteServices, sitePages }
}

/** Ejecuta sincronización completa: índices + datos de marca + CMS. */
export async function runFullDatabaseSync(db: Db): Promise<DbSyncResult> {
  const connection = await testDatabaseConnection(db)
  if (!connection.ok) {
    return {
      connection,
      indexes: [],
      companySettings: false,
      portalSettings: false,
      siteServices: { updated: 0, total: 0 },
      sitePages: { updated: 0, slugs: [] },
      brandCleanup: { siteServices: 0, sitePages: 0 },
    }
  }

  const indexes = await ensureAllIndexes(db)
  const companySettings = await syncCompanySettings(db)
  const portalSettings = await syncPortalSettings(db)
  const siteServices = await syncSiteServices(db)
  const sitePages = await syncSitePageHeroes(db)
  const brandCleanup = await cleanupLegacyBrandInCms(db)

  return {
    connection,
    indexes,
    companySettings,
    portalSettings,
    siteServices,
    sitePages,
    brandCleanup,
  }
}
