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

interface EditSupplierFormProps {
  supplier: any
}

export default function EditSupplierForm({ supplier }: EditSupplierFormProps) {
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
      category: formData.get("category"),
      address: formData.get("address"),
      taxId: formData.get("taxId"),
      notes: formData.get("notes"),
    }

    try {
      const response = await fetch(`/api/suppliers/${supplier._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast({
          title: "Proveedor actualizado",
          description: "Los datos del proveedor se han actualizado correctamente",
        })
        router.push(`/dashboard/proveedores/${supplier._id}`)
        router.refresh()
      } else {
        throw new Error("Error al actualizar")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron actualizar los datos del proveedor",
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
            <Link href={`/dashboard/proveedores/${supplier._id}`}>
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <CardTitle>Editar Proveedor</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nombre del Proveedor *</Label>
              <Input id="name" name="name" defaultValue={supplier.name} required />
            </div>

            <div>
              <Label htmlFor="contact">Contacto *</Label>
              <Input id="contact" name="contact" defaultValue={supplier.contact} required />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input id="email" name="email" type="email" defaultValue={supplier.email} required />
            </div>

            <div>
              <Label htmlFor="phone">Teléfono *</Label>
              <Input id="phone" name="phone" defaultValue={supplier.phone} required />
            </div>

            <div>
              <Label htmlFor="category">Categoría *</Label>
              <Select name="category" defaultValue={supplier.category}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="materiales">Materiales</SelectItem>
                  <SelectItem value="herramientas">Herramientas</SelectItem>
                  <SelectItem value="equipos">Equipos</SelectItem>
                  <SelectItem value="servicios">Servicios</SelectItem>
                  <SelectItem value="subcontratistas">Subcontratistas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="taxId">CUIT/RUT</Label>
              <Input id="taxId" name="taxId" defaultValue={supplier.taxId} />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Dirección</Label>
            <Textarea id="address" name="address" defaultValue={supplier.address} rows={2} />
          </div>

          <div>
            <Label htmlFor="notes">Notas</Label>
            <Textarea id="notes" name="notes" defaultValue={supplier.notes} rows={3} />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Guardando..." : "Guardar Cambios"}
            </Button>
            <Link href={`/dashboard/proveedores/${supplier._id}`}>
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
