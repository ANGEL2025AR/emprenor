import type { ClientComplianceType, ComplianceChecklistKey } from "@/lib/db/models"

export type ClientComplianceProfile = {
  label: string
  shortLabel: string
  description: string
  examples: string
  organizationPlaceholder: string
  /** Ítems del checklist que no aplican a este perfil (no penalizan el puntaje). */
  optionalChecklistKeys: ComplianceChecklistKey[]
}

export const CLIENT_COMPLIANCE_PROFILES: Record<ClientComplianceType, ClientComplianceProfile> = {
  organismo_internacional: {
    label: "Organismo internacional / ONG",
    shortLabel: "Org. internacional",
    description: "Auditoría completa: nómina, ART, documentos sociales, ambientales y compras locales.",
    examples: "FAO, PNUD, UNICEF, cooperación internacional",
    organizationPlaceholder: "Ej: FAO, PNUD",
    optionalChecklistKeys: [],
  },
  estado_municipio: {
    label: "Estado / Municipio / Ministerio",
    shortLabel: "Sector público",
    description: "Obras públicas con control de nómina, seguros, libro de quejas e incidentes.",
    examples: "Municipalidades, Ministerio de Salud, Educación, Obras Públicas",
    organizationPlaceholder: "Ej: Municipalidad de San Salvador de Jujuy",
    optionalChecklistKeys: ["indigenous_guidelines", "patrimony_training"],
  },
  empresa: {
    label: "Empresa privada",
    shortLabel: "Empresa",
    description: "Contratistas y empresas que subcontratan servicios de EMPRENOR.",
    examples: "Constructoras, industrias, empresas de servicios",
    organizationPlaceholder: "Ej: Constructora del Norte S.A.",
    optionalChecklistKeys: [
      "indigenous_guidelines",
      "patrimony_training",
      "gender_commitment",
      "complaint_book_active",
    ],
  },
  inmobiliaria_consorcio: {
    label: "Inmobiliaria / Consorcio / Barrio privado",
    shortLabel: "Inmobiliaria / consorcio",
    description: "Obras en edificios, consorcios, countries y desarrollos cerrados.",
    examples: "Administraciones de consorcio, desarrollistas, barrios privados",
    organizationPlaceholder: "Ej: Consorcio Edificio Belgrano 1200",
    optionalChecklistKeys: ["indigenous_guidelines", "patrimony_training", "gender_commitment"],
  },
  persona: {
    label: "Persona / Particular",
    shortLabel: "Particular",
    description: "Seguimiento simplificado: avance de obra, ART y documentación esencial.",
    examples: "Propietarios, familias, inversores individuales",
    organizationPlaceholder: "Ej: Juan Pérez",
    optionalChecklistKeys: [
      "indigenous_guidelines",
      "patrimony_training",
      "gender_commitment",
      "complaint_book_active",
      "code_of_conduct_signed",
    ],
  },
  otro: {
    label: "Otro tipo de cliente",
    shortLabel: "Otro",
    description: "Perfil estándar adaptable según lo acordado con el cliente.",
    examples: "Combinaciones o casos especiales",
    organizationPlaceholder: "Nombre del cliente o contratante",
    optionalChecklistKeys: [],
  },
}

export const CLIENT_COMPLIANCE_TYPE_OPTIONS = (
  Object.entries(CLIENT_COMPLIANCE_PROFILES) as [ClientComplianceType, ClientComplianceProfile][]
).map(([value, profile]) => ({ value, ...profile }))

export function resolveClientComplianceType(type?: ClientComplianceType): ClientComplianceType {
  if (type && type in CLIENT_COMPLIANCE_PROFILES) return type
  return "otro"
}

export function getClientComplianceProfile(type?: ClientComplianceType): ClientComplianceProfile {
  return CLIENT_COMPLIANCE_PROFILES[resolveClientComplianceType(type)]
}

export function getClientComplianceLabel(type?: ClientComplianceType): string {
  return getClientComplianceProfile(type).label
}

export function isChecklistOptional(type: ClientComplianceType | undefined, key: ComplianceChecklistKey): boolean {
  const profile = getClientComplianceProfile(type)
  return profile.optionalChecklistKeys.includes(key)
}

/** Etiqueta para mostrar en tarjetas: tipo + organización si existe. */
export function formatClientComplianceBadge(
  type?: ClientComplianceType,
  organization?: string,
): string {
  if (organization?.trim()) return organization.trim()
  return getClientComplianceProfile(type).shortLabel
}
