import type { ObjectId } from "mongodb"
import type { ClientComplianceType, ProjectInstitutionalCompliance } from "@/lib/db/models"
import { resolveClientComplianceType as resolveComplianceTypeEnum } from "@/lib/compliance/client-types"

/** Registro en colección `clients`. */
export type ClientRecord = {
  _id?: ObjectId | string
  name: string
  email: string
  phone?: string
  company?: string
  address?: string
  city?: string
  province?: string
  complianceType?: ClientComplianceType
  /** Valores legacy: particular | empresa | gobierno */
  type?: string
}

const LEGACY_CLIENT_TYPE_MAP: Record<string, ClientComplianceType> = {
  particular: "persona",
  empresa: "empresa",
  gobierno: "estado_municipio",
}

export function resolveClientRecordComplianceType(client: ClientRecord): ClientComplianceType {
  if (client.complianceType) return resolveComplianceTypeEnum(client.complianceType)
  if (client.type && LEGACY_CLIENT_TYPE_MAP[client.type]) return LEGACY_CLIENT_TYPE_MAP[client.type]
  return "otro"
}

export function clientOrganizationName(client: ClientRecord): string {
  return (client.company?.trim() || client.name).trim()
}

export function buildProjectClientFields(client: ClientRecord) {
  const addressParts = [client.address, client.city, client.province].filter((p) => p?.trim())
  const phone = client.phone?.trim() || ""
  return {
    name: clientOrganizationName(client),
    email: client.email?.trim() || "sin-email@emprenor.local",
    phone: phone.length >= 8 ? phone : "0000000000",
    address: addressParts.length > 0 ? addressParts.join(", ") : "Sin dirección registrada",
  }
}

export function buildComplianceFromClient(
  client: ClientRecord,
  existing?: ProjectInstitutionalCompliance,
): ProjectInstitutionalCompliance {
  return {
    enabled: existing?.enabled ?? false,
    clientType: resolveClientRecordComplianceType(client),
    clientOrganization: clientOrganizationName(client),
    contractReference: existing?.contractReference,
    orderReference: existing?.orderReference,
    siteName: existing?.siteName,
    socialResponsible: existing?.socialResponsible,
    siteResponsible: existing?.siteResponsible,
    complaintBookLocation: existing?.complaintBookLocation,
    macEmail: existing?.macEmail,
    contractorHotline: existing?.contractorHotline,
  }
}

export function projectSyncFromClient(
  client: ClientRecord,
  existingCompliance?: ProjectInstitutionalCompliance,
) {
  return {
    client: buildProjectClientFields(client),
    institutionalCompliance: buildComplianceFromClient(client, existingCompliance),
  }
}
