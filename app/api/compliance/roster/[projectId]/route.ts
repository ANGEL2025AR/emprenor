import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getDb } from "@/lib/db/connection"
import { verifyAuth } from "@/lib/auth/session"
import { assertProjectComplianceAccess, canManageCompliance } from "@/lib/compliance/access"
import { currentPeriod } from "@/lib/compliance/period"
import { computeRosterStats } from "@/lib/compliance/roster"
import type { WorkforceRoster, WorkforceRosterEntry } from "@/lib/db/models"

function validateEntry(e: unknown): e is WorkforceRosterEntry {
  if (!e || typeof e !== "object") return false
  const row = e as Record<string, unknown>
  return (
    typeof row.id === "string" &&
    typeof row.lastName === "string" &&
    typeof row.firstName === "string" &&
    typeof row.cuil === "string" &&
    typeof row.roleOnSite === "string" &&
    (row.gender === "M" || row.gender === "F") &&
    typeof row.address === "string" &&
    typeof row.city === "string" &&
    typeof row.province === "string" &&
    typeof row.isLocalWorkforce === "boolean" &&
    typeof row.codeOfConductSigned === "boolean" &&
    typeof row.patrimonyTrainingSigned === "boolean" &&
    typeof row.genderTrainingSigned === "boolean" &&
    typeof row.active === "boolean"
  )
}

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
    const roster = await db.collection<WorkforceRoster>("workforce_rosters").findOne({
      projectId: new ObjectId(projectId),
      period,
    })

    return NextResponse.json({
      period,
      roster: roster
        ? {
            ...roster,
            _id: roster._id?.toString(),
            projectId: roster.projectId.toString(),
            stats: computeRosterStats(roster.entries),
          }
        : { period, entries: [], status: "borrador", stats: computeRosterStats([]) },
      canManage: canManageCompliance(user.role),
    })
  } catch {
    return NextResponse.json({ error: "Error al cargar nómina" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  try {
    const user = await verifyAuth(request)
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const { projectId } = await params
    const access = await assertProjectComplianceAccess(user, projectId, true)
    if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status })

    const body = await request.json()
    const period = typeof body.period === "string" ? body.period : currentPeriod()
    const entries = body.entries as unknown[]
    const submit = body.submit === true

    if (!Array.isArray(entries) || !entries.every(validateEntry)) {
      return NextResponse.json({ error: "Nómina inválida" }, { status: 400 })
    }

    const db = await getDb()
    const now = new Date()
    const update: Partial<WorkforceRoster> = {
      projectId: new ObjectId(projectId),
      period,
      entries,
      status: submit ? "enviado" : "borrador",
      updatedAt: now,
    }
    if (submit) {
      update.submittedAt = now
      update.submittedBy = new ObjectId(user.userId)
    }

    await db.collection<WorkforceRoster>("workforce_rosters").updateOne(
      { projectId: new ObjectId(projectId), period },
      {
        $set: update,
        $setOnInsert: { createdAt: now },
      },
      { upsert: true },
    )

    return NextResponse.json({
      success: true,
      stats: computeRosterStats(entries),
      status: submit ? "enviado" : "borrador",
    })
  } catch {
    return NextResponse.json({ error: "Error al guardar nómina" }, { status: 500 })
  }
}
