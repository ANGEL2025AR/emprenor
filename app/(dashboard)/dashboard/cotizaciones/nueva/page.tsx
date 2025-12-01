"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"

interface QuotationItem {
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export default function NuevaCotizacionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<QuotationItem[]>([{ description: "", quantity: 1, unitPrice: 0, total: 0 }])

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, unitPrice: 0, total: 0 }])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: keyof QuotationItem, value: string | number) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }

    if (field === "quantity" || field === "unitPrice") {
      newItems[index].total = newItems[index].quantity * newItems[index].unitPrice
    }

    setItems(newItems)
  }

  const subtotal = items.reduce((sum, item) => sum + item.total, 0)
  const iva = subtotal * 0.21
  const total = subtotal + iva

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      const response = await fetch("/api/quotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName: formData.get("projectName"),
          clientInfo: {
            name: formData.get("clientName"),
            email: formData.get("clientEmail"),
            phone: formData.get("clientPhone"),
            address: formData.get("clientAddress"),
          },
          items,
          subtotal,
          taxes: iva,
          total,
          validUntil: formData.get("validUntil"),
          notes: formData.get("notes"),
        }),
      })

      if (response.ok) {
        router.push("/dashboard/cotizaciones")
      } else {
        alert("Error al crear cotización")
      }
    } catch (error) {
      alert("Error al crear cotización")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Nueva Cotización</h1>
          <p className="text-muted-foreground">Crea una nueva cotización para un cliente</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Información del Proyecto</CardTitle>
            <CardDescription>Datos básicos del proyecto a cotizar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="projectName">Nombre del Proyecto *</Label>
              <Input id="projectName" name="projectName" placeholder="Ej: Construcción Casa Moderna" required />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="validUntil">Válida Hasta *</Label>
                <Input id="validUntil" name="validUntil" type="date" required />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Información del Cliente</CardTitle>
            <CardDescription>Datos de contacto del cliente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Nombre Completo *</Label>
                <Input id="clientName" name="clientName" placeholder="Juan Pérez" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientEmail">Email *</Label>
                <Input id="clientEmail" name="clientEmail" type="email" placeholder="juan@example.com" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientPhone">Teléfono *</Label>
                <Input id="clientPhone" name="clientPhone" placeholder="+54 9 11 1234-5678" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientAddress">Dirección</Label>
                <Input id="clientAddress" name="clientAddress" placeholder="Av. Siempre Viva 123" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Ítems de la Cotización</CardTitle>
                <CardDescription>Agrega los servicios o productos a cotizar</CardDescription>
              </div>
              <Button type="button" onClick={addItem} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Ítem
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="grid md:grid-cols-12 gap-4 items-end border-b pb-4">
                <div className="md:col-span-5 space-y-2">
                  <Label>Descripción *</Label>
                  <Input
                    placeholder="Descripción del servicio"
                    value={item.description}
                    onChange={(e) => updateItem(index, "description", e.target.value)}
                    required
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label>Cantidad *</Label>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, "quantity", Number.parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label>Precio Unit. *</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(index, "unitPrice", Number.parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label>Total</Label>
                  <Input value={`$${item.total.toFixed(2)}`} disabled />
                </div>

                <div className="md:col-span-1">
                  {items.length > 1 && (
                    <Button type="button" variant="destructive" size="icon" onClick={() => removeItem(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}

            <div className="flex flex-col items-end space-y-2 pt-4">
              <div className="flex justify-between w-full md:w-1/3">
                <span className="font-medium">Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between w-full md:w-1/3">
                <span className="font-medium">IVA (21%):</span>
                <span>${iva.toFixed(2)}</span>
              </div>
              <div className="flex justify-between w-full md:w-1/3 text-lg font-bold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notas Adicionales</CardTitle>
            <CardDescription>Información extra sobre la cotización</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea name="notes" placeholder="Ej: Incluye materiales, mano de obra y transporte..." rows={4} />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Creando..." : "Crear Cotización"}
          </Button>
        </div>
      </form>
    </div>
  )
}
