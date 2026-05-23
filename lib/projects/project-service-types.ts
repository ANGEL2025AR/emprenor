import { SITE_SERVICE_DEFAULTS } from "@/lib/site/service-defaults"

/** Valores antiguos que pueden existir en proyectos ya guardados. */
export const PROJECT_TYPE_LEGACY = ["mantenimiento", "industrial", "otro"] as const

export type ProjectLegacyType = (typeof PROJECT_TYPE_LEGACY)[number]

export const PROJECT_SERVICE_SLUGS = SITE_SERVICE_DEFAULTS.map((s) => s.slug)

export const PROJECT_TYPE_VALUES = [...PROJECT_SERVICE_SLUGS, ...PROJECT_TYPE_LEGACY] as const

export type ProjectServiceSlug = (typeof PROJECT_SERVICE_SLUGS)[number]

export type ProjectType = (typeof PROJECT_TYPE_VALUES)[number]

/** Opciones para selects (servicios del sitio + mantenimiento / otro). */
export const PROJECT_TYPE_SELECT_OPTIONS: { value: ProjectType; label: string }[] = [
  ...[...SITE_SERVICE_DEFAULTS]
    .sort((a, b) => a.order - b.order)
    .map((s) => ({ value: s.slug as ProjectType, label: s.title })),
  { value: "mantenimiento", label: "Mantenimiento" },
  { value: "industrial", label: "Industrial (registro anterior)" },
  { value: "otro", label: "Otro / varios servicios" },
]

const LABEL_BY_VALUE = new Map(PROJECT_TYPE_SELECT_OPTIONS.map((o) => [o.value, o.label]))

export function getProjectTypeLabel(type: string | undefined): string {
  if (!type) return "—"
  return LABEL_BY_VALUE.get(type as ProjectType) ?? type.replace(/-/g, " ")
}

export function isValidProjectType(type: string): type is ProjectType {
  return (PROJECT_TYPE_VALUES as readonly string[]).includes(type)
}

/** Para zod.enum — tupla no vacía. */
export const PROJECT_TYPE_ZOD_ENUM = PROJECT_TYPE_VALUES as unknown as [ProjectType, ...ProjectType[]]
