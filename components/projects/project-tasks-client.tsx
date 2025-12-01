"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Loader2, Plus, Calendar, User } from "lucide-react"
import Link from "next/link"

interface Task {
  _id: string
  code: string
  title: string
  description: string
  status: string
  priority: string
  progress: number
  startDate: string
  endDate: string
  assignedTo: unknown[]
}

const STATUS_COLORS: Record<string, string> = {
  pendiente: "bg-slate-100 text-slate-700",
  en_progreso: "bg-blue-100 text-blue-700",
  en_revision: "bg-amber-100 text-amber-700",
  completada: "bg-green-100 text-green-700",
  cancelada: "bg-red-100 text-red-700",
}

const PRIORITY_COLORS: Record<string, string> = {
  baja: "bg-slate-100 text-slate-700",
  media: "bg-blue-100 text-blue-700",
  alta: "bg-amber-100 text-amber-700",
  urgente: "bg-red-100 text-red-700",
}

export function ProjectTasksClient({ projectId }: { projectId: string }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`/api/tasks?projectId=${projectId}`)
        if (response.ok) {
          const data = await response.json()
          setTasks(data.tasks || [])
        }
      } catch (error) {
        console.error("Error loading tasks:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [projectId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    )
  }

  const tasksCompleted = tasks.filter((t) => t.status === "completada").length
  const tasksPending = tasks.filter((t) => t.status === "pendiente").length
  const tasksInProgress = tasks.filter((t) => t.status === "en_progreso").length

  return (
    <div className="space-y-6">
      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-600 mb-1">Completadas</p>
            <p className="text-2xl font-bold text-green-600">{tasksCompleted}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-600 mb-1">En Progreso</p>
            <p className="text-2xl font-bold text-blue-600">{tasksInProgress}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-600 mb-1">Pendientes</p>
            <p className="text-2xl font-bold text-amber-600">{tasksPending}</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Tareas */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Tareas del Proyecto</h3>
            <Button size="sm" asChild>
              <Link href={`/dashboard/tareas/nueva?projectId=${projectId}`}>
                <Plus className="w-4 h-4 mr-2" />
                Nueva Tarea
              </Link>
            </Button>
          </div>

          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 mb-4">No hay tareas creadas para este proyecto</p>
              <Button asChild>
                <Link href={`/dashboard/tareas/nueva?projectId=${projectId}`}>Crear Primera Tarea</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <Link
                  key={task._id}
                  href={`/dashboard/tareas/${task._id}`}
                  className="block p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-slate-900">{task.title}</h4>
                        <Badge className={STATUS_COLORS[task.status]}>{task.status}</Badge>
                        <Badge className={PRIORITY_COLORS[task.priority]} variant="outline">
                          {task.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-2">{task.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-slate-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(task.endDate).toLocaleDateString("es-AR")}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {Array.isArray(task.assignedTo) ? task.assignedTo.length : 0} asignados
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Progreso</span>
                      <span className="font-medium">{task.progress}%</span>
                    </div>
                    <Progress value={task.progress} className="h-2" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
