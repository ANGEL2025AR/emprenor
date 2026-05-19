export type EmployeeDocumentCategory = "empresa" | "personal"

export type EmployeeDocumentType =
  | "art"
  | "seguro_vida"
  | "alta_afip"
  | "recibo_sueldo"
  | "contrato_trabajo"
  | "anexo_contrato"
  | "constancia_cuil"
  | "seguro_accidentes"
  | "registro_sindical"
  | "antecedentes_penales"
  | "certificado_medico"
  | "constancia_epp"
  | "dni"
  | "curriculum"
  | "titulo"
  | "carnet_conducir"
  | "capacitacion"
  | "examen_preocupacional"
  | "otro_empresa"
  | "otro_personal"

export interface EmployeeDocumentRecord {
  _id?: string
  userId?: string
  employeeId?: string
  type: EmployeeDocumentType
  category: EmployeeDocumentCategory
  name: string
  description?: string
  fileUrl: string
  fileName: string
  mimeType: string
  size: number
  issuedAt?: string
  expiresAt?: string
  status: "vigente" | "vencido" | "pendiente"
  uploadedBy: string
  source: "admin" | "employee"
  createdAt: string
  updatedAt: string
}

export const EMPLOYEE_DOCUMENT_LABELS: Record<EmployeeDocumentType, string> = {
  art: "ART / Seguro de accidentes de trabajo",
  seguro_vida: "Seguro de vida",
  alta_afip: "Alta AFIP / F931",
  recibo_sueldo: "Recibo de sueldos",
  contrato_trabajo: "Contrato de trabajo",
  anexo_contrato: "Anexo / adenda contractual",
  constancia_cuil: "Constancia de CUIL",
  seguro_accidentes: "Póliza / seguro complementario",
  registro_sindical: "Aporte sindical / UOCRA",
  antecedentes_penales: "Antecedentes penales",
  certificado_medico: "Certificado médico / apto físico",
  constancia_epp: "Constancia de entrega de EPP",
  dni: "DNI / documento de identidad",
  curriculum: "Curriculum vitae",
  titulo: "Título / certificación profesional",
  carnet_conducir: "Licencia de conducir",
  capacitacion: "Capacitación / curso",
  examen_preocupacional: "Examen preocupacional",
  otro_empresa: "Otro (empresa)",
  otro_personal: "Otro (personal)",
}

/** Documentos que suele cargar RRHH / administración */
export const COMPANY_DOCUMENT_TYPES: EmployeeDocumentType[] = [
  "art",
  "seguro_vida",
  "alta_afip",
  "recibo_sueldo",
  "contrato_trabajo",
  "anexo_contrato",
  "constancia_cuil",
  "seguro_accidentes",
  "registro_sindical",
  "otro_empresa",
]

/** Documentos que el empleado gestiona en su legajo */
export const PERSONAL_DOCUMENT_TYPES: EmployeeDocumentType[] = [
  "antecedentes_penales",
  "certificado_medico",
  "constancia_epp",
  "dni",
  "curriculum",
  "titulo",
  "carnet_conducir",
  "capacitacion",
  "examen_preocupacional",
  "otro_personal",
]

export function getDocumentCategory(type: EmployeeDocumentType): EmployeeDocumentCategory {
  return COMPANY_DOCUMENT_TYPES.includes(type) ? "empresa" : "personal"
}

export function computeDocumentStatus(expiresAt?: string | Date | null): EmployeeDocumentRecord["status"] {
  if (!expiresAt) return "vigente"
  const exp = new Date(expiresAt)
  if (Number.isNaN(exp.getTime())) return "vigente"
  return exp < new Date() ? "vencido" : "vigente"
}
