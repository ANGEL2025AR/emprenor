"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Filter, Calendar, Clock, User, Loader2, ListTodo, CheckCircle2, Circle, PlayCircle } from "lucide-react"
import type { Task } from "@/lib/db/models"

const STATUS_COLORS: Record<string, string> = {
  pendiente: "bg-slate-100 text-slate-700",
  en_progreso: "bg-blue-100 text-blue-700",
  en_revision: "bg-amber-100 text-amber-700",
  completada: "bg-green-100 text-green-700",
  cancelada: "bg-red-100 text-red-700",
}

const STATUS_LABELS: Record<string, string> = {
  pendiente: "Pendiente",
  en_progreso: "En Progreso",
  en_revision: "En Revisión",
  completada: "Completada",
  cancelada: "Cancelada",
}

const STATUS_ICONS: Record<string, React.ElementType> = {
  pendiente: Circle,
  en_progreso: PlayCircle,
  en_revision: Clock,
  completada: CheckCircle2,
  cancelada: Circle,
}

const PRIORITY_COLORS: Record<string, string> = {
  baja: "bg-slate-100 text-slate-600",
  media: "bg-blue-100 text-blue-600",
  alta: "bg-orange-100 text-orange-600",
  urgente: "bg-red-100 text-red-600",
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("")

  useEffect(() => {
    fetchTasks()
  }, [statusFilter])

  const fetchTasks = async () => {
    try {
      const params = new URLSearchParams()
      if (statusFilter && statusFilter !== "all") params.append("status", statusFilter)

      const response = await fetch(`/api/tasks?${params}`)
      const data = await response.json()
      setTasks(data.tasks || [])
    } catch {
      // Error silencioso en producción
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tareas</h1>
          <p className="text-slate-600">Gestiona las tareas de tus proyectos</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/tareas/nueva">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Tarea
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pendiente">Pendiente</SelectItem>
              <SelectItem value="en_progreso">En Progreso</SelectItem>
              <SelectItem value="en_revision">En Revisión</SelectItem>
              <SelectItem value="completada">Completada</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Tasks list */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      ) : tasks.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <ListTodo className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No hay tareas</h3>
            <p className="text-slate-600 mb-4">Crea tu primera tarea para comenzar</p>
            <Button asChild>
              <Link href="/dashboard/tareas/nueva">Crear Tarea</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => {
            const StatusIcon = STATUS_ICONS[task.status]
            return (
              <Link key={task._id?.toString()} href={`/dashboard/tareas/${task._id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          task.status === "completada" ? "bg-green-100" : "bg-slate-100"
                        }`}
                      >
                        <StatusIcon
                          className={`w-5 h-5 ${task.status === "completada" ? "text-green-600" : "text-slate-600"}`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={STATUS_COLORS[task.status]}>{STATUS_LABELS[task.status]}</Badge>
                          <Badge variant="outline" className={PRIORITY_COLORS[task.priority]}>
                            {task.priority}
                          </Badge>
                          <span className="text-sm text-slate-500">{task.code}</span>
                        </div>
                        <h3 className="font-semibold text-slate-900">{task.title}</h3>
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(task.endDate).toLocaleDateString("es-AR")}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {task.estimatedHours}h estimadas
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {task.assignedTo.length} asignados
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-900">{task.progress}%</div>
                        <div className="w-24 h-2 bg-slate-100 rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: `${task.progress}%` }} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
