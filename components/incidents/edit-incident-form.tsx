"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface EditIncidentFormProps {
  incident: any
}

export default function EditIncidentForm({ incident }: EditIncidentFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      severity: formData.get("severity"),
      status: formData.get("status"),
      location: formData.get("location"),
    }

    try {
      const response = await fetch(`/api/incidents/${incident._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast({
          title: "Incidencia actualizada",
          description: "La incidencia se ha actualizado correctamente",
        })
        router.push(`/dashboard/incidencias/${incident._id}`)
        router.refresh()
      } else {
        throw new Error("Error al actualizar")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la incidencia",
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
          <div className="flex items-center gap-4">
            <Link href={`/dashboard/incidencias/${incident._id}`}>
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <CardTitle>Editar Incidencia</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Título de la Incidencia *</Label>
            <Input id="title" name="title" defaultValue={incident.title} required />
          </div>

          <div>
            <Label htmlFor="description">Descripción Detallada *</Label>
            <Textarea id="description" name="description" defaultValue={incident.description} rows={5} required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="severity">Severidad *</Label>
              <Select name="severity" defaultValue={incident.severity}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baja">Baja</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="critica">Crítica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Estado *</Label>
              <Select name="status" defaultValue={incident.status}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reportada">Reportada</SelectItem>
                  <SelectItem value="en_revision">En Revisión</SelectItem>
                  <SelectItem value="en_resolucion">En Resolución</SelectItem>
                  <SelectItem value="resuelta">Resuelta</SelectItem>
                  <SelectItem value="cerrada">Cerrada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location">Ubicación</Label>
              <Input id="location" name="location" defaultValue={incident.location} />
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Guardando..." : "Guardar Cambios"}
            </Button>
            <Link href={`/dashboard/incidencias/${incident._id}`}>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
