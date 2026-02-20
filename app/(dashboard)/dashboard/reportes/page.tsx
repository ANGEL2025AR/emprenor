import { requirePermission } from "@/lib/auth/require-permission"
import ReportsClient from "@/components/reports/reports-client"

export default async function ReportesPage() {
  await requirePermission("reports.view")

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
