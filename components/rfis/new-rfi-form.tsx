"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { MessageSquare, Save, Loader2, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { DashboardOutlineButton, DashboardPrimaryButton } from "@/components/dashboard/dashboard-ui"

interface Project {
  _id: string
  name: string
  code: string
}

export default function NewRfiForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [projectId, setProjectId] = useState("")
  const [discipline, setDiscipline] = useState("arquitectura")
  const [priority, setPriority] = useState("normal")
  const [costImpact, setCostImpact] = useState(false)
  const [scheduleImpact, setScheduleImpact] = useState(false)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects?limit=100")
        if (response.ok) {
          const data = await response.json()
          setProjects(data.projects || [])
        }
      } catch (error) {
        console.error("Error al cargar proyectos:", error)
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
    const subject = String(formData.get("subject") || "").trim()
    const description = String(formData.get("description") || "").trim()
    const location = String(formData.get("location") || "").trim()
    const requiredResponseDate = String(formData.get("requiredResponseDate") || "")

    if (!projectId || !subject || !description || !requiredResponseDate) {
      toast({
        title: "Campos obligatorios",
        description: "Completa proyecto, asunto, descripción y fecha límite de respuesta.",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    const payload = {
      projectId,
      subject,
      description,
      discipline,
      priority,
      location,
      requiredResponseDate,
      drawingReferences: [],
      specificationReferences: [],
      cost: {
        hasImpact: costImpact,
        estimatedCost: costImpact ? Number(formData.get("estimatedCost") || 0) : undefined,
        justification: costImpact ? String(formData.get("costJustification") || "") : undefined,
      },
      schedule: {
        hasImpact: scheduleImpact,
        daysImpacted: scheduleImpact ? Number(formData.get("daysImpacted") || 0) : undefined,
        justification: scheduleImpact ? String(formData.get("scheduleJustification") || "") : undefined,
      },
      attachments: [],
    }

    try {
      const response = await fetch("/api/rfis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.error || "Error al crear RFI")
      }

      toast({
        title: "RFI creado",
        description: `Se registró ${data.rfiNumber || "la solicitud"} correctamente.`,
      })

      const id = data._id?.toString?.() || data._id
      router.push(id ? `/dashboard/rfis/${id}` : "/dashboard/rfis")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo crear el RFI.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <DashboardOutlineButton type="button" variant="outline" asChild>
        <Link href="/dashboard/rfis">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a RFIs
        </Link>
      </DashboardOutlineButton>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
            Nueva solicitud de información (RFI)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Proyecto *</Label>
            {loadingProjects ? (
              <div className="flex items-center gap-2 p-3 border rounded-lg mt-1">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm text-slate-600">Cargando proyectos...</span>
              </div>
            ) : (
              <Select value={projectId} onValueChange={setProjectId} required>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecciona el proyecto" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project._id} value={project._id}>
                      {project.code} — {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div>
            <Label htmlFor="subject">Asunto *</Label>
            <Input id="subject" name="subject" className="mt-1" placeholder="Ej: Aclaración de detalle estructural eje C" required maxLength={200} />
          </div>

          <div>
            <Label htmlFor="description">Consulta / descripción *</Label>
            <Textarea
              id="description"
              name="description"
              className="mt-1"
              rows={6}
              required
              placeholder="Describe con precisión la información que necesitas, referencias de planos y contexto de obra..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Disciplina</Label>
              <Select value={discipline} onValueChange={setDiscipline}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="arquitectura">Arquitectura</SelectItem>
                  <SelectItem value="estructura">Estructura</SelectItem>
                  <SelectItem value="mecanica">Mecánica</SelectItem>
                  <SelectItem value="electrica">Eléctrica</SelectItem>
                  <SelectItem value="plomeria">Plomería</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Prioridad</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baja">Baja</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="urgente">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="requiredResponseDate">Respuesta requerida antes de *</Label>
              <Input id="requiredResponseDate" name="requiredResponseDate" type="date" className="mt-1" required />
            </div>
          </div>

          <div>
            <Label htmlFor="location">Ubicación en obra</Label>
            <Input id="location" name="location" className="mt-1" placeholder="Ej: Sector norte, planta baja" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Checkbox id="costImpact" checked={costImpact} onCheckedChange={(v) => setCostImpact(v === true)} />
                <Label htmlFor="costImpact">Impacto en costo</Label>
              </div>
              {costImpact && (
                <>
                  <Input name="estimatedCost" type="number" min={0} step="0.01" placeholder="Costo estimado (ARS)" />
                  <Textarea name="costJustification" rows={2} placeholder="Justificación del impacto económico" />
                </>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Checkbox id="scheduleImpact" checked={scheduleImpact} onCheckedChange={(v) => setScheduleImpact(v === true)} />
                <Label htmlFor="scheduleImpact">Impacto en cronograma</Label>
              </div>
              {scheduleImpact && (
                <>
                  <Input name="daysImpacted" type="number" min={0} placeholder="Días de demora estimados" />
                  <Textarea name="scheduleJustification" rows={2} placeholder="Justificación del impacto en plazos" />
                </>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-4">
            <DashboardPrimaryButton type="submit" disabled={loading || loadingProjects}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Crear RFI
                </>
              )}
            </DashboardPrimaryButton>
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}


