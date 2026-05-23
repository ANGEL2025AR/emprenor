import { ObjectId } from "mongodb"
import { getDb } from "@/lib/db/connection"
import { currentPeriod } from "@/lib/compliance/period"
import {
  buildComplianceChecklist,
  complianceScore,
  computeRosterStats,
  exportRosterCsv,
} from "@/lib/compliance/roster"
import type {
  ComplianceDocument,
  LocalPurchase,
  Project,
  SiteComplaint,
  WorkforceRoster,
  WorkIncident,
} from "@/lib/db/models"

export async function buildComplianceAuditPack(projectId: string, period?: string) {
  const p = period || currentPeriod()
  const db = await getDb()
  const oid = new ObjectId(projectId)

  const project = await db.collection<Project>("projects").findOne({ _id: oid })
  if (!project) return null

  const [roster, documents, incidents, complaints, purchases] = await Promise.all([
    db.collection<WorkforceRoster>("workforce_rosters").findOne({ projectId: oid, period: p }),
    db.collection<ComplianceDocument>("compliance_documents").find({ projectId: oid }).toArray(),
    db.collection<WorkIncident>("work_incidents").find({ projectId: oid }).sort({ occurredAt: -1 }).limit(200).toArray(),
    db.collection<SiteComplaint>("site_complaints").find({ projectId: oid }).sort({ date: -1 }).limit(200).toArray(),
    db.collection<LocalPurchase>("local_purchases").find({ projectId: oid }).sort({ date: -1 }).limit(500).toArray(),
  ])

  const openIncidents = incidents.filter((i) => i.status === "abierto").length
  const openComplaints = complaints.filter((c) => ["abierta", "en_gestion"].includes(c.status)).length

  const checklist = buildComplianceChecklist({
    project,
    roster,
    documents,
    openIncidents,
    openComplaints,
  })

  const score = complianceScore(checklist)
  const rosterCsv = exportRosterCsv(roster?.entries ?? [], p)
  const stats = roster ? computeRosterStats(roster.entries) : null

  return {
    generatedAt: new Date().toISOString(),
    emprenor: "EMPRENOR CONSTRUCCIONES",
    period: p,
    project: {
      id: projectId,
      code: project.code,
      name: project.name,
      status: project.status,
      progress: project.progress,
      location: project.location,
      clientType: project.institutionalCompliance?.clientType,
      clientOrganization: project.institutionalCompliance?.clientOrganization,
    },
    score,
    checklist,
    roster: {
      status: roster?.status,
      entriesCount: roster?.entries?.filter((e) => e.active).length ?? 0,
      stats,
      csv: rosterCsv,
    },
    documents: documents.map((d) => ({
      category: d.category,
      title: d.title,
      validUntil: d.validUntil,
      uploadedAt: d.createdAt,
    })),
    incidents: incidents.map((i) => ({
      date: i.occurredAt,
      worker: i.workerName,
      cuil: i.cuilOrDni,
      status: i.status,
      description: i.description,
    })),
    complaints: complaints.map((c) => ({
      date: c.date,
      status: c.status,
      source: c.source,
      description: c.description,
    })),
    localPurchases: purchases.map((pu) => ({
      provider: pu.provider,
      amount: pu.amount,
      date: pu.date,
      detail: pu.detail,
    })),
    summary: {
      openIncidents,
      openComplaints,
      documentsCount: documents.length,
      purchasesTotal: purchases.reduce((s, pu) => s + (pu.amount || 0), 0),
    },
  }
}
