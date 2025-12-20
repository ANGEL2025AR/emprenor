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
import { ArrowLeft, Upload, X, ImagePlus } from "lucide-react"
import Link from "next/link"

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

  const [newImage, setNewImage] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string>("")

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
        setPreviewImage(data.project.image)
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
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
        gallery: [...(prev.gallery || []), ...uploadedUrls],
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
      gallery: (prev.gallery || []).filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      let imageUrl = formData.image

      // Si hay nueva imagen, subirla primero
      if (newImage) {
        setUploading(true)
        const imageFormData = new FormData()
        imageFormData.append("file", newImage)

        const uploadRes = await fetch("/api/public-projects/upload-image", {
          method: "POST",
          body: imageFormData,
        })

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json()
          imageUrl = uploadData.url
        } else {
          throw new Error("Error al subir la imagen")
        }
        setUploading(false)
      }

      // Actualizar proyecto
      const res = await fetch(`/api/public-projects/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          image: imageUrl,
        }),
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
      setUploading(false)
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

            <div className="space-y-2">
              <Label>Imagen Principal del Proyecto</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                {previewImage ? (
                  <div className="relative">
                    <img
                      src={previewImage || "/placeholder.svg"}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setPreviewImage("")
                        setNewImage(null)
                        setFormData({ ...formData, image: "" })
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <div className="text-sm text-muted-foreground">
                      <label htmlFor="image-upload" className="cursor-pointer text-primary hover:underline">
                        Selecciona una imagen
                      </label>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </div>
                  </div>
                )}
              </div>
              {!previewImage && (
                <p className="text-xs text-muted-foreground">
                  Formatos soportados: JPG, PNG, WEBP. Tamaño recomendado: 1200x800px
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Galería de Imágenes Adicionales</Label>
              <p className="text-sm text-muted-foreground">
                Agrega más imágenes para mostrar avances o diferentes etapas del proyecto
              </p>

              {formData.gallery && formData.gallery.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                  {formData.gallery.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url || "/placeholder.svg"}
                        alt={`Imagen ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7"
                        onClick={() => removeGalleryImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      <div className="absolute bottom-2 left-2 bg-background/80 backdrop-blur-sm px-2 py-0.5 rounded text-xs">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <ImagePlus className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                <Label htmlFor="gallery-upload" className="cursor-pointer">
                  <span className="text-primary hover:underline">
                    {formData.gallery && formData.gallery.length > 0
                      ? "Agregar más imágenes"
                      : "Subir imágenes a la galería"}
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
                {uploading && <p className="text-sm text-primary mt-2">Subiendo imágenes...</p>}
              </div>
            </div>

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
