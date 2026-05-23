import type { ClientComplianceType } from "@/lib/db/models"

/** Tipos visibles en el formulario público de registro (más granulares que compliance). */
export const PUBLIC_CLIENT_TYPES = [
  "persona",
  "empresa",
  "cooperativa",
  "gobierno",
  "consorcio",
  "barrio_privado",
  "inmobiliaria",
  "organismo_internacional",
  "otro",
] as const

export type PublicClientType = (typeof PUBLIC_CLIENT_TYPES)[number]

export const REGISTRATION_INTENTS = ["consulta", "cotizacion", "seguimiento_obra"] as const
export type RegistrationIntent = (typeof REGISTRATION_INTENTS)[number]

export type PublicRegistrationTypeOption = {
  value: PublicClientType
  label: string
  shortLabel: string
  description: string
  examples: string
  organizationLabel: string
  organizationPlaceholder: string
}

export const PUBLIC_REGISTRATION_TYPE_OPTIONS: PublicRegistrationTypeOption[] = [
  {
    value: "persona",
    label: "Particular / Persona",
    shortLabel: "Particular",
    description: "Propietario, familia o inversor individual.",
    examples: "Vivienda propia, refacción, ampliación",
    organizationLabel: "Nombre completo",
    organizationPlaceholder: "Ej: Juan Pérez",
  },
  {
    value: "empresa",
    label: "Empresa privada",
    shortLabel: "Empresa",
    description: "Constructora, industria o comercio que contrata servicios.",
    examples: "Constructoras, fábricas, comercios",
    organizationLabel: "Razón social / Empresa",
    organizationPlaceholder: "Ej: Constructora del Norte S.A.",
  },
  {
    value: "cooperativa",
    label: "Cooperativa / Mutual",
    shortLabel: "Cooperativa",
    description: "Cooperativas de vivienda, trabajo o servicios.",
    examples: "Cooperativas de vivienda, mutuales, agrupaciones",
    organizationLabel: "Nombre de la cooperativa",
    organizationPlaceholder: "Ej: Cooperativa Vivienda Jujuy",
  },
  {
    value: "gobierno",
    label: "Gobierno / Municipio / Ministerio",
    shortLabel: "Sector público",
    description: "Organismos estatales, municipios y ministerios.",
    examples: "Municipalidades, ministerios, entes autárquicos",
    organizationLabel: "Organismo / Dependencia",
    organizationPlaceholder: "Ej: Municipalidad de San Salvador de Jujuy",
  },
  {
    value: "consorcio",
    label: "Consorcio de propietarios",
    shortLabel: "Consorcio",
    description: "Administración de edificios y consorcios.",
    examples: "Consorcios edilicios, administraciones",
    organizationLabel: "Consorcio / Edificio",
    organizationPlaceholder: "Ej: Consorcio Belgrano 1200",
  },
  {
    value: "barrio_privado",
    label: "Barrio privado / Country",
    shortLabel: "Barrio privado",
    description: "Countries, barrios cerrados y desarrollos.",
    examples: "Countries, barrios privados, loteos cerrados",
    organizationLabel: "Nombre del barrio / desarrollo",
    organizationPlaceholder: "Ej: Barrio Privado Los Alamos",
  },
  {
    value: "inmobiliaria",
    label: "Inmobiliaria / Desarrollista",
    shortLabel: "Inmobiliaria",
    description: "Desarrollos inmobiliarios y administraciones.",
    examples: "Inmobiliarias, desarrollistas",
    organizationLabel: "Inmobiliaria / Desarrollista",
    organizationPlaceholder: "Ej: Desarrollos del Valle S.R.L.",
  },
  {
    value: "organismo_internacional",
    label: "Organismo internacional / ONG",
    shortLabel: "Org. internacional",
    description: "Cooperación internacional y organismos multilaterales.",
    examples: "FAO, PNUD, ONG, cooperación internacional",
    organizationLabel: "Organización",
    organizationPlaceholder: "Ej: FAO Argentina",
  },
  {
    value: "otro",
    label: "Otro tipo",
    shortLabel: "Otro",
    description: "Casos especiales o combinaciones.",
    examples: "Combinaciones o perfiles no listados",
    organizationLabel: "Nombre del contratante",
    organizationPlaceholder: "Nombre de su organización o proyecto",
  },
]

export const REGISTRATION_INTENT_OPTIONS: { value: RegistrationIntent; label: string; description: string }[] = [
  {
    value: "consulta",
    label: "Consulta general",
    description: "Quiero información sobre servicios de EMPRENOR.",
  },
  {
    value: "cotizacion",
    label: "Pedir cotización",
    description: "Necesito presupuesto para una obra o servicio.",
  },
  {
    value: "seguimiento_obra",
    label: "Seguimiento de obra",
    description: "Soy cliente y quiero acceder al portal de mi obra.",
  },
]

const COMPLIANCE_MAP: Record<PublicClientType, ClientComplianceType> = {
  persona: "persona",
  empresa: "empresa",
  cooperativa: "empresa",
  gobierno: "estado_municipio",
  consorcio: "inmobiliaria_consorcio",
  barrio_privado: "inmobiliaria_consorcio",
  inmobiliaria: "inmobiliaria_consorcio",
  organismo_internacional: "organismo_internacional",
  otro: "otro",
}

const LEGACY_TYPE_MAP: Record<PublicClientType, string> = {
  persona: "particular",
  empresa: "empresa",
  cooperativa: "empresa",
  gobierno: "gobierno",
  consorcio: "empresa",
  barrio_privado: "empresa",
  inmobiliaria: "empresa",
  organismo_internacional: "gobierno",
  otro: "particular",
}

export function mapPublicClientTypeToCompliance(type: PublicClientType): ClientComplianceType {
  return COMPLIANCE_MAP[type] ?? "otro"
}

export function mapPublicClientTypeToLegacy(type: PublicClientType): string {
  return LEGACY_TYPE_MAP[type] ?? "particular"
}

export function getPublicRegistrationTypeOption(type: PublicClientType): PublicRegistrationTypeOption {
  return PUBLIC_REGISTRATION_TYPE_OPTIONS.find((o) => o.value === type) ?? PUBLIC_REGISTRATION_TYPE_OPTIONS.at(-1)!
}

export function requiresOrganizationName(type: PublicClientType): boolean {
  return type !== "persona"
}

export function showsCuitField(type: PublicClientType): boolean {
  return ["empresa", "cooperativa", "gobierno", "consorcio", "inmobiliaria", "organismo_internacional"].includes(type)
}

export function getPublicClientTypeLabel(type: PublicClientType): string {
  return getPublicRegistrationTypeOption(type).label
}

export function getRegistrationIntentLabel(intent: RegistrationIntent): string {
  return REGISTRATION_INTENT_OPTIONS.find((o) => o.value === intent)?.label ?? intent
}
