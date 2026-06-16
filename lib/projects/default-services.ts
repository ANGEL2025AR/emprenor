import { SERVICES_CATALOG } from "@/lib/site/services-catalog"
import type { ProjectServiceLine } from "@/lib/db/models"

/** Las 12 líneas de servicio EMPRENOR para cada obra nueva. */
export function buildDefaultProjectServices(): ProjectServiceLine[] {
  return SERVICES_CATALOG.map((entry) => ({
    slug: entry.slug,
    title: entry.title,
    status: "pendiente" as const,
    order: entry.order,
    documentCount: 0,
  })).sort((a, b) => a.order - b.order)
}
