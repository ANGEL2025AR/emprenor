import Link from "next/link"
import { getDb } from "@/lib/db/connection"
import { getClientProjectsFilter } from "@/lib/auth/project-access"
import type { SerializableUser } from "@/lib/auth/session"
import type { Project } from "@/lib/db/models"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FolderKanban, FileText, Award, Bell, ArrowRight } from "lucide-react"

const STATUS_LABELS: Record<string, string> = {
  borrador: "Borrador",
  aprobado: "Aprobado",
  en_progreso: "En progreso",
  pausado: "Pausado",
  completado: "Completado",
  cancelado: "Cancelado",
}

interface ClientDashboardProps {
  user: SerializableUser
}

export async function ClientDashboard({ user }: ClientDashboardProps) {
  const db = await getDb()
  const filter = await getClientProjectsFilter(user)
  const projects = await db.collection<Project>("projects").find(filter).sort({ updatedAt: -1 }).limit(12).toArray()

  const projectIds = projects.map((p) => p._id!).filter(Boolean)
  const [documentsCount, certificatesCount] = await Promise.all([
    projectIds.length
      ? db.collection("documents").countDocuments({ projectId: { $in: projectIds } })
      : 0,
    projectIds.length
      ? db.collection("certificates").countDocuments({ projectId: { $in: projectIds } })
      : 0,
  ])

  const active = projects.filter((p) => p.status === "en_progreso").length
  const avgProgress =
    projects.length > 0 ? projects.reduce((s, p) => s + (p.progress || 0), 0) / projects.length : 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Mis obras</h1>
        <p className="text-slate-600 mt-1">
          Hola {user.name}, aquí ves el avance, documentación y pagos de tus proyectos con EMPRENOR.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <FolderKanban className="w-4 h-4" /> Proyectos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{projects.length}</p>
            <p className="text-xs text-slate-500">{active} en progreso</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Documentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{documentsCount}</p>
            <p className="text-xs text-slate-500">En tus obras</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <Award className="w-4 h-4" /> Certificados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{certificatesCount}</p>
            <p className="text-xs text-slate-500">Certificaciones de obra</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <Bell className="w-4 h-4" /> Avance promedio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{avgProgress.toFixed(0)}%</p>
            <Progress value={avgProgress} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Proyectos asignados</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/documentos">Ver documentación</Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {projects.length === 0 ? (
            <p className="text-slate-500 text-center py-8">
              No hay proyectos vinculados a tu cuenta. Contactá a EMPRENOR si creés que es un error.
            </p>
          ) : (
            projects.map((project) => (
              <div
                key={project._id?.toString()}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border bg-slate-50/50"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-900">{project.name}</span>
                    <Badge variant="secondary">{project.code}</Badge>
                    <Badge>{STATUS_LABELS[project.status] || project.status}</Badge>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2">{project.description}</p>
                  <Progress value={project.progress || 0} className="h-2 max-w-md" />
                  <p className="text-xs text-slate-500">{project.progress || 0}% completado</p>
                </div>
                <Button asChild>
                  <Link href={`/dashboard/proyectos/${project._id?.toString()}`}>
                    Ver obra
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}