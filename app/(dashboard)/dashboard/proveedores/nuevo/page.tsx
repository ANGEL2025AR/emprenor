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
import { ArrowLeft, Truck } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function NuevoProveedorPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name"),
      contact: formData.get("contact"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      cuit: formData.get("cuit"),
      category: formData.get("category"),
      rating: Number.parseInt(formData.get("rating") as string),
      notes: formData.get("notes"),
    }

    try {
      const response = await fetch("/api/suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error("Error al crear el proveedor")

      toast({
        title: "Proveedor creado",
        description: "El proveedor se ha registrado correctamente",
      })

      router.push("/dashboard/proveedores")
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear el proveedor",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/proveedores">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nuevo Proveedor</h1>
          <p className="text-muted-foreground">Registre un nuevo proveedor</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Información del Proveedor
            </CardTitle>
            <CardDescription>Complete los datos del proveedor</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la Empresa *</Label>
                <Input id="name" name="name" required placeholder="Ej: Materiales del Norte S.A." />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">Persona de Contacto *</Label>
                <Input id="contact" name="contact" required placeholder="Nombre completo" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" name="email" type="email" required placeholder="contacto@empresa.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono *</Label>
                <Input id="phone" name="phone" type="tel" required placeholder="+54 11 1234-5678" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cuit">CUIT</Label>
                <Input id="cuit" name="cuit" placeholder="XX-XXXXXXXX-X" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoría *</Label>
                <Select name="category" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="materiales">Materiales de Construcción</SelectItem>
                    <SelectItem value="herramientas">Herramientas y Equipos</SelectItem>
                    <SelectItem value="electricidad">Electricidad</SelectItem>
                    <SelectItem value="plomeria">Plomería</SelectItem>
                    <SelectItem value="pintura">Pintura y Acabados</SelectItem>
                    <SelectItem value="transporte">Transporte</SelectItem>
                    <SelectItem value="otros">Otros Servicios</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rating">Calificación (1-5)</Label>
                <Select name="rating" defaultValue="3">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">⭐ 1 - Muy Malo</SelectItem>
                    <SelectItem value="2">⭐⭐ 2 - Malo</SelectItem>
                    <SelectItem value="3">⭐⭐⭐ 3 - Regular</SelectItem>
                    <SelectItem value="4">⭐⭐⭐⭐ 4 - Bueno</SelectItem>
                    <SelectItem value="5">⭐⭐⭐⭐⭐ 5 - Excelente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Dirección</Label>
                <Input id="address" name="address" placeholder="Calle, número, ciudad, provincia" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notas / Observaciones</Label>
              <Textarea id="notes" name="notes" placeholder="Información adicional sobre el proveedor..." rows={4} />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Creando..." : "Crear Proveedor"}
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
