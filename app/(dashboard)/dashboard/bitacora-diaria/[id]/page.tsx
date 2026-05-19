import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ObjectId } from "mongodb"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { ArrowLeft, Cloud, Users, AlertTriangle } from "lucide-react"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { canAccessProjectId } from "@/lib/auth/project-access"
import { hasPermission } from "@/lib/auth/permissions"
import { safeDate } from "@/lib/utils"
import type { UserRole } from "@/lib/db/models"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function BitacoraDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  if (!hasPermission(user.role as UserRole, "daily_logs.view")) {
    redirect("/dashboard/bitacora-diaria")
  }

  const { id } = await params
  if (!ObjectId.isValid(id)) notFound()

  const db = await getDb()
  const doc = await db.collection("daily_logs").findOne({ _id: new ObjectId(id) })
  if (!doc) notFound()

  const projectId = String(doc.projectId || "")
  if (projectId && !(await canAccessProjectId(user, projectId))) {
    notFound()
  }

  let projectName = projectId
  if (ObjectId.isValid(projectId)) {
    const project = await db.collection("projects").findOne({ _id: new ObjectId(projectId) })
    if (project) projectName = `${project.code || ""} — ${project.name || ""}`.trim()
  }

  const weather = (doc.weather as { condition?: string; temperature?: number }) || {}
  const workforce = (doc.workforce as { total?: number }) || {}
  const activities = (doc.activities as Array<{ description?: string }>) || []
  const safety = (doc.safetyObservations as Array<{ observation?: string }>) || []
  const dateStr = safeDate(doc.date as Date) || ""

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/bitacora-diaria">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant="outline" className="font-mono">
              {String(doc.logNumber || "")}
            </Badge>
            <Badge>Turno {String(doc.shift || "")}</Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Bitácora diaria</h1>
          <p className="text-slate-600 mt-1">Proyecto: {projectName}</p>
          {dateStr && (
            <p className="text-sm text-slate-500 mt-1">
              {format(new Date(dateStr), "dd MMMM yyyy", { locale: es })}
            </p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 flex items-center gap-3">
            <Cloud className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-xs text-slate-600">Clima</p>
              <p className="font-semibold capitalize">{weather.condition || "—"}</p>
              <p className="text-sm text-slate-500">{weather.temperature ?? "—"}°C</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-3">
            <Users className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-xs text-slate-600">Personal</p>
              <p className="font-semibold">{workforce.total ?? 0} trabajadores</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-amber-600" />
            <div>
              <p className="text-xs text-slate-600">Seguridad</p>
              <p className="font-semibold">{safety.length} observaciones</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Actividades</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {activities.length === 0 ? (
            <p className="text-slate-500 text-sm">Sin actividades registradas.</p>
          ) : (
            activities.map((a, i) => (
              <p key={i} className="text-slate-700">
                {a.description}
              </p>
            ))
          )}
        </CardContent>
      </Card>

      {safety.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Observaciones de seguridad</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {safety.map((s, i) => (
              <p key={i} className="text-slate-700">
                {s.observation}
              </p>
            ))}
          </CardContent>
        </Card>
      )}

      {doc.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 whitespace-pre-wrap">{String(doc.notes)}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
