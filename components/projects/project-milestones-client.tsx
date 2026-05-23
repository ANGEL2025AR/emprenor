"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle2, Circle, Loader2, Plus, Trash2 } from "lucide-react"
import type { ProjectMilestone } from "@/lib/projects/project-manager-types"

function formatDate(d: string | Date | undefined): string {
  if (!d) return "—"
  return new Date(d).toLocaleDateString("es-AR")
}

export function ProjectMilestonesClient({
  projectId,
  readOnly = false,
  onProgressChange,
}: {
  projectId: string
  readOnly?: boolean
  onProgressChange?: (progress: number) => void
}) {
  const [milestones, setMilestones] = useState<ProjectMilestone[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [estimatedDate, setEstimatedDate] = useState("")
  const { toast } = useToast()

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}/milestones`)
      if (res.ok) {
        const data = await res.json()
        setMilestones(data.milestones ?? [])
        onProgressChange?.(data.progress ?? 0)
      }
    } finally {
      setLoading(false)
    }
  }, [projectId, onProgressChange])

  useEffect(() => {
    load()
  }, [load])

  const addMilestone = async () => {
    if (!name.trim()) return
    setSaving(true)
    try {
      const res = await fetch(`/api/projects/${projectId}/milestones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          estimatedDate: estimatedDate || undefined,
        }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setMilestones(data.milestones ?? [])
      onProgressChange?.(data.progress ?? 0)
      setName("")
      setEstimatedDate("")
      setOpen(false)
      toast({ title: "Hito agregado" })
    } catch {
      toast({ title: "Error", description: "No se pudo guardar el hito", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const toggleComplete = async (m: ProjectMilestone) => {
    setSaving(true)
    try {
      const res = await fetch(`/api/projects/${projectId}/milestones/${m.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !m.completed }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setMilestones(data.milestones ?? [])
      onProgressChange?.(data.progress ?? 0)
    } catch {
      toast({ title: "Error al actualizar hito", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const removeMilestone = async (milestoneId: string) => {
    setSaving(true)
    try {
      const res = await fetch(`/api/projects/${projectId}/milestones/${milestoneId}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setMilestones(data.milestones ?? [])
      onProgressChange?.(data.progress ?? 0)
    } catch {
      toast({ title: "Error al eliminar", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-slate-600">
          Cronograma por hitos. El avance general se calcula automáticamente al marcar etapas completadas.
        </p>
        {!readOnly && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Nuevo hito
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar hito</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <div>
                  <Label htmlFor="hito-nombre">Nombre</Label>
                  <Input id="hito-nombre" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Estructura" />
                </div>
                <div>
                  <Label htmlFor="hito-fecha">Fecha estimada</Label>
                  <Input id="hito-fecha" type="date" value={estimatedDate} onChange={(e) => setEstimatedDate(e.target.value)} />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={addMilestone} disabled={saving || !name.trim()}>
                  {saving ? "Guardando…" : "Guardar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {milestones.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-slate-500 text-sm">
            {readOnly
              ? "EMPRENOR publicará el cronograma de hitos cuando esté definido."
              : "Agregá hitos para armar el cronograma de la obra."}
          </CardContent>
        </Card>
      ) : (
        <ul className="space-y-3">
          {milestones.map((m) => (
            <li key={m.id} className="rounded-lg border p-4 bg-white">
              <div className="flex items-start gap-3">
                {!readOnly ? (
                  <button
                    type="button"
                    className="mt-0.5 text-slate-400 hover:text-emerald-600 disabled:opacity-50"
                    disabled={saving}
                    onClick={() => toggleComplete(m)}
                    aria-label={m.completed ? "Marcar pendiente" : "Marcar completado"}
                  >
                    {m.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>
                ) : m.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-slate-900">{m.name}</span>
                    {m.completed && <Badge className="bg-emerald-100 text-emerald-800">Completado</Badge>}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Estimado: {formatDate(m.estimatedDate)}</p>
                  {!m.completed && (
                    <div className="mt-2">
                      <Progress value={m.progress} className="h-1.5" />
                      <span className="text-xs text-slate-500">{m.progress}%</span>
                    </div>
                  )}
                </div>
                {!readOnly && (
                  <Button variant="ghost" size="icon" disabled={saving} onClick={() => removeMilestone(m.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
