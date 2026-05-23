import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getDb } from "@/lib/db/connection"
import { verifyAuth } from "@/lib/auth/session"
import { assertProjectComplianceAccess } from "@/lib/compliance/access"
import { currentPeriod } from "@/lib/compliance/period"
import { exportRosterCsv } from "@/lib/compliance/roster"
import type { WorkforceRoster } from "@/lib/db/models"

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

    const csv = exportRosterCsv(roster?.entries ?? [], period)
    const filename = `nomina-obra-${period}.csv`

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch {
    return NextResponse.json({ error: "Error al exportar" }, { status: 500 })
  }
}
