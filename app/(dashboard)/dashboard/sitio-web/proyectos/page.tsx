"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Eye, EyeOff, Edit, Trash2, Globe } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface PublicProject {
  _id: string
  title: string
  category: string
  description: string
  duration: string
  location: string
  image: string
  published: boolean
  featured: boolean
  order: number
  createdAt: string
}

export default function SitioWebProyectosPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<PublicProject[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"todos" | "publicados" | "borradores">("todos")

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const res = await fetch("/api/public-projects")
      const data = await res.json()
      setProjects(data.projects || [])
    } catch (error) {
      console.error("Error al cargar proyectos:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Está seguro de eliminar este proyecto?")) return

    try {
      const res = await fetch(`/api/public-projects/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        await loadProjects()
      }
    } catch (error) {
      console.error("Error al eliminar:", error)
    }
  }

  const togglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/public-projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !currentStatus }),
      })

      if (res.ok) {
        await loadProjects()
      }
    } catch (error) {
      console.error("Error al cambiar estado:", error)
    }
  }

  const filteredProjects = projects.filter((p) => {
    if (filter === "publicados") return p.published
    if (filter === "borradores") return !p.published
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Proyectos del Sitio Web</h1>
          <p className="text-muted-foreground mt-2">Gestiona los proyectos que se muestran en la página pública</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/sitio-web/proyectos/nuevo">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Proyecto
          </Link>
        </Button>
      </div>

      <div className="flex gap-3">
        <Button variant={filter === "todos" ? "default" : "outline"} onClick={() => setFilter("todos")}>
          Todos ({projects.length})
        </Button>
        <Button variant={filter === "publicados" ? "default" : "outline"} onClick={() => setFilter("publicados")}>
          Publicados ({projects.filter((p) => p.published).length})
        </Button>
        <Button variant={filter === "borradores" ? "default" : "outline"} onClick={() => setFilter("borradores")}>
          Borradores ({projects.filter((p) => !p.published).length})
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">Cargando proyectos...</div>
      ) : filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Globe className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay proyectos</h3>
            <p className="text-muted-foreground mb-4">Comienza agregando tu primer proyecto público</p>
            <Button asChild>
              <Link href="/dashboard/sitio-web/proyectos/nuevo">
                <Plus className="mr-2 h-4 w-4" />
                Crear Proyecto
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <Card key={project._id} className="overflow-hidden">
              <div className="relative aspect-[3/2]">
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className="object-cover w-full h-full"
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  {project.featured && <Badge className="bg-amber-500">Destacado</Badge>}
                  <Badge variant={project.published ? "default" : "secondary"}>
                    {project.published ? "Publicado" : "Borrador"}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-1">{project.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{project.category}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{project.description}</p>
                <div className="text-xs text-muted-foreground mb-4">
                  {project.duration} | {project.location}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => togglePublished(project._id, project.published)}>
                    {project.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/dashboard/sitio-web/proyectos/${project._id}/editar`)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(project._id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
