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
import { Loader2, Plus, Save, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Project {
  _id: string
  name: string
  code: string
}

type PunchItem = {
  description: string
  location: string
  priority: string
  status: string
}

export default function NewPunchListForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [projectId, setProjectId] = useState("")
  const [projects, setProjects] = useState<Project[]>([])
  const [items, setItems] = useState<PunchItem[]>([
    { description: "", location: "", priority: "media", status: "abierto" },
  ])

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
    const listName = String(formData.get("listName") || "").trim()
    const validItems = items.filter((i) => i.description.trim())

    if (!projectId || !listName) {
      toast({ title: "Completa proyecto y nombre de la lista", variant: "destructive" })
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/punch-lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          listName,
          description: formData.get("description"),
          phase: formData.get("phase"),
          location: formData.get("location"),
          items: validItems,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Error")

      toast({ title: "Punch list creada", description: listName })
      router.push(`/dashboard/punch-lists/${data._id}`)
      router.refresh()
    } catch {
      toast({ title: "Error", description: "No se pudo crear la punch list", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Datos generales</CardTitle>
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
          <div>
            <Label htmlFor="listName">Nombre de la lista *</Label>
            <Input id="listName" name="listName" className="mt-1" required maxLength={200} />
          </div>
          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" name="description" className="mt-1" rows={3} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phase">Fase / etapa</Label>
              <Input id="phase" name="phase" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="location">Ubicación general</Label>
              <Input id="location" name="location" className="mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Ítems de la lista</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setItems((prev) => [...prev, { description: "", location: "", priority: "media", status: "abierto" }])
            }
          >
            <Plus className="w-4 h-4 mr-1" /> Agregar ítem
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="rounded-lg border p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-600">Ítem {index + 1}</span>
                {items.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setItems((prev) => prev.filter((_, i) => i !== index))}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <Input
                placeholder="Descripción del pendiente o defecto"
                value={item.description}
                onChange={(e) => {
                  const next = [...items]
                  next[index] = { ...next[index], description: e.target.value }
                  setItems(next)
                }}
              />
              <div className="grid sm:grid-cols-2 gap-3">
                <Input
                  placeholder="Ubicación"
                  value={item.location}
                  onChange={(e) => {
                    const next = [...items]
                    next[index] = { ...next[index], location: e.target.value }
                    setItems(next)
                  }}
                />
                <Select
                  value={item.priority}
                  onValueChange={(v) => {
                    const next = [...items]
                    next[index] = { ...next[index], priority: v }
                    setItems(next)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baja">Baja</SelectItem>
                    <SelectItem value="media">Media</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="critica">Crítica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Button type="submit" disabled={loading} className="w-full sm:w-auto">
        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
        Guardar punch list
      </Button>
    </form>
  )
}
