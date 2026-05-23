import { type NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth/session"
import { assertProjectComplianceAccess } from "@/lib/compliance/access"
import { buildComplianceAuditPack } from "@/lib/compliance/audit-pack"
import { currentPeriod } from "@/lib/compliance/period"

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
    const pack = await buildComplianceAuditPack(projectId, period)
    if (!pack) return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 })

    const filename = `emprenor-auditoria-${pack.project.code || projectId}-${period}.json`

    return new NextResponse(JSON.stringify(pack, null, 2), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch {
    return NextResponse.json({ error: "Error al generar pack de auditoría" }, { status: 500 })
  }
}
