"use client"

import type React from "react"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Project, ProjectType, Priority } from "@/lib/db/models"

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { toast } = useToast()
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
        type: project.type,
        priority: project.priority,
        status: project.status,
        progress: Number(project.progress) || 0,
        client: {
          name: project.client?.name || "",
          email: project.client?.email || "",
          phone: project.client?.phone || "",
          address: project.client?.address || "",
        },
        location: {
          address: project.location?.address || "",
          city: project.location?.city || "",
          province: project.location?.province || "",
        },
        dates: {
          start: project.dates?.start || "",
          estimatedEnd: project.dates?.estimatedEnd || "",
        },
        budget: {
          estimated: Number(project.budget?.estimated) || 0,
          approved: Number(project.budget?.approved) || 0,
          spent: Number(project.budget?.spent) || 0,
          currency: project.budget?.currency || "ARS",
        },
      }

      const response = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      })

      if (response.ok) {
        toast({
          title: "Proyecto actualizado",
          description: "Los cambios se han guardado correctamente",
        })
        router.push(`/dashboard/proyectos/${id}`)
        router.refresh()
      } else {
        const err = await response.json()
        toast({
          title: "Error",
          description: err.error || "Error al guardar el proyecto",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error de conexion al guardar el proyecto",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const updateNested = (path: string, value: unknown) => {
    const keys = path.split(".")
    setProject((prev) => {
      const newData = { ...prev }
      let current: Record<string, unknown> = newData as Record<string, unknown>
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]] || typeof current[keys[i]] !== "object") {
          current[keys[i]] = {}
        }
        current[keys[i]] = { ...(current[keys[i]] as Record<string, unknown>) }
        current = current[keys[i]] as Record<string, unknown>
      }
      current[keys[keys.length - 1]] = value
      return newData as Partial<Project>
    })
  }

  // Helper to format dates for input type="date"
  const formatDateForInput = (date: string | Date | undefined): string => {
    if (!date) return ""
    try {
      const d = new Date(date)
      return d.toISOString().split("T")[0]
    } catch {
      return ""
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informacion basica */}
        <Card>
          <CardHeader>
            <CardTitle>Informacion del Proyecto</CardTitle>
            <CardDescription>Datos principales del proyecto</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Proyecto *</Label>
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
              <Label htmlFor="description">Descripcion</Label>
              <Textarea
                id="description"
                rows={4}
                value={project.description || ""}
                onChange={(e) => setProject({ ...project, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Proyecto</Label>
                <Select
                  value={project.type || ""}
                  onValueChange={(value) => setProject({ ...project, type: value as ProjectType })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="construccion">Construccion</SelectItem>
                    <SelectItem value="remodelacion">Remodelacion</SelectItem>
                    <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                    <SelectItem value="industrial">Industrial</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Prioridad</Label>
                <Select
                  value={project.priority || ""}
                  onValueChange={(value) => setProject({ ...project, priority: value as Priority })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baja">Baja</SelectItem>
                    <SelectItem value="media">Media</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="urgente">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progreso y Presupuesto */}
        <Card>
          <CardHeader>
            <CardTitle>Progreso y Presupuesto</CardTitle>
            <CardDescription>Avance y datos economicos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="progress">Progreso (%)</Label>
                <Input
                  id="progress"
                  type="number"
                  min="0"
                  max="100"
                  value={project.progress ?? ""}
                  onChange={(e) => {
                    const val = e.target.value
                    setProject({ ...project, progress: val === "" ? undefined : Number(val) })
                  }}
                  placeholder="Ej: 45"
                />
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all"
                    style={{ width: `${project.progress || 0}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget_estimated">Presupuesto Estimado</Label>
                <Input
                  id="budget_estimated"
                  type="number"
                  min="0"
                  value={project.budget?.estimated ?? ""}
                  onChange={(e) => {
                    const val = e.target.value
                    updateNested("budget.estimated", val === "" ? 0 : Number(val))
                  }}
                  placeholder="Ej: 5000000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget_approved">Presupuesto Aprobado</Label>
                <Input
                  id="budget_approved"
                  type="number"
                  min="0"
                  value={project.budget?.approved ?? ""}
                  onChange={(e) => {
                    const val = e.target.value
                    updateNested("budget.approved", val === "" ? 0 : Number(val))
                  }}
                  placeholder="Ej: 4500000"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget_spent">Presupuesto Gastado</Label>
                <Input
                  id="budget_spent"
                  type="number"
                  min="0"
                  value={project.budget?.spent ?? ""}
                  onChange={(e) => {
                    const val = e.target.value
                    updateNested("budget.spent", val === "" ? 0 : Number(val))
                  }}
                  placeholder="Ej: 2000000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget_currency">Moneda</Label>
                <Select
                  value={project.budget?.currency || "ARS"}
                  onValueChange={(value) => updateNested("budget.currency", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ARS">ARS (Peso Argentino)</SelectItem>
                    <SelectItem value="USD">USD (Dolar)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cliente */}
        <Card>
          <CardHeader>
            <CardTitle>Informacion del Cliente</CardTitle>
            <CardDescription>Datos de contacto del cliente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client_name">Nombre del Cliente</Label>
                <Input
                  id="client_name"
                  value={project.client?.name || ""}
                  onChange={(e) => updateNested("client.name", e.target.value)}
                  placeholder="Nombre completo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client_email">Email del Cliente</Label>
                <Input
                  id="client_email"
                  type="email"
                  value={project.client?.email || ""}
                  onChange={(e) => updateNested("client.email", e.target.value)}
                  placeholder="email@ejemplo.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client_phone">Telefono del Cliente</Label>
                <Input
                  id="client_phone"
                  type="tel"
                  value={project.client?.phone || ""}
                  onChange={(e) => updateNested("client.phone", e.target.value)}
                  placeholder="+54 9 11 1234-5678"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client_address">Direccion del Cliente</Label>
                <Input
                  id="client_address"
                  value={project.client?.address || ""}
                  onChange={(e) => updateNested("client.address", e.target.value)}
                  placeholder="Direccion"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ubicacion */}
        <Card>
          <CardHeader>
            <CardTitle>Ubicacion de la Obra</CardTitle>
            <CardDescription>Direccion del proyecto</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="location_address">Direccion de la Obra</Label>
              <Input
                id="location_address"
                value={project.location?.address || ""}
                onChange={(e) => updateNested("location.address", e.target.value)}
                placeholder="Calle, numero, piso, depto"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location_city">Ciudad</Label>
                <Input
                  id="location_city"
                  value={project.location?.city || ""}
                  onChange={(e) => updateNested("location.city", e.target.value)}
                  placeholder="Ciudad"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location_province">Provincia</Label>
                <Input
                  id="location_province"
                  value={project.location?.province || ""}
                  onChange={(e) => updateNested("location.province", e.target.value)}
                  placeholder="Provincia"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fechas */}
        <Card>
          <CardHeader>
            <CardTitle>Fechas del Proyecto</CardTitle>
            <CardDescription>Cronograma del proyecto</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date_start">Fecha de Inicio</Label>
                <Input
                  id="date_start"
                  type="date"
                  value={formatDateForInput(project.dates?.start)}
                  onChange={(e) => updateNested("dates.start", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_end">Fecha Estimada de Fin</Label>
                <Input
                  id="date_end"
                  type="date"
                  value={formatDateForInput(project.dates?.estimatedEnd)}
                  onChange={(e) => updateNested("dates.estimatedEnd", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Acciones */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href={`/dashboard/proyectos/${id}`}>Cancelar</Link>
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Guardar Cambios
          </Button>
        </div>
      </form>
    </div>
  )
}
