"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Package } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function NuevoInventarioPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name"),
      category: formData.get("category"),
      quantity: Number.parseInt(formData.get("quantity") as string),
      unit: formData.get("unit"),
      minStock: Number.parseInt(formData.get("minStock") as string),
      unitPrice: Number.parseFloat(formData.get("unitPrice") as string),
      supplier: formData.get("supplier"),
      location: formData.get("location"),
      notes: formData.get("notes"),
    }

    try {
      const response = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error("Error al crear el artículo")

      toast({
        title: "Artículo creado",
        description: "El artículo se ha agregado al inventario",
      })

      router.push("/dashboard/inventario")
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear el artículo",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/inventario">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nuevo Artículo de Inventario</h1>
          <p className="text-muted-foreground">Agregue un nuevo artículo al inventario</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Información del Artículo
            </CardTitle>
            <CardDescription>Complete los datos del artículo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Artículo *</Label>
                <Input id="name" name="name" required placeholder="Ej: Cemento Portland" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoría *</Label>
                <Select name="category" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="materiales">Materiales de Construcción</SelectItem>
                    <SelectItem value="herramientas">Herramientas</SelectItem>
                    <SelectItem value="equipos">Equipos</SelectItem>
                    <SelectItem value="electricidad">Electricidad</SelectItem>
                    <SelectItem value="plomeria">Plomería</SelectItem>
                    <SelectItem value="pintura">Pintura</SelectItem>
                    <SelectItem value="acabados">Acabados</SelectItem>
                    <SelectItem value="otros">Otros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Cantidad *</Label>
                <Input id="quantity" name="quantity" type="number" required min="0" placeholder="0" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Unidad de Medida *</Label>
                <Select name="unit" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione unidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unidades">Unidades</SelectItem>
                    <SelectItem value="kg">Kilogramos</SelectItem>
                    <SelectItem value="m">Metros</SelectItem>
                    <SelectItem value="m2">Metros Cuadrados</SelectItem>
                    <SelectItem value="m3">Metros Cúbicos</SelectItem>
                    <SelectItem value="litros">Litros</SelectItem>
                    <SelectItem value="bolsas">Bolsas</SelectItem>
                    <SelectItem value="cajas">Cajas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="minStock">Stock Mínimo *</Label>
                <Input id="minStock" name="minStock" type="number" required min="0" placeholder="0" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unitPrice">Precio Unitario *</Label>
                <Input id="unitPrice" name="unitPrice" type="number" step="0.01" required placeholder="0.00" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplier">Proveedor</Label>
                <Input id="supplier" name="supplier" placeholder="Nombre del proveedor" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Ubicación</Label>
                <Input id="location" name="location" placeholder="Ej: Depósito A - Estante 3" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notas / Descripción</Label>
              <Textarea id="notes" name="notes" placeholder="Información adicional sobre el artículo..." rows={4} />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Creando..." : "Crear Artículo"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
