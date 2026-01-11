"use client"

import type React from "react"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import type { Project } from "@/lib/db/models"

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [project, setProject] = useState<Partial<Project>>({})

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const updateData = {
        name: project.name,
        description: project.description,
        status: project.status,
        progress: project.progress || 0,
        budget: {
          estimated: project.budget?.estimated || 0,
          approved: project.budget?.approved || 0,
          spent: project.budget?.spent || 0,
          currency: project.budget?.currency || "ARS",
        },
      }

      const response = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      })

      if (response.ok) {
        router.push(`/dashboard/proyectos/${id}`)
        router.refresh()
      } else {
        alert("Error al guardar el proyecto")
      }
    } catch (error) {
      console.error("[v0] Error guardando proyecto:", error)
      alert("Error al guardar el proyecto")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/proyectos/${id}`}>
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Editar Proyecto</h1>
          <p className="text-slate-600">{project.code}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Información del Proyecto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Proyecto</Label>
                <Input
                  id="name"
                  value={project.name || ""}
                  onChange={(e) => setProject({ ...project, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <Select
                  value={project.status}
                  onValueChange={(value) => setProject({ ...project, status: value as Project["status"] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="borrador">Borrador</SelectItem>
                    <SelectItem value="aprobado">Aprobado</SelectItem>
                    <SelectItem value="en_progreso">En Progreso</SelectItem>
                    <SelectItem value="pausado">Pausado</SelectItem>
                    <SelectItem value="completado">Completado</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                rows={4}
                value={project.description || ""}
                onChange={(e) => setProject({ ...project, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="progress">Progreso (%)</Label>
                <Input
                  id="progress"
                  type="number"
                  min="0"
                  max="100"
                  value={project.progress || ""}
                  onChange={(e) => setProject({ ...project, progress: Number.parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
                <p className="text-xs text-slate-500">Ingrese el porcentaje de avance del proyecto</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Presupuesto Estimado (ARS)</Label>
                <Input
                  id="budget"
                  type="number"
                  min="0"
                  value={project.budget?.estimated || ""}
                  onChange={(e) =>
                    setProject({
                      ...project,
                      budget: {
                        ...project.budget!,
                        estimated: Number.parseInt(e.target.value) || 0,
                        approved: project.budget?.approved || 0,
                        spent: project.budget?.spent || 0,
                        currency: project.budget?.currency || "ARS",
                      },
                    })
                  }
                  placeholder="0"
                />
                <p className="text-xs text-slate-500">Ingrese el presupuesto total estimado</p>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" asChild>
                <Link href={`/dashboard/proyectos/${id}`}>Cancelar</Link>
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Guardar Cambios
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
