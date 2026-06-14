import catalog from "../../shared/services.catalog.json"
import type { SiteService, SiteServiceIconKey } from "@/lib/db/models"

export type ServiceCatalogEntry = (typeof catalog.services)[number]

export const SERVICES_CATALOG = catalog.services
export const LEGACY_SERVICE_SLUG_REDIRECTS = catalog.legacySlugRedirects as Record<string, string>

export function getCatalogBySlug(slug: string): ServiceCatalogEntry | undefined {
  return SERVICES_CATALOG.find((s) => s.slug === slug)
}

export function resolveServiceSlug(slug: string): string {
  return LEGACY_SERVICE_SLUG_REDIRECTS[slug] ?? slug
}

export function getAllServiceSlugs(): string[] {
  return SERVICES_CATALOG.map((s) => s.slug)
}

export function catalogEntryToSiteService(entry: ServiceCatalogEntry): Omit<
  SiteService,
  "_id" | "createdAt" | "updatedAt"
> {
  return {
    slug: entry.slug,
    title: entry.title,
    shortDescription: entry.shortDescription,
    heroImage: "",
    heroImageAlt: `${entry.title} — EMPRENOR C&S`,
    gallery: [],
    icon: entry.icon as SiteServiceIconKey,
    colorGradient: entry.colorGradient,
    features: [],
    overviewTitle: entry.title,
    overviewParagraphs: [entry.shortDescription],
    processSteps: [],
    workCategories: [],
    benefits: [],
    published: true,
    order: entry.order,
    seoTitle: `${entry.title} — EMPRENOR C&S`,
    seoDescription: entry.shortDescription,
  }
}

export function getDefaultServicesFromCatalog(): SiteService[] {
  const now = new Date()
  return SERVICES_CATALOG.map((entry) => ({
    ...catalogEntryToSiteService(entry),
    createdAt: now,
    updatedAt: now,
  }))
}

export const FOOTER_SERVICE_LINKS = SERVICES_CATALOG.map((s) => ({
  href: `/servicios/${s.slug}`,
  label: s.footerName,
}))
