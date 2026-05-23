import type { ComplianceDocumentCategory } from "@/lib/db/models"

export const COMPLIANCE_DOC_LABELS: Record<ComplianceDocumentCategory, string> = {
  art_policy: "ART / Póliza vigente",
  employee_insurance: "Seguro de personal",
  code_of_conduct: "Código de conducta firmado",
  patrimony_training: "Capacitación patrimonio cultural",
  indigenous_guidelines: "Lineamientos comunidades indígenas",
  gender_commitment: "Compromiso violencia de género",
  other: "Otro documento",
}

export const COMPLAINT_STATUS_LABELS = {
  abierta: "Abierta",
  en_gestion: "En gestión",
  resuelta: "Resuelta",
} as const

export async function uploadComplianceFile(file: File): Promise<{
  url: string
  fileName: string
  mimeType: string
  fileSize: number
}> {
  const body = new FormData()
  body.append("file", file)
  body.append("folder", "compliance")
  const res = await fetch("/api/compliance/upload", { method: "POST", body, credentials: "include" })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || "Error al subir")
  return data
}

export function newRosterEntryId(): string {
  return typeof crypto !== "undefined" ? crypto.randomUUID() : `row-${Date.now()}`
}
