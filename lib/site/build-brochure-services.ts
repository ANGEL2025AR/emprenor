import construccion from "../../shared/service-configs/construccion.json"
import instalacionesElectricas from "../../shared/service-configs/instalaciones-electricas.json"
import instalacionesSanitarias from "../../shared/service-configs/instalaciones-sanitarias.json"
import gas from "../../shared/service-configs/gas.json"
import obrasIndustriales from "../../shared/service-configs/obras-industriales.json"
import remodelacion from "../../shared/service-configs/remodelacion.json"
import albanileria from "../../shared/service-configs/albanileria.json"
import pintura from "../../shared/service-configs/pintura.json"
import agropecuario from "../../shared/service-configs/agropecuario.json"
import climatizacion from "../../shared/service-configs/climatizacion.json"
import mantenimiento from "../../shared/service-configs/mantenimiento.json"
import viviendasPrefabricadas from "../../shared/service-configs/viviendas-prefabricadas.json"
import { SERVICES_CATALOG } from "./services-catalog"

export type BrochureServiceCategory = { title: string; items: string[] }
export type BrochureServiceDetail = {
  num: string
  id: string
  slug: string
  title: string
  tagline: string
  intro: string
  image: string
  norms: string[]
  categories: BrochureServiceCategory[]
}

type Section = Record<string, unknown> & { type: string }

const CONFIG_BY_SLUG: Record<string, { sections?: Section[]; hero?: Record<string, unknown> }> = {
  construccion,
  remodelacion,
  albanileria,
  pintura,
  "instalaciones-electricas": instalacionesElectricas,
  "instalaciones-sanitarias": instalacionesSanitarias,
  gas,
  "obras-industriales": obrasIndustriales,
  agropecuario,
  climatizacion,
  mantenimiento,
  "viviendas-prefabricadas": viviendasPrefabricadas,
}

const DEFAULT_NORMS = ["AEA 90364", "NAG / ENARGAS", "CIRSOC", "Normativa municipal NOA"]

function flattenSections(sections: Section[] = []): Section[] {
  const out: Section[] = []
  for (const s of sections) {
    out.push(s)
    if (s.type === "group" && Array.isArray(s.children)) {
      out.push(...(s.children as Section[]))
    }
  }
  return out
}

function categoriesFromConfig(config: { sections?: Section[] }): BrochureServiceCategory[] {
  const categories: BrochureServiceCategory[] = []
  for (const section of flattenSections(config.sections)) {
    if (section.type === "subtypes" && Array.isArray(section.subtypes)) {
      for (const st of section.subtypes as Array<{ title: string; items: string[] }>) {
        categories.push({ title: st.title, items: st.items })
      }
    }
    if (section.type === "two-cols-lists" && Array.isArray(section.columns)) {
      for (const col of section.columns as Array<{ title: string; items: string[] }>) {
        categories.push({ title: col.title, items: col.items })
      }
    }
    if (section.type === "cards" && Array.isArray(section.items)) {
      for (const card of section.items as Array<{ title: string; items: string[] }>) {
        categories.push({ title: card.title, items: card.items })
      }
    }
    if (section.type === "extras-dark" && Array.isArray(section.items)) {
      categories.push({ title: "Alcance adicional", items: section.items as string[] })
    }
  }
  return categories
}

function introFromConfig(config: { sections?: Section[]; hero?: Record<string, unknown> }): string {
  const intro = flattenSections(config.sections).find((s) => s.type === "intro")
  const paragraphs = (intro?.paragraphs as string[]) || []
  if (paragraphs[0]) return paragraphs[0]
  return String(config.hero?.subtitle || "")
}

function imageFromConfig(config: { sections?: Section[] }): string {
  const intro = flattenSections(config.sections).find((s) => s.type === "intro")
  if (intro?.image) return String(intro.image)
  return "/assets/prefab/living.jpg"
}

function normsFromConfig(config: { sections?: Section[] }): string[] {
  const intro = flattenSections(config.sections).find((s) => s.type === "intro")
  const badges = (intro?.badges as string[]) || []
  const tagBox = intro?.tagBox as { tags?: string[] } | undefined
  const tags = tagBox?.tags || (intro?.tags as string[]) || []
  const merged = [...badges, ...tags].filter(Boolean)
  return merged.length ? [...new Set(merged)].slice(0, 8) : DEFAULT_NORMS
}

export function buildBrochureServicesDetail(): BrochureServiceDetail[] {
  return SERVICES_CATALOG.map((entry) => {
    const config = CONFIG_BY_SLUG[entry.slug] || { sections: [], hero: {} }
    const hero = config.hero || {}
    return {
      num: String(entry.order).padStart(2, "0"),
      id: entry.slug,
      slug: entry.slug,
      title: entry.title,
      tagline: String(hero.subtitle || entry.shortDescription),
      intro: introFromConfig(config),
      image: imageFromConfig(config),
      norms: normsFromConfig(config),
      categories: categoriesFromConfig(config),
    }
  })
}

export function getServicePageChunks(service: BrochureServiceDetail) {
  const itemCount = service.categories.reduce((n, c) => n + c.items.length, 0)
  const needsSplit = service.categories.length > 4 || itemCount > 24
  if (!needsSplit) {
    return [{ categories: service.categories, suffix: "", continued: false }]
  }
  const mid = Math.ceil(service.categories.length / 2)
  return [
    { categories: service.categories.slice(0, mid), suffix: " — Alcance I", continued: true },
    { categories: service.categories.slice(mid), suffix: " — Alcance II", continued: false },
  ]
}

export const BROCHURE_SERVICES_DETAIL = buildBrochureServicesDetail()
