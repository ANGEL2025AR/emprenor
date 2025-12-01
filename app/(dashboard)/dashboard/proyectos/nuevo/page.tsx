"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, ArrowLeft, Loader2, Save, Upload, X, ImageIcon } from "lucide-react"

export default function NewProjectPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [images, setImages] = useState<Array<{ url: string; filename: string }>>([])
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    priority: "",
    client: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
    location: {
      address: "",
      city: "",
      province: "",
    },
    dates: {
      start: "",
      estimatedEnd: "",
    },
    budget: {
      estimated: "",
      currency: "ARS",
    },
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploadingImage(true)
    const uploadedImages: Array<{ url: string; filename: string }> = []

    for (const file of Array.from(files)) {
      try {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("projectId", "temp-" + Date.now())

        const response = await fetch("/api/projects/images", {
          method: "POST",
          body: formData,
        })

        if (response.ok) {
          const data = await response.json()
          uploadedImages.push({ url: data.url, filename: data.filename })
        }
      } catch (error) {
        console.error("Error uploading image:", error)
      }
    }

    setImages((prev) => [...prev, ...uploadedImages])
    setIsUploadingImage(false)
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          budget: {
            ...formData.budget,
            estimated: Number.parseFloat(formData.budget.estimated) || 0,
          },
          images: images.map((img) => img.url),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Error al crear proyecto")
        return
      }

      router.push(`/dashboard/proyectos/${data.project._id}`)
    } catch {
      setError("Error de conexión")
    } finally {
      setIsLoading(false)
    }
  }

  const updateFormData = (path: string, value: string) => {
    const keys = path.split(".")
    setFormData((prev) => {
      const newData = { ...prev }
      let current: Record<string, unknown> = newData
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]] as Record<string, unknown>
      }
      current[keys[keys.length - 1]] = value
      return newData
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/proyectos">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Nuevo Proyecto</h1>
          <p className="text-slate-600">Crea un nuevo proyecto de construcción</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Información básica */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Proyecto</CardTitle>
            <CardDescription>Datos básicos del proyecto</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Proyecto *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateFormData("name", e.target.value)}
                  placeholder="Ej: Casa Familia García"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Proyecto *</Label>
                <Select value={formData.type} onValueChange={(value) => updateFormData("type", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="construccion">Construcción</SelectItem>
                    <SelectItem value="remodelacion">Remodelación</SelectItem>
                    <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                    <SelectItem value="industrial">Industrial</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateFormData("description", e.target.value)}
                placeholder="Describe el alcance y objetivos del proyecto..."
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Prioridad *</Label>
              <Select value={formData.priority} onValueChange={(value) => updateFormData("priority", value)} required>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Imágenes del Proyecto</CardTitle>
            <CardDescription>Sube fotos del proyecto, planos o renders</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="images">Subir Imágenes</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  disabled={isUploadingImage}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("images")?.click()}
                  disabled={isUploadingImage}
                >
                  {isUploadingImage ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Subiendo...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Seleccionar Imágenes
                    </>
                  )}
                </Button>
                <span className="text-sm text-slate-500">
                  {images.length} {images.length === 1 ? "imagen" : "imágenes"} cargadas
                </span>
              </div>
            </div>

            {/* Image Gallery */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt={image.filename}
                      className="w-full h-32 object-cover rounded-lg border border-slate-200"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    <div className="absolute bottom-2 left-2 right-2 bg-black/50 text-white text-xs p-1 rounded truncate">
                      {image.filename}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {images.length === 0 && (
              <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 rounded-lg">
                <ImageIcon className="w-12 h-12 text-slate-400 mb-2" />
                <p className="text-sm text-slate-500">No hay imágenes cargadas</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cliente */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Cliente</CardTitle>
            <CardDescription>Datos de contacto del cliente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Nombre del Cliente *</Label>
                <Input
                  id="clientName"
                  value={formData.client.name}
                  onChange={(e) => updateFormData("client.name", e.target.value)}
                  placeholder="Nombre completo"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientEmail">Email *</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  value={formData.client.email}
                  onChange={(e) => updateFormData("client.email", e.target.value)}
                  placeholder="email@ejemplo.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientPhone">Teléfono *</Label>
                <Input
                  id="clientPhone"
                  type="tel"
                  value={formData.client.phone}
                  onChange={(e) => updateFormData("client.phone", e.target.value)}
                  placeholder="+54 9 11 1234-5678"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientAddress">Dirección *</Label>
                <Input
                  id="clientAddress"
                  value={formData.client.address}
                  onChange={(e) => updateFormData("client.address", e.target.value)}
                  placeholder="Dirección del cliente"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ubicación */}
        <Card>
          <CardHeader>
            <CardTitle>Ubicación de la Obra</CardTitle>
            <CardDescription>Dirección donde se realizará el proyecto</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="locationAddress">Dirección de la Obra *</Label>
              <Input
                id="locationAddress"
                value={formData.location.address}
                onChange={(e) => updateFormData("location.address", e.target.value)}
                placeholder="Calle, número, piso, depto"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="locationCity">Ciudad *</Label>
                <Input
                  id="locationCity"
                  value={formData.location.city}
                  onChange={(e) => updateFormData("location.city", e.target.value)}
                  placeholder="Ciudad"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="locationProvince">Provincia *</Label>
                <Input
                  id="locationProvince"
                  value={formData.location.province}
                  onChange={(e) => updateFormData("location.province", e.target.value)}
                  placeholder="Provincia"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fechas y Presupuesto */}
        <Card>
          <CardHeader>
            <CardTitle>Fechas y Presupuesto</CardTitle>
            <CardDescription>Cronograma y estimación económica</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Fecha de Inicio *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.dates.start}
                  onChange={(e) => updateFormData("dates.start", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Fecha Estimada de Fin *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.dates.estimatedEnd}
                  onChange={(e) => updateFormData("dates.estimatedEnd", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Presupuesto Estimado *</Label>
                <Input
                  id="budget"
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.budget.estimated}
                  onChange={(e) => updateFormData("budget.estimated", e.target.value)}
                  placeholder="0"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Moneda</Label>
                <Select
                  value={formData.budget.currency}
                  onValueChange={(value) => updateFormData("budget.currency", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ARS">ARS (Peso Argentino)</SelectItem>
                    <SelectItem value="USD">USD (Dólar)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/dashboard/proyectos">Cancelar</Link>
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Crear Proyecto
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
