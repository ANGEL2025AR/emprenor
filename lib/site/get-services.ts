import type { SiteService } from "@/lib/db/models"
import { getDb } from "@/lib/db/connection"
import { getDefaultServicesFromCatalog, LEGACY_SERVICE_SLUG_REDIRECTS, resolveServiceSlug } from "./services-catalog"

function isMissingMongoUriError(error: unknown): boolean {
  return error instanceof Error && error.message.includes("MONGODB_URI")
}

export function getDefaultServices(): SiteService[] {
  return getDefaultServicesFromCatalog()
}

function preferCanonicalDoc(docs: SiteService[]): Map<string, SiteService> {
  const bySlug = new Map<string, SiteService>()
  for (const doc of docs) {
    const resolved = resolveServiceSlug(doc.slug)
    const current = bySlug.get(resolved)
    if (!current || doc.slug === resolved) {
      bySlug.set(resolved, { ...doc, slug: resolved })
    }
  }
  return bySlug
}

function legacySlugsFor(resolved: string): string[] {
  return Object.entries(LEGACY_SERVICE_SLUG_REDIRECTS)
    .filter(([, target]) => target === resolved)
    .map(([from]) => from)
}

function mergePublishedWithCatalog(docs: SiteService[], defaults: SiteService[]): SiteService[] {
  const bySlug = preferCanonicalDoc(docs)

  return defaults
    .map((entry) => {
      const fromDb = bySlug.get(entry.slug)
      if (!fromDb) return entry
      return {
        ...entry,
        title: fromDb.title?.trim() || entry.title,
        shortDescription: fromDb.shortDescription?.trim() || entry.shortDescription,
        heroImage: fromDb.heroImage || entry.heroImage,
        heroImageAlt: fromDb.heroImageAlt || entry.heroImageAlt,
        gallery: fromDb.gallery?.length ? fromDb.gallery : entry.gallery,
        features: fromDb.features?.length ? fromDb.features : entry.features,
        published: fromDb.published !== false,
      }
    })
    .filter((entry) => entry.published !== false)
    .sort((a, b) => a.order - b.order)
}

export async function getPublishedServices(): Promise<SiteService[]> {
  const defaults = getDefaultServices()

  if (!process.env.MONGODB_URI?.trim()) {
    return defaults.filter((s) => s.published).sort((a, b) => a.order - b.order)
  }

  try {
    const db = await getDb()
    const docs = await db
      .collection<SiteService>("site_services")
      .find({})
      .sort({ order: 1 })
      .toArray()

    if (!docs.length) {
      return defaults.filter((s) => s.published).sort((a, b) => a.order - b.order)
    }

    return mergePublishedWithCatalog(docs, defaults)
  } catch (error) {
    if (!isMissingMongoUriError(error)) {
      console.error("[site_services] Error al leer servicios:", error)
    }
    return defaults.filter((s) => s.published).sort((a, b) => a.order - b.order)
  }
}

export async function getAllServicesAdmin(): Promise<SiteService[]> {
  const defaults = getDefaultServices()

  if (!process.env.MONGODB_URI?.trim()) {
    return defaults.sort((a, b) => a.order - b.order)
  }

  try {
    const db = await getDb()
    const docs = await db.collection<SiteService>("site_services").find({}).sort({ order: 1 }).toArray()
    if (!docs.length) return defaults.sort((a, b) => a.order - b.order)
    const bySlug = preferCanonicalDoc(docs)
    return defaults
      .map((entry) => {
        const fromDb = bySlug.get(entry.slug)
        return fromDb ? { ...entry, ...fromDb, slug: entry.slug } : entry
      })
      .sort((a, b) => a.order - b.order)
  } catch (error) {
    if (!isMissingMongoUriError(error)) {
      console.error("[site_services] Error admin:", error)
    }
    return defaults.sort((a, b) => a.order - b.order)
  }
}

export async function getServiceBySlug(slug: string): Promise<SiteService | null> {
  const resolved = resolveServiceSlug(slug)
  const fallback = getDefaultServices().find((s) => s.slug === resolved) ?? null

  if (!process.env.MONGODB_URI?.trim()) {
    return fallback?.published ? fallback : null
  }

  try {
    const db = await getDb()
    const doc = await db.collection<SiteService>("site_services").findOne({ slug: resolved, published: true })
    if (doc) return doc
    return fallback?.published ? fallback : null
  } catch (error) {
    if (!isMissingMongoUriError(error)) {
      console.error("[site_services] Error slug:", slug, error)
    }
    return fallback?.published ? fallback : null
  }
}

export async function getServiceBySlugAdmin(slug: string): Promise<SiteService | null> {
  const resolved = resolveServiceSlug(slug)
  const fallback = getDefaultServices().find((s) => s.slug === resolved) ?? null

  if (!process.env.MONGODB_URI?.trim()) {
    return fallback
  }

  try {
    const db = await getDb()
    const candidates = [resolved, ...legacySlugsFor(resolved)]
    const docs = await db
      .collection<SiteService>("site_services")
      .find({ slug: { $in: candidates } })
      .toArray()
    const doc = preferCanonicalDoc(docs).get(resolved)
    if (!doc) return fallback
    return { ...(fallback ?? {}), ...doc, slug: resolved }
  } catch (error) {
    if (!isMissingMongoUriError(error)) {
      console.error("[site_services] Error admin slug:", slug, error)
    }
    return fallback
  }
}

export type ServiceNavItem = {
  slug: string
  title: string
  shortDescription: string
  href: string
  icon: SiteService["icon"]
}

export function toServiceNavItem(service: SiteService): ServiceNavItem {
  return {
    slug: service.slug,
    title: service.title,
    shortDescription: service.shortDescription,
    href: `/servicios/${service.slug}`,
    icon: service.icon,
  }
}
