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

export function DashboardCharts() {
  // Datos de ejemplo - en producción vendrían de la API
  const monthlyRevenue = [
    { month: "Ene", ingresos: 450000, egresos: 320000, balance: 130000 },
    { month: "Feb", ingresos: 520000, egresos: 380000, balance: 140000 },
    { month: "Mar", ingresos: 680000, egresos: 450000, balance: 230000 },
    { month: "Abr", ingresos: 720000, egresos: 490000, balance: 230000 },
    { month: "May", ingresos: 890000, egresos: 560000, balance: 330000 },
    { month: "Jun", ingresos: 950000, egresos: 610000, balance: 340000 },
  ]

  const projectDistribution = [
    { name: "En Progreso", value: 45, color: "#3b82f6" },
    { name: "Completados", value: 30, color: "#10b981" },
    { name: "Pausados", value: 15, color: "#f59e0b" },
    { name: "Cancelados", value: 10, color: "#ef4444" },
  ]

  const taskCompletion = [
    { week: "Sem 1", completadas: 45, pendientes: 23 },
    { week: "Sem 2", completadas: 52, pendientes: 18 },
    { week: "Sem 3", completadas: 61, pendientes: 15 },
    { week: "Sem 4", completadas: 58, pendientes: 20 },
  ]

  const budgetUsage = [
    { project: "Proyecto A", presupuesto: 1000000, gastado: 850000 },
    { project: "Proyecto B", presupuesto: 750000, gastado: 690000 },
    { project: "Proyecto C", presupuesto: 1200000, gastado: 980000 },
    { project: "Proyecto D", presupuesto: 900000, gastado: 780000 },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Ingresos vs Egresos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Flujo de Caja Mensual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyRevenue}>
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

      {/* Distribución de Proyectos */}
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
                data={projectDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {projectDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tareas Completadas vs Pendientes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Rendimiento de Tareas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={taskCompletion}>
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

      {/* Uso de Presupuesto por Proyecto */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Ejecución Presupuestaria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={budgetUsage} layout="vertical">
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
    </div>
  )
}
