"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Project {
  _id: string
  name: string
  code: string
}

export default function NewDailyLogForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [projectId, setProjectId] = useState("")
  const [shift, setShift] = useState("mañana")
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => (r.ok ? r.json() : { projects: [] }))
      .then((data) => setProjects(data.projects || []))
      .catch(() => setProjects([]))
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const activityText = String(formData.get("activitySummary") || "").trim()

    if (!projectId) {
      toast({ title: "Selecciona un proyecto", variant: "destructive" })
      setLoading(false)
      return
    }

    const payload = {
      projectId,
      date: formData.get("date"),
      shift,
      weather: {
        condition: formData.get("weatherCondition"),
        temperature: Number(formData.get("temperature") || 0),
        precipitation: 0,
      },
      workforce: {
        total: Number(formData.get("workforceTotal") || 0),
        contractors: [],
        subcontractors: [],
      },
      activities: activityText
        ? [{ description: activityText, progress: "", location: String(formData.get("location") || "") }]
        : [],
      safetyObservations: String(formData.get("safetyNotes") || "").trim()
        ? [{ observation: String(formData.get("safetyNotes")), severity: "media" }]
        : [],
      notes: formData.get("notes"),
    }

    try {
      const response = await fetch("/api/daily-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Error")

      toast({ title: "Bitácora registrada", description: data.logNumber || "Registro guardado" })
      router.push(`/dashboard/bitacora-diaria/${data._id}`)
      router.refresh()
    } catch {
      toast({ title: "Error", description: "No se pudo guardar la bitácora", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const today = new Date().toISOString().slice(0, 10)

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Registro del día</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Proyecto *</Label>
            <Select value={projectId} onValueChange={setProjectId} required>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecciona el proyecto" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((p) => (
                  <SelectItem key={p._id} value={p._id}>
                    {p.code} — {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Fecha *</Label>
              <Input id="date" name="date" type="date" className="mt-1" defaultValue={today} required />
            </div>
            <div>
              <Label htmlFor="shift">Turno *</Label>
              <Select value={shift} onValueChange={setShift}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mañana">Mañana</SelectItem>
                  <SelectItem value="tarde">Tarde</SelectItem>
                  <SelectItem value="noche">Noche</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weatherCondition">Clima</Label>
              <Select name="weatherCondition" defaultValue="despejado">
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="despejado">Despejado</SelectItem>
                  <SelectItem value="nublado">Nublado</SelectItem>
                  <SelectItem value="lluvia">Lluvia</SelectItem>
                  <SelectItem value="viento">Viento</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="temperature">Temperatura (°C)</Label>
              <Input id="temperature" name="temperature" type="number" className="mt-1" defaultValue={20} />
            </div>
          </div>
          <div>
            <Label htmlFor="workforceTotal">Personal en obra</Label>
            <Input id="workforceTotal" name="workforceTotal" type="number" min={0} className="mt-1" defaultValue={0} />
          </div>
          <div>
            <Label htmlFor="location">Sector / ubicación</Label>
            <Input id="location" name="location" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="activitySummary">Actividades del día *</Label>
            <Textarea id="activitySummary" name="activitySummary" className="mt-1" rows={4} required />
          </div>
          <div>
            <Label htmlFor="safetyNotes">Observaciones de seguridad</Label>
            <Textarea id="safetyNotes" name="safetyNotes" className="mt-1" rows={2} />
          </div>
          <div>
            <Label htmlFor="notes">Notas adicionales</Label>
            <Textarea id="notes" name="notes" className="mt-1" rows={2} />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={loading}>
        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
        Guardar bitácora
      </Button>
    </form>
  )
}
