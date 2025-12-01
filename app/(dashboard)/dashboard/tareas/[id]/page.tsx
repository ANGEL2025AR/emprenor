"use client"

import type React from "react"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Loader2,
  ListTodo,
  CheckCircle2,
  Circle,
  PlayCircle,
  AlertTriangle,
} from "lucide-react"
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

const PRIORITY_COLORS: Record<string, string> = {
  baja: "bg-slate-100 text-slate-600",
  media: "bg-blue-100 text-blue-600",
  alta: "bg-orange-100 text-orange-600",
  urgente: "bg-red-100 text-red-600",
}

const STATUS_ICONS: Record<string, React.ElementType> = {
  pendiente: Circle,
  en_progreso: PlayCircle,
  en_revision: Clock,
  completada: CheckCircle2,
  cancelada: AlertTriangle,
}

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await fetch(`/api/tasks/${id}`)
        if (response.ok) {
          const data = await response.json()
          setTask(data.task)
        } else {
          router.push("/dashboard/tareas")
        }
      } catch {
        router.push("/dashboard/tareas")
      } finally {
        setLoading(false)
      }
    }

    fetchTask()
  }, [id, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    )
  }

  if (!task) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Tarea no encontrada</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/tareas">Volver a tareas</Link>
        </Button>
      </div>
    )
  }

  const StatusIcon = STATUS_ICONS[task.status] || Circle

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/tareas">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-slate-900">{task.title}</h1>
            <Badge className={STATUS_COLORS[task.status]}>{STATUS_LABELS[task.status]}</Badge>
            <Badge variant="outline" className={PRIORITY_COLORS[task.priority]}>
              Prioridad {task.priority}
            </Badge>
          </div>
          <p className="text-slate-600">Código: {task.code}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <StatusIcon className="w-5 h-5" />
                Detalles de la Tarea
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-slate-900 mb-2">Descripción</h4>
                <p className="text-slate-600">{task.description || "Sin descripción"}</p>
              </div>

              {task.notes && (
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Notas</h4>
                  <p className="text-slate-600">{task.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Checklist */}
          {task.checklist && task.checklist.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ListTodo className="w-5 h-5" />
                  Checklist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {task.checklist.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      {item.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300" />
                      )}
                      <span className={item.completed ? "line-through text-slate-400" : "text-slate-900"}>
                        {item.item}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Progreso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <span className="text-4xl font-bold text-slate-900">{task.progress}%</span>
              </div>
              <Progress value={task.progress} className="h-3" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Información</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500">Fecha inicio</p>
                  <p className="font-medium">{new Date(task.startDate).toLocaleDateString("es-AR")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500">Fecha fin</p>
                  <p className="font-medium">{new Date(task.endDate).toLocaleDateString("es-AR")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500">Horas estimadas</p>
                  <p className="font-medium">{task.estimatedHours}h</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500">Asignados</p>
                  <p className="font-medium">{task.assignedTo?.length || 0} personas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
