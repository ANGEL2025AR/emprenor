"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ImageUploadField } from "@/components/site/image-upload-field"
import { GalleryUploadField } from "@/components/site/gallery-upload-field"

const categorias = [
  "Edificio Municipal",
  "Institución Educativa",
  "Universidad",
  "Centro Cultural",
  "Centro de Salud",
  "Hospital",
  "Comisaría",
  "Estación de Bomberos",
  "Centro Deportivo",
  "Polideportivo",
  "Estadio",
  "Biblioteca",
  "Museo",
  "Teatro",
  "Auditorio",
  "Terminal de Ómnibus",
  "Aeropuerto",
  "Puerto",
  "Plaza",
  "Parque",
  "Puente",
  "Viaducto",
  "Represa",
  "Acueducto",
  "Planta de Tratamiento",
  "Edificio Residencial",
  "Condominio",
  "Edificio Comercial",
  "Centro Comercial",
  "Supermercado",
  "Hotel",
  "Restaurante",
  "Industria",
  "Depósito",
  "Otra Obra Pública",
]

export default function EditarProyectoPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    duration: "",
    location: "",
    image: "",
    gallery: [] as string[],
    published: false,
    featured: false,
    order: 0,
  })

  useEffect(() => {
    if (id) {
      loadProject()
    }
  }, [id])

  const loadProject = async () => {
    try {
      const res = await fetch(`/api/public-projects/${id}`)
      if (res.ok) {
        const data = await res.json()
        setFormData(data.project)
      } else {
        alert("Error al cargar el proyecto")
        router.push("/dashboard/sitio-web/proyectos")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al cargar el proyecto")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch(`/api/public-projects/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        router.push("/dashboard/sitio-web/proyectos")
      } else {
        const error = await res.json()
        alert(error.error || "Error al actualizar el proyecto")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al actualizar el proyecto")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-lg">Cargando proyecto...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/sitio-web/proyectos">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Editar Proyecto</h1>
          <p className="text-muted-foreground mt-1">Modifica los detalles del proyecto público</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Información del Proyecto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Título del Proyecto *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ej: Edificio Municipal de General Mosconi"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoría *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe el proyecto en detalle..."
                rows={5}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duración</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="Ej: 18 meses"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Ubicación</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Ej: General Mosconi, Salta"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Orden de visualización</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: Number.parseInt(e.target.value) || 0 })}
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">Los proyectos se ordenan de menor a mayor número</p>
            </div>

            <ImageUploadField
              label="Imagen principal del proyecto"
              hint="Subí o reemplazá la foto desde tu PC. Se publica al guardar el proyecto."
              value={formData.image}
              onChange={(image) => setFormData((prev) => ({ ...prev, image }))}
              folder="public-projects"
              onUploadingChange={setUploading}
              previewClassName="max-w-md aspect-[3/2]"
            />

            <GalleryUploadField
              label="Galería de imágenes adicionales"
              hint="Más fotos: avances, etapas o distintas vistas del proyecto."
              value={formData.gallery || []}
              onChange={(gallery) => setFormData((prev) => ({ ...prev, gallery }))}
              folder="public-projects"
              onUploadingChange={setUploading}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="published">Publicar Proyecto</Label>
                  <p className="text-sm text-muted-foreground">El proyecto será visible en la página pública</p>
                </div>
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="featured">Proyecto Destacado</Label>
                  <p className="text-sm text-muted-foreground">Se mostrará con mayor prominencia</p>
                </div>
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 mt-6">
          <Button type="submit" disabled={saving || uploading}>
            {uploading ? "Subiendo imagen..." : saving ? "Guardando..." : "Guardar Cambios"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard/sitio-web/proyectos")}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}
