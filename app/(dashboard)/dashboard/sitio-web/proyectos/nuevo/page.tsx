"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Upload, Loader2, X, ImagePlus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const categories = [
  "Institución Educativa",
  "Universidad",
  "Centro Cultural",
  "Edificio Municipal",
  "Centro de Salud",
  "Hospital",
  "Obras Públicas",
  "Infraestructura Vial",
  "Infraestructura Hidráulica",
  "Infraestructura Deportiva",
  "Estadio",
  "Polideportivo",
  "Vivienda Social",
  "Edificio Residencial",
  "Condominio",
  "Edificio Comercial",
  "Centro Comercial",
  "Oficinas Corporativas",
  "Edificio Industrial",
  "Planta Industrial",
  "Depósito y Logística",
  "Restauración Patrimonial",
  "Remodelación",
  "Ampliación",
  "Centro Comunitario",
  "Biblioteca Pública",
  "Museo",
  "Teatro",
  "Terminal de Transporte",
  "Aeropuerto",
  "Estación Ferroviaria",
  "Hotel",
  "Complejo Turístico",
  "Otro",
]

export default function NuevoProyectoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    detailedDescription: "",
    duration: "",
    location: "",
    image: "",
    gallery: [] as string[],
    published: false,
    featured: false,
    order: 999,
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/public-projects/upload-image", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()
      if (data.success) {
        setFormData((prev) => ({ ...prev, image: data.url }))
      }
    } catch (error) {
      console.error("Error al subir imagen:", error)
      alert("Error al subir imagen")
    } finally {
      setUploading(false)
    }
  }

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setUploading(true)
    try {
      const uploadedUrls: string[] = []

      for (const file of files) {
        const formData = new FormData()
        formData.append("file", file)

        const res = await fetch("/api/public-projects/upload-image", {
          method: "POST",
          body: formData,
        })

        const data = await res.json()
        if (data.success) {
          uploadedUrls.push(data.url)
        }
      }

      setFormData((prev) => ({
        ...prev,
        gallery: [...prev.gallery, ...uploadedUrls],
      }))
    } catch (error) {
      console.error("Error al subir imágenes:", error)
      alert("Error al subir imágenes")
    } finally {
      setUploading(false)
    }
  }

  const removeGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/public-projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        router.push("/dashboard/sitio-web/proyectos")
      }
    } catch (error) {
      console.error("Error al crear proyecto:", error)
      alert("Error al crear proyecto")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/sitio-web/proyectos">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Nuevo Proyecto</h1>
          <p className="text-muted-foreground mt-1">Agrega un nuevo proyecto a la página pública</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Información del Proyecto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoría *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción Corta *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="detailedDescription">Descripción Detallada</Label>
              <Textarea
                id="detailedDescription"
                value={formData.detailedDescription}
                onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
                rows={6}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="duration">Duración *</Label>
                <Input
                  id="duration"
                  placeholder="ej: 8 meses"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Ubicación *</Label>
                <Input
                  id="location"
                  placeholder="ej: Departamento San Martin"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Imagen Principal *</Label>
              {formData.image ? (
                <div className="space-y-4">
                  <img
                    src={formData.image || "/placeholder.svg"}
                    alt="Vista previa"
                    className="w-full max-w-md h-48 object-cover rounded-lg"
                  />
                  <Button type="button" variant="outline" onClick={() => setFormData({ ...formData, image: "" })}>
                    Cambiar Imagen
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <Label htmlFor="image-upload" className="cursor-pointer">
                    <span className="text-primary hover:underline">Haz clic para subir</span>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                  </Label>
                  {uploading && <p className="text-sm text-muted-foreground mt-2">Subiendo...</p>}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Galería de Imágenes (Opcional)</Label>
              <p className="text-sm text-muted-foreground">
                Agrega más imágenes para mostrar avances o diferentes vistas del proyecto
              </p>

              {formData.gallery.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                  {formData.gallery.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url || "/placeholder.svg"}
                        alt={`Imagen ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeGalleryImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <ImagePlus className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                <Label htmlFor="gallery-upload" className="cursor-pointer">
                  <span className="text-primary hover:underline">
                    {formData.gallery.length > 0 ? "Agregar más imágenes" : "Subir imágenes a la galería"}
                  </span>
                  <Input
                    id="gallery-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleGalleryUpload}
                    disabled={uploading}
                  />
                </Label>
                <p className="text-xs text-muted-foreground mt-2">Puedes seleccionar múltiples imágenes a la vez</p>
                {uploading && <p className="text-sm text-muted-foreground mt-2">Subiendo...</p>}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Publicar</Label>
                  <p className="text-sm text-muted-foreground">Hacer visible en el sitio web</p>
                </div>
                <Switch
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Destacar</Label>
                  <p className="text-sm text-muted-foreground">Mostrar en sección destacados</p>
                </div>
                <Switch
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading || uploading || !formData.image}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Crear Proyecto"
                )}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/sitio-web/proyectos">Cancelar</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
