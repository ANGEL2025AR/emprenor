import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth/session"
import { getAuditLogs, type AuditAction, type AuditEntityType } from "@/lib/audit/audit-log"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || !["super_admin", "admin"].includes(user.role)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)

    const filters = {
      userId: searchParams.get("userId") || undefined,
      action: (searchParams.get("action") as AuditAction) || undefined,
      entityType: (searchParams.get("entityType") as AuditEntityType) || undefined,
      entityId: searchParams.get("entityId") || undefined,
      startDate: searchParams.get("startDate") ? new Date(searchParams.get("startDate")!) : undefined,
      endDate: searchParams.get("endDate") ? new Date(searchParams.get("endDate")!) : undefined,
      severity: searchParams.get("severity") as "low" | "medium" | "high" | "critical" | undefined,
      limit: searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : 50,
      skip: searchParams.get("skip") ? Number.parseInt(searchParams.get("skip")!) : 0,
    }

    const { logs, total } = await getAuditLogs(filters)

    return NextResponse.json({ logs, total, filters })
  } catch {
    return NextResponse.json({ error: "Error al obtener logs de auditoría" }, { status: 500 })
  }
}
