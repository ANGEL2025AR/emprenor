import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FolderKanban } from "lucide-react"

export function ProjectStatusOverview() {
  // Datos de ejemplo - en producción vendrían de la API
  const projects = [
    { name: "Torre Empresarial Norte", status: "en_progreso", progress: 75, budget: 85 },
    { name: "Centro Comercial Sur", status: "en_progreso", progress: 45, budget: 42 },
    { name: "Residencial Las Palmas", status: "completado", progress: 100, budget: 98 },
    { name: "Planta Industrial Este", status: "en_progreso", progress: 60, budget: 72 },
    { name: "Remodelación Hospital", status: "pausado", progress: 30, budget: 28 },
  ]

  const getStatusBadge = (status: string) => {
    const badges = {
      en_progreso: { label: "En Progreso", variant: "default" as const },
      completado: { label: "Completado", variant: "secondary" as const },
      pausado: { label: "Pausado", variant: "destructive" as const },
    }
    return badges[status as keyof typeof badges] || { label: status, variant: "default" as const }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderKanban className="w-5 h-5 text-blue-600" />
          Estado de Proyectos Principales
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.map((project) => {
            const badge = getStatusBadge(project.status)
            return (
              <div key={project.name} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-slate-900">{project.name}</p>
                    <Badge variant={badge.variant} className="mt-1">
                      {badge.label}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600">Progreso: {project.progress}%</p>
                    <p className="text-sm text-slate-600">Presupuesto: {project.budget}%</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 transition-all" style={{ width: `${project.progress}%` }} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${project.budget > 100 ? "bg-red-500" : project.budget > 90 ? "bg-amber-500" : "bg-green-500"}`}
                        style={{ width: `${Math.min(project.budget, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
