import { getDb } from "@/lib/db/connection"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Activity, Clock, TrendingUp, Target } from "lucide-react"

export const metadata = {
  title: "Análisis de Performance",
  description: "Análisis de eficiencia operativa",
}

export default async function PerformancePage() {
  const db = await getDb()

  const [projects, tasks, inspections] = await Promise.all([
    db.collection("projects").find().toArray(),
    db.collection("tasks").find().toArray(),
    db.collection("inspections").find().toArray(),
  ])

  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t) => t.status === "completada").length
  const taskCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  const totalProjects = projects.length
  const completedProjects = projects.filter((p) => p.status === "completado").length
  const projectCompletionRate = totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0

  const onTimeProjects = projects.filter((p) => {
    if (p.status === "completado" && p.dates?.actualEnd && p.dates?.estimatedEnd) {
      return new Date(p.dates.actualEnd) <= new Date(p.dates.estimatedEnd)
    }
    return false
  }).length
  const onTimeRate = completedProjects > 0 ? (onTimeProjects / completedProjects) * 100 : 0

  const avgBudgetUtilization =
    projects.reduce((sum, p) => {
      const utilization = ((p.budget?.spent || 0) / (p.budget?.approved || 1)) * 100
      return sum + utilization
    }, 0) / (projects.length || 1)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Análisis de Performance</h1>
        <p className="text-slate-600">Eficiencia operativa y cumplimiento de objetivos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Tasa de Finalización</p>
                <p className="text-2xl font-bold">{taskCompletionRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Proyectos Completados</p>
                <p className="text-2xl font-bold">{projectCompletionRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Entrega a Tiempo</p>
                <p className="text-2xl font-bold">{onTimeRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Uso de Presupuesto</p>
                <p className="text-2xl font-bold">{avgBudgetUtilization.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Métricas Detalladas de Rendimiento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Eficiencia en Tareas</span>
              <span className="text-sm font-bold">{taskCompletionRate.toFixed(1)}%</span>
            </div>
            <Progress value={taskCompletionRate} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Cumplimiento de Plazos</span>
              <span className="text-sm font-bold">{onTimeRate.toFixed(1)}%</span>
            </div>
            <Progress value={onTimeRate} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Control Presupuestario</span>
              <span className="text-sm font-bold">
                {(100 - (avgBudgetUtilization > 100 ? avgBudgetUtilization - 100 : 0)).toFixed(1)}%
              </span>
            </div>
            <Progress value={100 - (avgBudgetUtilization > 100 ? avgBudgetUtilization - 100 : 0)} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Tasa de Finalización de Proyectos</span>
              <span className="text-sm font-bold">{projectCompletionRate.toFixed(1)}%</span>
            </div>
            <Progress value={projectCompletionRate} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
