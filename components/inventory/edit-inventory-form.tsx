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

interface EditInventoryFormProps {
  item: any
}

export default function EditInventoryForm({ item }: EditInventoryFormProps) {
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
      unitPrice: Number.parseFloat(formData.get("unitPrice") as string),
      minStock: Number.parseInt(formData.get("minStock") as string),
      location: formData.get("location"),
      description: formData.get("description"),
    }

    try {
      const response = await fetch(`/api/inventory/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast({
          title: "Item actualizado",
          description: "El item de inventario se ha actualizado correctamente",
        })
        router.push(`/dashboard/inventario/${item._id}`)
        router.refresh()
      } else {
        throw new Error("Error al actualizar")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el item",
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
            <Link href={`/dashboard/inventario/${item._id}`}>
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <CardTitle>Editar Item</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nombre del Item *</Label>
              <Input id="name" name="name" defaultValue={item.name} required />
            </div>

            <div>
              <Label htmlFor="category">Categoría *</Label>
              <Select name="category" defaultValue={item.category}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="materiales">Materiales</SelectItem>
                  <SelectItem value="herramientas">Herramientas</SelectItem>
                  <SelectItem value="equipos">Equipos</SelectItem>
                  <SelectItem value="insumos">Insumos</SelectItem>
                  <SelectItem value="otros">Otros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="quantity">Cantidad *</Label>
              <Input id="quantity" name="quantity" type="number" defaultValue={item.quantity} required />
            </div>

            <div>
              <Label htmlFor="unit">Unidad *</Label>
              <Select name="unit" defaultValue={item.unit}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unidades">Unidades</SelectItem>
                  <SelectItem value="metros">Metros</SelectItem>
                  <SelectItem value="kilos">Kilos</SelectItem>
                  <SelectItem value="litros">Litros</SelectItem>
                  <SelectItem value="cajas">Cajas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="unitPrice">Precio Unitario *</Label>
              <Input id="unitPrice" name="unitPrice" type="number" step="0.01" defaultValue={item.unitPrice} required />
            </div>

            <div>
              <Label htmlFor="minStock">Stock Mínimo *</Label>
              <Input id="minStock" name="minStock" type="number" defaultValue={item.minStock} required />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="location">Ubicación</Label>
              <Input id="location" name="location" defaultValue={item.location} />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" name="description" defaultValue={item.description} rows={3} />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Guardando..." : "Guardar Cambios"}
            </Button>
            <Link href={`/dashboard/inventario/${item._id}`}>
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
