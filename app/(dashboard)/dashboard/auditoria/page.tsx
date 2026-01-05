import type { Metadata } from "next"
import { getCurrentUser } from "@/lib/auth/session"
import { redirect } from "next/navigation"
import { AuditLogsClient } from "./audit-logs-client"

export const metadata: Metadata = {
  title: "Auditoría del Sistema",
  description: "Registro de actividades y cambios del sistema",
}

export default async function AuditLogsPage() {
  const user = await getCurrentUser()

  if (!user || !["super_admin", "admin"].includes(user.role)) {
    redirect("/dashboard")
  }

  return <AuditLogsClient />
}
