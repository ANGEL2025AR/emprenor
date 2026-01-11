"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Edit, MapPin, Calendar, Users, DollarSign, ListTodo, Loader2, Phone, Mail } from "lucide-react"
import type { Project } from "@/lib/db/models"
import { ProjectDocumentsClient } from "@/components/projects/project-documents-client"
import { ProjectFinancesClient } from "@/components/projects/project-finances-client"
import { ProjectTasksClient } from "@/components/projects/project-tasks-client"

const STATUS_COLORS: Record<string, string> = {
  borrador: "bg-slate-100 text-slate-700",
  aprobado: "bg-blue-100 text-blue-700",
  en_progreso: "bg-green-100 text-green-700",
  pausado: "bg-amber-100 text-amber-700",
  completado: "bg-emerald-100 text-emerald-700",
  cancelado: "bg-red-100 text-red-700",
}

const STATUS_LABELS: Record<string, string> = {
  borrador: "Borrador",
  aprobado: "Aprobado",
  en_progreso: "En Progreso",
  pausado: "Pausado",
  completado: "Completado",
  cancelado: "Cancelado",
}

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${id}`)
        if (response.ok) {
          const data = await response.json()
          setProject(data.project)
        } else {
          router.push("/dashboard/proyectos")
        }
      } catch {
        router.push("/dashboard/proyectos")
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [id, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    )
  }

  if (!project) {
    return null
  }

  const formatDate = (date: string | Date | undefined): string => {
    if (!date) return "No definida"
    try {
      return new Date(date).toLocaleDateString("es-AR")
    } catch {
      return "No definida"
    }
  }

  const daysRemaining = project.dates?.estimatedEnd
    ? Math.ceil((new Date(project.dates?.estimatedEnd).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0

  const budgetTotal = project.budget?.estimated || project.budget?.approved || 0
  const budgetSpent = project.budget?.spent || 0
  const budgetDisplay = budgetTotal > 0 ? `$${(budgetTotal / 1000000).toFixed(1)}M` : "Sin definir"

  const teamSize = project.team?.workers?.length || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/proyectos">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <Badge className={STATUS_COLORS[project.status]}>{STATUS_LABELS[project.status]}</Badge>
              <span className="text-sm text-slate-500">{project.code}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">{project.name}</h1>
          </div>
        </div>
        <Button asChild>
          <Link href={`/dashboard/proyectos/${id}/editar`}>
            <Edit className="w-4 h-4 mr-2" />
            Editar Proyecto
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <ListTodo className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{project.progress || 0}%</p>
                <p className="text-sm text-slate-600">Progreso</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{budgetDisplay}</p>
                <p className="text-sm text-slate-600">Presupuesto</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{teamSize > 0 ? teamSize : "N/A"}</p>
                <p className="text-sm text-slate-600">Equipo</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{daysRemaining > 0 ? daysRemaining : "N/A"}</p>
                <p className="text-sm text-slate-600">Días restantes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progreso General</span>
            <span className="text-sm font-bold text-green-600">{project.progress || 0}%</span>
          </div>
          <Progress value={project.progress || 0} className="h-3" />
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">Información</TabsTrigger>
          <TabsTrigger value="tasks">Tareas</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="finances">Finanzas</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Descripción */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Descripción</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">{project.description || "Sin descripción"}</p>
              </CardContent>
            </Card>

            {/* Cliente */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="font-semibold">{project.client?.name || "Cliente no especificado"}</p>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Phone className="w-4 h-4" />
                  {project.client?.phone || "No disponible"}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Mail className="w-4 h-4" />
                  {project.client?.email || "No disponible"}
                </div>
              </CardContent>
            </Card>

            {/* Ubicación */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Ubicación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-900">{project.location?.address || "Dirección no especificada"}</p>
                <p className="text-slate-600">
                  {project.location?.city || "Ciudad"}, {project.location?.province || "Provincia"}
                </p>
              </CardContent>
            </Card>

            {/* Fechas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Fechas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Inicio:</span>
                  <span className="font-medium">{formatDate(project.dates?.start)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Fin estimado:</span>
                  <span className="font-medium">{formatDate(project.dates?.estimatedEnd)}</span>
                </div>
                {project.dates?.actualEnd && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Fin real:</span>
                    <span className="font-medium">{formatDate(project.dates.actualEnd)}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tasks">
          <ProjectTasksClient projectId={id} />
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documentos del Proyecto</CardTitle>
            </CardHeader>
            <CardContent>
              <ProjectDocumentsClient projectId={id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finances">
          <ProjectFinancesClient projectId={id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
