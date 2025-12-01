import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface ExecutiveMetricsProps {
  stats: {
    totalProjects: number
    activeProjects: number
    completedProjects: number
    budgetUtilization: number
    completionRate: number
    onTimeRate: number
  }
}

export function ExecutiveMetrics({ stats }: ExecutiveMetricsProps) {
  const metrics = [
    {
      label: "Tasa de Finalización de Proyectos",
      value: stats.totalProjects > 0 ? (stats.completedProjects / stats.totalProjects) * 100 : 0,
      target: 80,
      status:
        stats.totalProjects > 0 && (stats.completedProjects / stats.totalProjects) * 100 >= 80
          ? "Excelente"
          : stats.totalProjects > 0 && (stats.completedProjects / stats.totalProjects) * 100 >= 60
            ? "Bueno"
            : "Requiere Atención",
    },
    {
      label: "Eficiencia en Cumplimiento de Tareas",
      value: stats.completionRate,
      target: 85,
      status: stats.completionRate >= 85 ? "Excelente" : stats.completionRate >= 70 ? "Bueno" : "Requiere Atención",
    },
    {
      label: "Cumplimiento de Plazos",
      value: stats.onTimeRate,
      target: 90,
      status: stats.onTimeRate >= 90 ? "Excelente" : stats.onTimeRate >= 75 ? "Bueno" : "Requiere Atención",
    },
    {
      label: "Control Presupuestario",
      value: 100 - (stats.budgetUtilization > 100 ? stats.budgetUtilization - 100 : 0),
      target: 95,
      status:
        stats.budgetUtilization <= 100 ? "Excelente" : stats.budgetUtilization <= 110 ? "Bueno" : "Requiere Atención",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Métricas Ejecutivas de Performance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {metrics.map((metric) => (
          <div key={metric.label} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">{metric.label}</span>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    metric.status === "Excelente" ? "default" : metric.status === "Bueno" ? "secondary" : "destructive"
                  }
                >
                  {metric.status}
                </Badge>
                <span className="text-sm font-bold text-slate-900">{metric.value.toFixed(1)}%</span>
              </div>
            </div>
            <Progress value={metric.value} className="h-2" />
            <div className="flex justify-between text-xs text-slate-500">
              <span>0%</span>
              <span>Objetivo: {metric.target}%</span>
              <span>100%</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
