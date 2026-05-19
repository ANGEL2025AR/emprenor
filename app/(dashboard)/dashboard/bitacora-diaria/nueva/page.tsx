import { Suspense } from "react"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/session"
import { hasPermission } from "@/lib/auth/permissions"
import type { UserRole } from "@/lib/db/models"
import NewDailyLogForm from "@/components/daily-logs/new-daily-log-form"

export const metadata = {
  title: "Nueva Bitácora | EMPRENOR",
  description: "Registrar bitácora diaria de obra",
}

export default async function NuevaBitacoraPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  if (!hasPermission(user.role as UserRole, "daily_logs.create")) {
    redirect("/dashboard/bitacora-diaria")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Nueva Bitácora Diaria</h1>
        <p className="text-slate-600">Registro de actividades, clima y personal en obra</p>
      </div>
      <Suspense fallback={<div>Cargando formulario...</div>}>
        <NewDailyLogForm />
      </Suspense>
    </div>
  )
}
