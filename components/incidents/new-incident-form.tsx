"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Save, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Project {
  _id: string
  name: string
  code: string
}

export default function NewIncidentForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [loadingProjects, setLoadingProjects] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects")
        if (response.ok) {
          const data = await response.json()
          setProjects(data.projects || [])
        }
      } catch (error) {
        console.error("[v0] Error fetching projects:", error)
      } finally {
        setLoadingProjects(false)
      }
    }

    fetchProjects()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      projectId: formData.get("projectId"),
      title: formData.get("title"),
      description: formData.get("description"),
      severity: formData.get("severity"),
      status: formData.get("status") || "reportada",
      location: formData.get("location"),
      reportedBy: formData.get("reportedBy"),
    }

    // Validación
    if (!data.projectId) {
      toast({
        title: "Error de validación",
        description: "Debes seleccionar un proyecto",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const result = await response.json()
        toast({
          title: "Incidencia reportada",
          description: "La incidencia se ha registrado correctamente",
        })
        router.push(`/dashboard/incidencias/${result.incidentId}`)
        router.refresh()
      } else {
        throw new Error("Error al crear incidencia")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo reportar la incidencia. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            Información de la Incidencia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Proyecto */}
          <div>
            <Label htmlFor="projectId">Proyecto Afectado *</Label>
            {loadingProjects ? (
              <div className="flex items-center gap-2 p-3 border rounded-lg">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm text-slate-600">Cargando proyectos...</span>
              </div>
            ) : (
              <Select name="projectId" required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el proyecto" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project._id} value={project._id}>
                      {project.code} - {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Título */}
          <div>
            <Label htmlFor="title">Título de la Incidencia *</Label>
            <Input id="title" name="title" placeholder="Ej: Fuga de agua en planta baja" required maxLength={200} />
          </div>

          {/* Descripción */}
          <div>
            <Label htmlFor="description">Descripción Detallada *</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe la incidencia con el mayor detalle posible: qué ocurrió, cuándo, dónde, posibles causas..."
              rows={6}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Severidad */}
            <div>
              <Label htmlFor="severity">Severidad *</Label>
              <Select name="severity" defaultValue="media" required>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baja">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Baja
                    </span>
                  </SelectItem>
                  <SelectItem value="media">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                      Media
                    </span>
                  </SelectItem>
                  <SelectItem value="alta">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                      Alta
                    </span>
                  </SelectItem>
                  <SelectItem value="critica">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      Crítica
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Ubicación */}
            <div>
              <Label htmlFor="location">Ubicación</Label>
              <Input id="location" name="location" placeholder="Ej: Sector A, Piso 2" />
            </div>

            {/* Reportado por */}
            <div>
              <Label htmlFor="reportedBy">Reportado Por</Label>
              <Input id="reportedBy" name="reportedBy" placeholder="Nombre del reportante" />
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading || loadingProjects}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Reportando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Reportar Incidencia
                </>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
