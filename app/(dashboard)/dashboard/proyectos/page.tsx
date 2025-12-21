"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Filter, MapPin, Calendar, Users, MoreVertical, Loader2, Trash2, Eye, Edit } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import type { Project } from "@/lib/db/models"

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

function formatDate(date: Date | string | undefined): string {
  if (!date) return "Sin fecha"
  try {
    return new Date(date).toLocaleDateString("es-AR")
  } catch {
    return "Sin fecha"
  }
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchProjects()
  }, [statusFilter])

  const fetchProjects = async () => {
    try {
      const params = new URLSearchParams()
      if (statusFilter && statusFilter !== "all") params.append("status", statusFilter)
      if (search) params.append("search", search)

      const response = await fetch(`/api/projects?${params}`)
      const data = await response.json()
      setProjects(data.projects || [])
    } catch {
      // Error silencioso en producción
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchProjects()
  }

  const openDeleteDialog = (projectId: string) => {
    setProjectToDelete(projectId)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!projectToDelete) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/projects/${projectToDelete}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Error al eliminar el proyecto")
      }

      toast({
        title: "Proyecto eliminado",
        description: "El proyecto se ha eliminado correctamente",
      })

      // Recargar proyectos
      await fetchProjects()
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el proyecto",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
      setDeleteDialogOpen(false)
      setProjectToDelete(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Proyectos</h1>
          <p className="text-slate-600">Gestiona todos tus proyectos de construcción</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/proyectos/nuevo">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Proyecto
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="search"
                placeholder="Buscar por nombre, código o cliente..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="borrador">Borrador</SelectItem>
                <SelectItem value="aprobado">Aprobado</SelectItem>
                <SelectItem value="en_progreso">En Progreso</SelectItem>
                <SelectItem value="pausado">Pausado</SelectItem>
                <SelectItem value="completado">Completado</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit">Buscar</Button>
          </form>
        </CardContent>
      </Card>

      {/* Projects grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      ) : projects.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No hay proyectos</h3>
            <p className="text-slate-600 mb-4">Comienza creando tu primer proyecto</p>
            <Button asChild>
              <Link href="/dashboard/proyectos/nuevo">Crear Proyecto</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project._id?.toString()} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge className={STATUS_COLORS[project.status]}>{STATUS_LABELS[project.status]}</Badge>
                    <CardTitle className="mt-2 text-lg">{project.name}</CardTitle>
                    <p className="text-sm text-slate-500">{project.code}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/proyectos/${project._id}`} className="cursor-pointer">
                          <Eye className="w-4 h-4 mr-2" />
                          Ver detalles
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/proyectos/${project._id}/editar`} className="cursor-pointer">
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => openDeleteDialog(project._id?.toString() || "")}
                        className="text-red-600 focus:text-red-600 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-600 line-clamp-2">{project.description}</p>

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">Progreso</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Meta info */}
                <div className="flex flex-wrap gap-3 text-sm text-slate-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {project.location?.city || "Sin ubicación"}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(project.dates?.start)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {project.client?.name || "Sin cliente"}
                  </div>
                </div>

                <Link href={`/dashboard/proyectos/${project._id}`} className="block">
                  <Button variant="outline" className="w-full bg-transparent">
                    Ver Proyecto
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialogo de confirmación para eliminar */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar proyecto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El proyecto será eliminado permanentemente de la base de datos junto con
              todos sus documentos y registros asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600" disabled={deleting}>
              {deleting ? "Eliminando..." : "Eliminar Proyecto"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
