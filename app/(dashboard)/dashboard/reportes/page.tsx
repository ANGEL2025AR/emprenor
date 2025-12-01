import { getCurrentUser } from "@/lib/auth/session"
import { redirect } from "next/navigation"
import ReportsClient from "@/components/reports/reports-client"

export default async function ReportesPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Reportes y Análisis</h1>
        <p className="text-slate-600">Genera reportes detallados de proyectos, finanzas y operaciones</p>
      </div>

      <ReportsClient />
    </div>
  )
}
