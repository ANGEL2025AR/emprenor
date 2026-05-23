import type {
  ComplianceChecklistKey,
  ComplianceDocument,
  Project,
  SiteComplaint,
  WorkforceRoster,
  WorkforceRosterEntry,
  WorkIncident,
} from "@/lib/db/models"
import { currentPeriod } from "@/lib/compliance/period"

export type RosterStats = {
  total: number
  women: number
  men: number
  localCount: number
  localPercent: number
  signedConduct: number
  signedPatrimony: number
  signedGender: number
}

export function computeRosterStats(entries: WorkforceRosterEntry[]): RosterStats {
  const active = entries.filter((e) => e.active)
  const women = active.filter((e) => e.gender === "F").length
  const men = active.filter((e) => e.gender === "M").length
  const localCount = active.filter((e) => e.isLocalWorkforce).length
  const total = active.length
  return {
    total,
    women,
    men,
    localCount,
    localPercent: total > 0 ? Math.round((localCount / total) * 100) : 0,
    signedConduct: active.filter((e) => e.codeOfConductSigned).length,
    signedPatrimony: active.filter((e) => e.patrimonyTrainingSigned).length,
    signedGender: active.filter((e) => e.genderTrainingSigned).length,
  }
}

export type ChecklistItem = {
  key: ComplianceChecklistKey
  label: string
  status: "ok" | "warning" | "error" | "na"
  detail: string
}

export function buildComplianceChecklist(input: {
  project: Project
  roster: WorkforceRoster | null
  documents: ComplianceDocument[]
  openIncidents: number
  openComplaints: number
}): ChecklistItem[] {
  const { project, roster, documents, openIncidents, openComplaints } = input
  const enabled = project.institutionalCompliance?.enabled
  if (!enabled) {
    return [{
      key: "roster_current",
      label: "Cumplimiento institucional",
      status: "na",
      detail: "No habilitado para esta obra",
    }]
  }

  const period = currentPeriod()
  const rosterOk = roster && roster.period === period && roster.entries.filter((e) => e.active).length > 0
  const stats = roster ? computeRosterStats(roster.entries) : null

  const artDoc = documents.find((d) => d.category === "art_policy")
  const artValid = artDoc && (!artDoc.validUntil || new Date(artDoc.validUntil) >= new Date())

  const insuranceDoc = documents.find((d) => d.category === "employee_insurance")
  const insuranceValid = insuranceDoc && (!insuranceDoc.validUntil || new Date(insuranceDoc.validUntil) >= new Date())

  const conductPct = stats && stats.total > 0 ? Math.round((stats.signedConduct / stats.total) * 100) : 0
  const patrimonyDoc = documents.some((d) => d.category === "patrimony_training")
  const genderDoc = documents.some((d) => d.category === "gender_commitment")
  const indigenousDoc = documents.some((d) => d.category === "indigenous_guidelines")

  return [
    {
      key: "roster_current",
      label: "Nómina del periodo",
      status: rosterOk ? "ok" : "error",
      detail: rosterOk ? `Nómina ${period} cargada (${stats?.total ?? 0} personas)` : `Falta nómina de ${period}`,
    },
    {
      key: "art_valid",
      label: "ART vigente",
      status: artValid ? "ok" : "error",
      detail: artValid ? "Documentación ART cargada" : "Falta constancia o póliza ART",
    },
    {
      key: "insurance_valid",
      label: "Seguro de personal",
      status: insuranceValid ? "ok" : "warning",
      detail: insuranceValid ? "Seguros al día" : "Sin documentación de seguros (si aplica)",
    },
    {
      key: "code_of_conduct_signed",
      label: "Código de conducta firmado",
      status: conductPct >= 100 ? "ok" : conductPct >= 50 ? "warning" : "error",
      detail: stats ? `${stats.signedConduct}/${stats.total} firmaron (${conductPct}%)` : "Sin personal en nómina",
    },
    {
      key: "patrimony_training",
      label: "Capacitación patrimonio cultural",
      status: patrimonyDoc || (stats && stats.signedPatrimony === stats.total && stats.total > 0) ? "ok" : "warning",
      detail: patrimonyDoc ? "Evidencia cargada" : `${stats?.signedPatrimony ?? 0}/${stats?.total ?? 0} firmaron inducción`,
    },
    {
      key: "gender_commitment",
      label: "Compromiso violencia de género",
      status: genderDoc ? "ok" : "warning",
      detail: genderDoc ? "Documento firmado cargado" : "Pendiente de cargar acta/compromiso",
    },
    {
      key: "indigenous_guidelines",
      label: "Lineamientos comunidades",
      status: indigenousDoc ? "ok" : "warning",
      detail: indigenousDoc ? "Lineamientos registrados" : "Pendiente documentación",
    },
    {
      key: "complaint_book_active",
      label: "Libro de quejas",
      status: project.institutionalCompliance?.complaintBookLocation ? "ok" : "warning",
      detail: project.institutionalCompliance?.complaintBookLocation
        ? `Ubicación: ${project.institutionalCompliance.complaintBookLocation}`
        : "Indicar ubicación del libro en obrador",
    },
    {
      key: "incidents_reported",
      label: "Incidentes abiertos",
      status: openIncidents === 0 ? "ok" : "warning",
      detail: openIncidents === 0 ? "Sin incidentes abiertos" : `${openIncidents} incidente(s) abierto(s)`,
    },
  ]
}

export function complianceScore(items: ChecklistItem[]): number {
  const relevant = items.filter((i) => i.status !== "na")
  if (relevant.length === 0) return 0
  const points = relevant.reduce((sum, i) => {
    if (i.status === "ok") return sum + 100
    if (i.status === "warning") return sum + 50
    return sum
  }, 0)
  return Math.round(points / relevant.length)
}

export function exportRosterCsv(entries: WorkforceRosterEntry[], period: string): string {
  const header = [
    "Apellidos y Nombres",
    "Fecha Nac.",
    "CUIL",
    "Cargo/función en la obra",
    "Sexo V",
    "Sexo M",
    "Nro. asegurado/a ó Condición ante ART",
    "Domicilio",
    "Localidad",
    "Provincia",
    "Distancia km",
    "Mano de obra local (1/0)",
    "Comunidad indígena",
  ]
  const rows = entries.filter((e) => e.active).map((e) => {
    const fullName = `${e.lastName} ${e.firstName}`.trim()
    const domicilio = `${e.address}, ${e.city}, ${e.province}`.replace(/,/g, " ")
    const indigenous = e.indigenousCommunity?.yes
      ? `SI - ${e.indigenousCommunity.name ?? ""}`
      : "NO"
    return [
      fullName,
      e.birthDate ?? "",
      e.cuil,
      e.roleOnSite,
      e.gender === "F" ? "1" : "",
      e.gender === "M" ? "1" : "",
      e.artInsuranceNumber ?? e.artCondition ?? "",
      e.address,
      e.city,
      e.province,
      e.distanceKm != null ? String(e.distanceKm) : "",
      e.isLocalWorkforce ? "1" : "0",
      indigenous,
    ]
  })
  const stats = computeRosterStats(entries)
  rows.push([])
  rows.push(["TOTAL MUJERES", "", String(stats.women)])
  rows.push(["TOTAL VARONES", "", String(stats.men)])
  rows.push(["TOTAL PERSONAL", "", String(stats.total)])
  rows.push(["% MANO DE OBRA LOCAL", "", "", "", "", "", "", "", "", "", "", String(stats.localPercent)])

  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`
  const lines = [
    `Registro nómina personal - obras - Periodo ${period}`,
    header.map(escape).join(";"),
    ...rows.map((r) => r.map((c) => escape(String(c ?? ""))).join(";")),
  ]
  return "\uFEFF" + lines.join("\r\n")
}
