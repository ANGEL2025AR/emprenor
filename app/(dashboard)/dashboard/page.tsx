import { getCurrentUser } from "@/lib/auth/session"
import { getDb } from "@/lib/db/connection"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  FolderKanban,
  ClipboardCheck,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  AlertTriangle,
  Plus,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Activity,
} from "lucide-react"
import { DashboardCharts } from "@/components/dashboard/dashboard-charts"
import { ExecutiveMetrics } from "@/components/dashboard/executive-metrics"
import { ProjectStatusOverview } from "@/components/dashboard/project-status-overview"
import { RevenueChart } from "@/components/dashboard/revenue-chart"

async function getDashboardStats() {
  try {
    const db = await getDb()

    // Métricas básicas
    const [
      totalProjects,
      activeProjects,
      completedProjects,
      totalTasks,
      pendingTasks,
      completedTasks,
      totalInspections,
      pendingInspections,
    ] = await Promise.all([
      db.collection("projects").countDocuments(),
      db.collection("projects").countDocuments({ status: "en_progreso" }),
      db.collection("projects").countDocuments({ status: "completado" }),
      db.collection("tasks").countDocuments(),
      db.collection("tasks").countDocuments({ status: "pendiente" }),
      db.collection("tasks").countDocuments({ status: "completada" }),
      db.collection("inspections").countDocuments(),
      db.collection("inspections").countDocuments({ result: "pendiente" }),
    ])

    const transactions = await db.collection("transactions").find().toArray()
    const ingresos = transactions
      .filter((t) => t.type === "ingreso" && t.status === "pagado")
      .reduce((sum, t) => sum + (t.amount || 0), 0)
    const egresos = transactions
      .filter((t) => t.type === "egreso" && t.status === "pagado")
      .reduce((sum, t) => sum + (t.amount || 0), 0)

    const projects = await db.collection("projects").find().toArray()
    const budgetUtilization =
      projects.reduce((sum, p) => sum + ((p.budget?.spent || 0) / (p.budget?.approved || 1)) * 100, 0) /
        projects.length || 0

    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
    const onTimeProjects = projects.filter((p) => {
      if (p.status === "completado" && p.dates?.actualEnd && p.dates?.estimatedEnd) {
        return new Date(p.dates.actualEnd) <= new Date(p.dates.estimatedEnd)
      }
      return false
    }).length

    return {
      totalProjects,
      activeProjects,
      completedProjects,
      totalTasks,
      pendingTasks,
      completedTasks,
      totalInspections,
      pendingInspections,
      ingresos,
      egresos,
      balance: ingresos - egresos,
      budgetUtilization,
      completionRate,
      onTimeProjects,
      onTimeRate: totalProjects > 0 ? (onTimeProjects / totalProjects) * 100 : 0,
    }
  } catch {
    return {
      totalProjects: 0,
      activeProjects: 0,
      completedProjects: 0,
      totalTasks: 0,
      pendingTasks: 0,
      completedTasks: 0,
      totalInspections: 0,
      pendingInspections: 0,
      ingresos: 0,
      egresos: 0,
      balance: 0,
      budgetUtilization: 0,
      completionRate: 0,
      onTimeProjects: 0,
      onTimeRate: 0,
    }
  }
}

export default async function DashboardPage() {
  const user = await getCurrentUser()
  const stats = await getDashboardStats()

  const userName = user?.name || "Usuario"

  const executiveKPIs = [
    {
      title: "Balance Financiero",
      value: `$${(stats.balance / 1000000).toFixed(2)}M`,
      subtitle: `${stats.ingresos > stats.egresos ? "+" : ""}${((stats.balance / stats.ingresos) * 100).toFixed(1)}% este mes`,
      icon: DollarSign,
      color: stats.balance >= 0 ? "bg-green-500" : "bg-red-500",
      trend: stats.balance >= 0 ? "up" : "down",
      href: "/dashboard/finanzas",
    },
    {
      title: "Proyectos Activos",
      value: stats.activeProjects,
      subtitle: `${stats.totalProjects} totales · ${stats.completedProjects} completados`,
      icon: FolderKanban,
      color: "bg-blue-500",
      trend: stats.activeProjects > stats.completedProjects ? "up" : "stable",
      href: "/dashboard/proyectos",
    },
    {
      title: "Eficiencia Operativa",
      value: `${stats.completionRate.toFixed(1)}%`,
      subtitle: `${stats.completedTasks} de ${stats.totalTasks} tareas completadas`,
      icon: Activity,
      color: stats.completionRate >= 80 ? "bg-green-500" : stats.completionRate >= 60 ? "bg-amber-500" : "bg-red-500",
      trend: stats.completionRate >= 80 ? "up" : "down",
      href: "/dashboard/tareas",
    },
    {
      title: "Cumplimiento de Plazos",
      value: `${stats.onTimeRate.toFixed(1)}%`,
      subtitle: `${stats.onTimeProjects} proyectos entregados a tiempo`,
      icon: Clock,
      color: stats.onTimeRate >= 80 ? "bg-green-500" : stats.onTimeRate >= 60 ? "bg-amber-500" : "bg-red-500",
      trend: stats.onTimeRate >= 80 ? "up" : "down",
      href: "/dashboard/proyectos",
    },
    {
      title: "Utilización Presupuesto",
      value: `${stats.budgetUtilization.toFixed(1)}%`,
      subtitle: "Promedio de ejecución presupuestaria",
      icon: TrendingUp,
      color:
        stats.budgetUtilization <= 100
          ? "bg-green-500"
          : stats.budgetUtilization <= 110
            ? "bg-amber-500"
            : "bg-red-500",
      trend: stats.budgetUtilization <= 100 ? "up" : "down",
      href: "/dashboard/finanzas",
    },
    {
      title: "Inspecciones Pendientes",
      value: stats.pendingInspections,
      subtitle: `${stats.totalInspections} totales realizadas`,
      icon: ClipboardCheck,
      color:
        stats.pendingInspections <= 5 ? "bg-green-500" : stats.pendingInspections <= 10 ? "bg-amber-500" : "bg-red-500",
      trend: stats.pendingInspections <= 5 ? "up" : "down",
      href: "/dashboard/inspecciones",
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Panel de Control Ejecutivo</h1>
          <p className="text-slate-600 mt-1">Bienvenido, {userName} - Vista consolidada en tiempo real</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/dashboard/reportes">
              <FileText className="w-4 h-4 mr-2" />
              Reportes
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/proyectos/nuevo">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Proyecto
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {executiveKPIs.map((kpi) => (
          <Link key={kpi.title} href={kpi.href}>
            <Card
              className="hover:shadow-lg transition-all cursor-pointer border-l-4"
              style={{ borderLeftColor: kpi.color.replace("bg-", "") }}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-slate-600">{kpi.title}</p>
                      {kpi.trend === "up" && <TrendingUp className="w-4 h-4 text-green-600" />}
                      {kpi.trend === "down" && <TrendingDown className="w-4 h-4 text-red-600" />}
                    </div>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{kpi.value}</p>
                    <p className="text-sm text-slate-500 mt-1">{kpi.subtitle}</p>
                  </div>
                  <div className={`w-12 h-12 ${kpi.color} rounded-xl flex items-center justify-center shrink-0`}>
                    <kpi.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <ProjectStatusOverview />
      </div>

      <DashboardCharts />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Alertas Críticas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.budgetUtilization > 100 && (
                <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                  <XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-red-800">Sobrepresupuesto detectado</p>
                    <p className="text-sm text-red-600">
                      Ejecución presupuestaria al {stats.budgetUtilization.toFixed(1)}% - Requiere revisión inmediata
                    </p>
                  </div>
                </div>
              )}

              {stats.pendingInspections > 10 && (
                <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-amber-800">{stats.pendingInspections} inspecciones pendientes</p>
                    <p className="text-sm text-amber-600">Acumulación crítica - Puede afectar cronogramas</p>
                  </div>
                </div>
              )}

              {stats.pendingTasks > 20 && (
                <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <Clock className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-amber-800">{stats.pendingTasks} tareas pendientes</p>
                    <p className="text-sm text-amber-600">
                      Carga de trabajo elevada - Considerar redistribución de recursos
                    </p>
                  </div>
                </div>
              )}

              {stats.onTimeRate < 80 && stats.totalProjects > 0 && (
                <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                  <TrendingDown className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-red-800">Cumplimiento de plazos bajo</p>
                    <p className="text-sm text-red-600">
                      Solo {stats.onTimeRate.toFixed(1)}% de proyectos entregados a tiempo - Revisar planificación
                    </p>
                  </div>
                </div>
              )}

              {stats.budgetUtilization <= 100 &&
                stats.pendingInspections <= 10 &&
                stats.pendingTasks <= 20 &&
                stats.onTimeRate >= 80 && (
                  <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-green-800">Operaciones en óptimo estado</p>
                      <p className="text-sm text-green-600">Todos los indicadores dentro de parámetros normales</p>
                    </div>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Acciones Ejecutivas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start h-auto py-4 bg-transparent" asChild>
              <Link href="/dashboard/reportes/financiero">
                <div className="flex items-center gap-3 w-full">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">Reporte Financiero Consolidado</p>
                    <p className="text-xs text-slate-500">Balance, flujo de caja y proyecciones</p>
                  </div>
                </div>
              </Link>
            </Button>

            <Button variant="outline" className="w-full justify-start h-auto py-4 bg-transparent" asChild>
              <Link href="/dashboard/proyectos">
                <div className="flex items-center gap-3 w-full">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                    <FolderKanban className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">Vista Consolidada de Proyectos</p>
                    <p className="text-xs text-slate-500">Todos los proyectos en un solo lugar</p>
                  </div>
                </div>
              </Link>
            </Button>

            <Button variant="outline" className="w-full justify-start h-auto py-4 bg-transparent" asChild>
              <Link href="/dashboard/reportes/performance">
                <div className="flex items-center gap-3 w-full">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                    <Activity className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">Análisis de Performance</p>
                    <p className="text-xs text-slate-500">Eficiencia operativa y cumplimiento</p>
                  </div>
                </div>
              </Link>
            </Button>

            <Button variant="outline" className="w-full justify-start h-auto py-4 bg-transparent" asChild>
              <Link href="/dashboard/usuarios">
                <div className="flex items-center gap-3 w-full">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">Gestión de Equipos</p>
                    <p className="text-xs text-slate-500">Personal y asignaciones</p>
                  </div>
                </div>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <ExecutiveMetrics stats={stats} />
    </div>
  )
}
