import { ObjectId } from "mongodb"
import { getDb } from "@/lib/db/connection"
import { currentPeriod } from "@/lib/compliance/period"
import {
  buildComplianceChecklist,
  complianceScore,
} from "@/lib/compliance/roster"
import type {
  ComplianceDocument,
  Project,
  WorkforceRoster,
} from "@/lib/db/models"

export type ComplianceProjectOverview = {
  projectId: string
  code: string
  name: string
  status: string
  clientType?: string
  enabled: boolean
  score: number | null
  openIncidents: number
  openComplaints: number
}

export async function getComplianceOverviewForProjects(
  projects: Pick<Project, "_id" | "code" | "name" | "status" | "institutionalCompliance">[],
): Promise<ComplianceProjectOverview[]> {
  const period = currentPeriod()
  const db = await getDb()
  const enabled = projects.filter((p) => p.institutionalCompliance?.enabled && p._id)

  const results = await Promise.all(
    enabled.map(async (project) => {
      const projectId = project._id!.toString()
      const oid = new ObjectId(projectId)

      const [roster, documents, openIncidents, openComplaints] = await Promise.all([
        db.collection<WorkforceRoster>("workforce_rosters").findOne({ projectId: oid, period }),
        db.collection<ComplianceDocument>("compliance_documents").find({ projectId: oid }).toArray(),
        db.collection("work_incidents").countDocuments({ projectId: oid, status: "abierto" }),
        db.collection("site_complaints").countDocuments({
          projectId: oid,
          status: { $in: ["abierta", "en_gestion"] },
        }),
      ])

      const fullProject = project as Project
      const checklist = buildComplianceChecklist({
        project: fullProject,
        roster,
        documents,
        openIncidents,
        openComplaints,
      })

      return {
        projectId,
        code: project.code,
        name: project.name,
        status: project.status,
        clientType: project.institutionalCompliance?.clientType,
        enabled: true,
        score: complianceScore(checklist),
        openIncidents,
        openComplaints,
      }
    }),
  )

  return results.sort((a, b) => (a.score ?? 0) - (b.score ?? 0))
}
