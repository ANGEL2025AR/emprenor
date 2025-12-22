"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, DollarSign, Activity, Users } from "lucide-react"
import { useEffect, useState } from "react"

interface ChartData {
  monthlyRevenue: Array<{ month: string; ingresos: number; egresos: number; balance: number }>
  projectDistribution: Array<{ name: string; value: number; color: string }>
  taskCompletion: Array<{ week: string; completadas: number; pendientes: number }>
  budgetUsage: Array<{ project: string; presupuesto: number; gastado: number }>
}

export function DashboardCharts() {
  const [data, setData] = useState<ChartData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [transactionsRes, projectsRes, tasksRes] = await Promise.all([
          fetch("/api/transactions"),
          fetch("/api/projects"),
          fetch("/api/tasks"),
        ])

        const transactions = await transactionsRes.json()
        const projects = await projectsRes.json()
        const tasks = await tasksRes.json()

        // Procesar datos de ingresos/egresos mensuales
        const sixMonthsAgo = new Date()
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

        const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
        const monthlyMap = new Map<string, { ingresos: number; egresos: number }>()

        transactions
          .filter((t: any) => t.status === "pagado" && new Date(t.date) >= sixMonthsAgo)
          .forEach((t: any) => {
            const date = new Date(t.date)
            const monthKey = monthNames[date.getMonth()]
            const current = monthlyMap.get(monthKey) || { ingresos: 0, egresos: 0 }

            if (t.type === "ingreso") {
              current.ingresos += t.amount || 0
            } else if (t.type === "egreso") {
              current.egresos += t.amount || 0
            }

            monthlyMap.set(monthKey, current)
          })

        const monthlyRevenue = Array.from(monthlyMap.entries())
          .slice(-6)
          .map(([month, values]) => ({
            month,
            ingresos: values.ingresos,
            egresos: values.egresos,
            balance: values.ingresos - values.egresos,
          }))

        // Distribución de proyectos
        const statusCount = {
          en_progreso: 0,
          completado: 0,
          pausado: 0,
          cancelado: 0,
        }

        projects.forEach((p: any) => {
          const status = p.status || "en_progreso"
          if (status in statusCount) {
            statusCount[status as keyof typeof statusCount]++
          }
        })

        const projectDistribution = [
          { name: "En Progreso", value: statusCount.en_progreso, color: "#3b82f6" },
          { name: "Completados", value: statusCount.completado, color: "#10b981" },
          { name: "Pausados", value: statusCount.pausado, color: "#f59e0b" },
          { name: "Cancelados", value: statusCount.cancelado, color: "#ef4444" },
        ].filter((item) => item.value > 0)

        // Tareas de las últimas 4 semanas
        const fourWeeksAgo = new Date()
        fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28)

        const weeklyTasks = new Map<number, { completadas: number; pendientes: number }>()
        tasks
          .filter((t: any) => new Date(t.createdAt) >= fourWeeksAgo)
          .forEach((t: any) => {
            const weekNum = Math.floor((Date.now() - new Date(t.createdAt).getTime()) / (7 * 24 * 60 * 60 * 1000))
            const current = weeklyTasks.get(weekNum) || { completadas: 0, pendientes: 0 }

            if (t.status === "completada") {
              current.completadas++
            } else {
              current.pendientes++
            }

            weeklyTasks.set(weekNum, current)
          })

        const taskCompletion = Array.from(weeklyTasks.entries())
          .slice(0, 4)
          .map(([week, data]) => ({
            week: `Sem ${4 - week}`,
            completadas: data.completadas,
            pendientes: data.pendientes,
          }))
          .reverse()

        // Uso de presupuesto por proyecto (top 4)
        const budgetUsage = projects
          .filter((p: any) => p.budget?.approved && p.budget?.spent)
          .slice(0, 4)
          .map((p: any) => ({
            project: p.name || "Sin nombre",
            presupuesto: p.budget.approved,
            gastado: p.budget.spent,
          }))

        setData({
          monthlyRevenue: monthlyRevenue.length > 0 ? monthlyRevenue : [],
          projectDistribution,
          taskCompletion: taskCompletion.length > 0 ? taskCompletion : [],
          budgetUsage: budgetUsage.length > 0 ? budgetUsage : [],
        })
      } catch (error) {
        console.error("[v0] Error loading dashboard charts:", error)
        setData({
          monthlyRevenue: [],
          projectDistribution: [],
          taskCompletion: [],
          budgetUsage: [],
        })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-[300px] bg-slate-100 rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!data || (data.monthlyRevenue.length === 0 && data.projectDistribution.length === 0)) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Activity className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">No hay suficientes datos para mostrar gráficos</p>
          <p className="text-sm text-slate-400 mt-1">Registra proyectos y transacciones para ver análisis</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Ingresos vs Egresos */}
      {data.monthlyRevenue.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Flujo de Caja Mensual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                <Legend />
                <Line type="monotone" dataKey="ingresos" stroke="#10b981" strokeWidth={2} name="Ingresos" />
                <Line type="monotone" dataKey="egresos" stroke="#ef4444" strokeWidth={2} name="Egresos" />
                <Line type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={2} name="Balance" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Distribución de Proyectos */}
      {data.projectDistribution.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Distribución de Proyectos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.projectDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) =>
                    `${name}: ${value} (${percent ? (percent * 100).toFixed(0) : 0}%)`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.projectDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Tareas Completadas vs Pendientes */}
      {data.taskCompletion.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Rendimiento de Tareas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.taskCompletion}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completadas" fill="#10b981" name="Completadas" />
                <Bar dataKey="pendientes" fill="#f59e0b" name="Pendientes" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Uso de Presupuesto por Proyecto */}
      {data.budgetUsage.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Ejecución Presupuestaria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.budgetUsage} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="project" type="category" width={100} />
                <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                <Legend />
                <Bar dataKey="presupuesto" fill="#94a3b8" name="Presupuesto" />
                <Bar dataKey="gastado" fill="#3b82f6" name="Gastado" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
