import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/session"
import { getDb } from "@/lib/db/connection"
import { CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DashboardPageHeader,
  DashboardStatCard,
  DashboardPanel,
  DashboardSectionTitle,
  DashboardPrimaryButton,
  DashboardOutlineButton,
} from "@/components/dashboard/dashboard-ui"
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
import { ClientDashboard } from "@/components/dashboard/client-dashboard"
import { isClientRole, isEmployeePortalRole } from "@/lib/auth/project-access"

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

  if (user && isClientRole(user.role)) {
    return <ClientDashboard user={user} />
  }

  if (user && isEmployeePortalRole(user.role)) {
    redirect("/dashboard/portal")
  }

  const stats = await getDashboardStats()

  const userName = user?.name || "Usuario"

  const executiveKPIs = [
    {
      title: "Balance Financiero",
      value: `$${(stats.balance / 1000000).toFixed(2)}M`,
      subtitle: stats.ingresos > 0 ? `${stats.balance >= 0 ? "+" : ""}${((stats.balance / stats.ingresos) * 100).toFixed(1)}% margen` : "Sin movimientos registrados",
      icon: DollarSign,
      accent: stats.balance >= 0 ? ("emerald" as const) : ("rose" as const),
      trend: stats.balance >= 0 ? "up" : "down",
      href: "/dashboard/finanzas",
    },
    {
      title: "Proyectos Activos",
      value: stats.activeProjects,
      subtitle: `${stats.totalProjects} totales · ${stats.completedProjects} completados`,
      icon: FolderKanban,
      accent: "blue" as const,
      trend: stats.activeProjects > stats.completedProjects ? "up" : "stable",
      href: "/dashboard/proyectos",
    },
    {
      title: "Eficiencia Operativa",
      value: `${stats.completionRate.toFixed(1)}%`,
      subtitle: `${stats.completedTasks} de ${stats.totalTasks} tareas completadas`,
      icon: Activity,
      accent: stats.completionRate >= 80 ? ("violet" as const) : stats.completionRate >= 60 ? ("amber" as const) : ("rose" as const),
      trend: stats.completionRate >= 80 ? "up" : "down",
      href: "/dashboard/tareas",
    },
    {
      title: "Cumplimiento de Plazos",
      value: `${stats.onTimeRate.toFixed(1)}%`,
      subtitle: `${stats.onTimeProjects} proyectos entregados a tiempo`,
      icon: Clock,
      accent: stats.onTimeRate >= 80 ? ("cyan" as const) : stats.onTimeRate >= 60 ? ("amber" as const) : ("rose" as const),
      trend: stats.onTimeRate >= 80 ? "up" : "down",
      href: "/dashboard/proyectos",
    },
    {
      title: "Utilización Presupuesto",
      value: `${stats.budgetUtilization.toFixed(1)}%`,
      subtitle: "Promedio de ejecución presupuestaria",
      icon: TrendingUp,
      accent:
        stats.budgetUtilization <= 100 ? ("emerald" as const) : stats.budgetUtilization <= 110 ? ("amber" as const) : ("rose" as const),
      trend: stats.budgetUtilization <= 100 ? "up" : "down",
      href: "/dashboard/finanzas",
    },
    {
      title: "Inspecciones Pendientes",
      value: stats.pendingInspections,
      subtitle: `${stats.totalInspections} totales realizadas`,
      icon: ClipboardCheck,
      accent:
        stats.pendingInspections <= 5 ? ("emerald" as const) : stats.pendingInspections <= 10 ? ("amber" as const) : ("rose" as const),
      trend: stats.pendingInspections <= 5 ? "up" : "down",
      href: "/dashboard/inspecciones",
    },
  ]

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        badge="Command Center"
        title="Panel de Control Ejecutivo"
        description={`Bienvenido, ${userName}. Vista consolidada en tiempo real de operaciones, finanzas y cumplimiento.`}
        actions={
          <>
            <DashboardOutlineButton asChild>
              <Link href="/dashboard/reportes">
                <FileText className="w-4 h-4 mr-2" />
                Reportes
              </Link>
            </DashboardOutlineButton>
            <DashboardPrimaryButton asChild>
              <Link href="/dashboard/proyectos/nuevo">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Proyecto
              </Link>
            </DashboardPrimaryButton>
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {executiveKPIs.map((kpi) => (
          <DashboardStatCard
            key={kpi.title}
            title={kpi.title}
            value={kpi.value}
            subtitle={kpi.subtitle}
            icon={kpi.icon}
            href={kpi.href}
            trend={kpi.trend as "up" | "down" | "stable"}
            accent={kpi.accent}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <ProjectStatusOverview />
      </div>

      <DashboardCharts />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardPanel>
          <CardHeader>
            <DashboardSectionTitle title="Alertas Críticas" icon={AlertTriangle} />
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
        </DashboardPanel>

        <DashboardPanel>
          <CardHeader>
            <DashboardSectionTitle title="Acciones Ejecutivas" icon={TrendingUp} />
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
        </DashboardPanel>
      </div>

      <ExecutiveMetrics stats={stats} />
    </div>
  )
}
