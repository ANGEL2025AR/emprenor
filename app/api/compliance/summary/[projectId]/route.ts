import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getDb } from "@/lib/db/connection"
import { verifyAuth } from "@/lib/auth/session"
import { findProjectForUser } from "@/lib/auth/project-access"
import {
  currentPeriod,
} from "@/lib/compliance/period"
import {
  assertProjectComplianceAccess,
  canManageCompliance,
} from "@/lib/compliance/access"
import {
  buildComplianceChecklist,
  complianceScore,
  computeRosterStats,
} from "@/lib/compliance/roster"
import type {
  ComplianceDocument,
  Project,
  SiteComplaint,
  WorkforceRoster,
  WorkIncident,
} from "@/lib/db/models"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  try {
    const user = await verifyAuth(request)
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const { projectId } = await params
    const access = await assertProjectComplianceAccess(user, projectId)
    if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status })

    const period = request.nextUrl.searchParams.get("period") || currentPeriod()
    const db = await getDb()

    const project = await findProjectForUser(access.user, projectId)
    if (!project) return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 })

    const [roster, documents, openIncidents, openComplaints, purchasesTotal] = await Promise.all([
      db.collection<WorkforceRoster>("workforce_rosters").findOne({
        projectId: new ObjectId(projectId),
        period,
      }),
      db.collection<ComplianceDocument>("compliance_documents")
        .find({ projectId: new ObjectId(projectId) })
        .sort({ createdAt: -1 })
        .toArray(),
      db.collection<WorkIncident>("work_incidents").countDocuments({
        projectId: new ObjectId(projectId),
        status: "abierto",
      }),
      db.collection<SiteComplaint>("site_complaints").countDocuments({
        projectId: new ObjectId(projectId),
        status: { $in: ["abierta", "en_gestion"] },
      }),
      db.collection("local_purchases").aggregate<{ total: number }>([
        { $match: { projectId: new ObjectId(projectId) } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]).toArray(),
    ])

    const checklist = buildComplianceChecklist({
      project,
      roster,
      documents,
      openIncidents,
      openComplaints,
    })

    const stats = roster ? computeRosterStats(roster.entries) : null

    return NextResponse.json({
      project: {
        _id: project._id?.toString(),
        name: project.name,
        code: project.code,
        progress: project.progress,
        status: project.status,
        location: project.location,
        institutionalCompliance: project.institutionalCompliance ?? { enabled: false },
      },
      period,
      canManage: canManageCompliance(user.role),
      score: complianceScore(checklist),
      checklist,
      roster: roster
        ? {
            ...roster,
            _id: roster._id?.toString(),
            projectId: roster.projectId.toString(),
            stats,
          }
        : null,
      documentsCount: documents.length,
      openIncidents,
      openComplaints,
      localPurchasesTotal: purchasesTotal[0]?.total ?? 0,
    })
  } catch (error) {
    console.error("[compliance/summary]", error)
    return NextResponse.json({ error: "Error al cargar cumplimiento" }, { status: 500 })
  }
}
