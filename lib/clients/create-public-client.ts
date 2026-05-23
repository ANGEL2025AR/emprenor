import type { ObjectId } from "mongodb"
import type { ClientComplianceType } from "@/lib/db/models"
import type { RegisterInput } from "@/lib/validations/schemas"
import {
  getPublicClientTypeLabel,
  getPublicRegistrationTypeOption,
  getRegistrationIntentLabel,
  mapPublicClientTypeToCompliance,
  mapPublicClientTypeToLegacy,
} from "@/lib/clients/public-registration-types"

export type PublicClientRecord = {
  name: string
  email: string
  phone: string
  company?: string
  address?: string
  city?: string
  province?: string
  cuit?: string
  complianceType: ClientComplianceType
  publicClientType: RegisterInput["publicClientType"]
  type: string
  status: "prospecto"
  registrationIntent: RegisterInput["registrationIntent"]
  source: "registro_publico"
  userId: ObjectId
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export function buildPublicClientRecord(data: RegisterInput, userId: ObjectId): PublicClientRecord {
  const profile = getPublicRegistrationTypeOption(data.publicClientType)
  const fullName = `${data.name.trim()} ${data.lastName.trim()}`.trim()
  const organization = data.company?.trim()
  const displayName = organization || fullName

  return {
    name: displayName,
    email: data.email.toLowerCase(),
    phone: data.phone?.trim() || "",
    company: organization || (data.publicClientType === "persona" ? fullName : ""),
    address: data.address?.trim() || "",
    city: data.city?.trim() || "",
    province: data.province?.trim() || "",
    cuit: data.cuit?.trim() || "",
    complianceType: mapPublicClientTypeToCompliance(data.publicClientType),
    publicClientType: data.publicClientType,
    type: mapPublicClientTypeToLegacy(data.publicClientType),
    status: "prospecto",
    registrationIntent: data.registrationIntent,
    source: "registro_publico",
    userId,
    notes: data.message?.trim() || "",
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

export function buildRegistrationContactMessage(data: RegisterInput): string {
  const typeLabel = getPublicClientTypeLabel(data.publicClientType)
  const intentLabel = getRegistrationIntentLabel(data.registrationIntent)
  const org = data.company?.trim()
  const lines = [
    `[Registro público] ${typeLabel} — ${intentLabel}`,
    org ? `Organización: ${org}` : null,
    data.message?.trim() ? `Mensaje: ${data.message.trim()}` : null,
  ].filter(Boolean)
  return lines.join("\n")
}
