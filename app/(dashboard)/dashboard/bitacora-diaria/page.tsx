import { getCurrentUser } from "@/lib/auth/session"
import { redirect } from "next/navigation"
import { getDb } from "@/lib/db/connection"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Calendar, Users, AlertTriangle, FileText } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { DailyLogsClient } from "./daily-logs-client"

async function getDailyLogs() {
  try {
    const db = await getDb()
    const logs = await db.collection("daily_logs").find().sort({ date: -1, createdAt: -1 }).limit(50).toArray()

    return logs.map((log) => ({
      ...log,
      _id: log._id.toString(),
      projectId: log.projectId?.toString() || "",
      preparedBy: log.preparedBy?.toString() || "",
      reviewedBy: log.reviewedBy?.toString(),
      approvedBy: log.approvedBy?.toString(),
      date: log.date instanceof Date ? log.date.toISOString() : log.date,
      createdAt: log.createdAt instanceof Date ? log.createdAt.toISOString() : log.createdAt,
      updatedAt: log.updatedAt instanceof Date ? log.updatedAt.toISOString() : log.updatedAt,
    }))
  } catch {
    return []
  }
}

export const metadata = {
  title: "Bitácora Diaria de Obra - EMPRENOR",
  description: "Registro diario de actividades, clima, personal y eventos en obra",
}

export default async function DailyLogsPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const logs = await getDailyLogs()

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Bitácora Diaria de Obra</h1>
          <p className="text-slate-600 mt-1">Registro detallado de actividades, clima, personal y eventos diarios</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/bitacora-diaria/nueva">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Bitácora
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{logs.length}</p>
                <p className="text-xs text-slate-600">Bitácoras registradas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {logs.reduce((sum, log) => {
                    const workforce = log.workforce as { total?: number } | undefined
                    return sum + (workforce?.total || 0)
                  }, 0)}
                </p>
                <p className="text-xs text-slate-600">Personal total hoy</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {logs.reduce((sum, log) => {
                    const observations = log.safetyObservations as unknown[] | undefined
                    return sum + (Array.isArray(observations) ? observations.length : 0)
                  }, 0)}
                </p>
                <p className="text-xs text-slate-600">Observaciones de seguridad</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {logs.reduce((sum, log) => {
                    const activities = log.activities as unknown[] | undefined
                    return sum + (Array.isArray(activities) ? activities.length : 0)
                  }, 0)}
                </p>
                <p className="text-xs text-slate-600">Actividades registradas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <DailyLogsClient initialLogs={logs} />
    </div>
  )
}
