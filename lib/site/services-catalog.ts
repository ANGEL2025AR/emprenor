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

const SERVICE_HERO_IMAGES: Record<string, string> = {
  construccion: "/servicios/construccion.jpg",
  remodelacion: "/servicios/remodelacion.jpg",
  albanileria: "/servicios/albanileria.jpg",
  pintura: "/servicios/pintura.jpg",
  "terminaciones-secas": "/servicios/durlock.jpg",
  herreria: "/servicios/herreria.jpg",
  "instalaciones-electricas": "/servicios/electricidad.jpg",
  "instalaciones-sanitarias": "/servicios/sanitaria.jpg",
  gas: "/servicios/gas.jpg",
  "obras-industriales": "/industrial-warehouse-construction.png",
  agropecuario: "/servicios/agro.jpg",
  climatizacion: "/servicios/clima.jpg",
  "infraestructura-vial": "/servicios/vial.jpg",
  "obras-institucionales": "/servicios/institucional.jpg",
  mantenimiento: "/servicios/mantenimiento.jpg",
  "viviendas-prefabricadas": "/modern-residential-house-construction.jpg",
  ingenieria: "/servicios/ingenieria.jpg",
  "gestion-de-proyectos": "/professional-construction-team-working.jpg",
}

export function catalogEntryToSiteService(entry: ServiceCatalogEntry): Omit<
  SiteService,
  "_id" | "createdAt" | "updatedAt"
> {
  return {
    slug: entry.slug,
    title: entry.title,
    shortDescription: entry.shortDescription,
    heroImage: SERVICE_HERO_IMAGES[entry.slug] ?? "",
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
