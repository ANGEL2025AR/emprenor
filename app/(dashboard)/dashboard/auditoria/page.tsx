import type { Metadata } from "next"
import { requirePermission } from "@/lib/auth/require-permission"
import { AuditLogsClient } from "./audit-logs-client"

export const metadata: Metadata = {
  title: "Auditoría del Sistema",
  description: "Registro de actividades y cambios del sistema",
}

export default async function AuditLogsPage() {
  await requirePermission("admin.logs")
  return <AuditLogsClient />
}
