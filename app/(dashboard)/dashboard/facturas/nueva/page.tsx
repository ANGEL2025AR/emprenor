"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"

interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export default function NuevaFacturaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [invoiceType, setInvoiceType] = useState<"A" | "B" | "C">("B")
  const [items, setItems] = useState<InvoiceItem[]>([{ description: "", quantity: 1, unitPrice: 0, total: 0 }])

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, unitPrice: 0, total: 0 }])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }

    if (field === "quantity" || field === "unitPrice") {
      newItems[index].total = newItems[index].quantity * newItems[index].unitPrice
    }

    setItems(newItems)
  }

  const subtotal = items.reduce((sum, item) => sum + item.total, 0)
  const iva = invoiceType === "A" ? 0 : subtotal * 0.21 // IVA solo para B y C
  const total = subtotal + iva

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceNumber: `${invoiceType}-${formData.get("invoiceNumber")}`,
          invoiceType,
          clientInfo: {
            name: formData.get("clientName"),
            cuitCuil: formData.get("clientCUIT"),
            address: formData.get("clientAddress"),
            fiscalCondition: formData.get("fiscalCondition"),
          },
          projectName: formData.get("projectName"),
          items,
          subtotal,
          taxes: iva,
          total,
          dueDate: formData.get("dueDate"),
          notes: formData.get("notes"),
        }),
      })

      if (response.ok) {
        router.push("/dashboard/facturas")
      } else {
        alert("Error al crear factura")
      }
    } catch (error) {
      alert("Error al crear factura")
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
          <h1 className="text-3xl font-bold">Nueva Factura</h1>
          <p className="text-muted-foreground">Emite una nueva factura AFIP</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Datos de la Factura</CardTitle>
            <CardDescription>Información fiscal según AFIP</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="invoiceType">Tipo de Factura *</Label>
                <Select value={invoiceType} onValueChange={(value: any) => setInvoiceType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Factura A (IVA discriminado)</SelectItem>
                    <SelectItem value="B">Factura B (IVA incluido)</SelectItem>
                    <SelectItem value="C">Factura C (sin IVA)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="invoiceNumber">Número de Factura *</Label>
                <Input id="invoiceNumber" name="invoiceNumber" placeholder="00001-00000123" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Fecha de Vencimiento *</Label>
                <Input id="dueDate" name="dueDate" type="date" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectName">Proyecto Asociado</Label>
              <Input id="projectName" name="projectName" placeholder="Nombre del proyecto" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Información del Cliente</CardTitle>
            <CardDescription>Datos fiscales del cliente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Razón Social / Nombre *</Label>
                <Input id="clientName" name="clientName" placeholder="Juan Pérez / Empresa SA" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientCUIT">CUIT / CUIL *</Label>
                <Input id="clientCUIT" name="clientCUIT" placeholder="20-12345678-9" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fiscalCondition">Condición Fiscal *</Label>
                <Select name="fiscalCondition" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="responsable_inscripto">Responsable Inscripto</SelectItem>
                    <SelectItem value="monotributo">Monotributo</SelectItem>
                    <SelectItem value="exento">Exento</SelectItem>
                    <SelectItem value="consumidor_final">Consumidor Final</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientAddress">Dirección *</Label>
                <Input id="clientAddress" name="clientAddress" placeholder="Calle 123, Salta, Argentina" required />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Ítems de la Factura</CardTitle>
                <CardDescription>Servicios o productos facturados</CardDescription>
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
                    placeholder="Descripción del servicio/producto"
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
              {invoiceType !== "A" && (
                <div className="flex justify-between w-full md:w-1/3">
                  <span className="font-medium">IVA (21%):</span>
                  <span>${iva.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between w-full md:w-1/3 text-lg font-bold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              {invoiceType === "A" && <p className="text-sm text-muted-foreground">* Factura A - IVA discriminado</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Observaciones</CardTitle>
            <CardDescription>Notas adicionales en la factura</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea name="notes" placeholder="Ej: Forma de pago: transferencia bancaria..." rows={3} />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Creando..." : "Emitir Factura"}
          </Button>
        </div>
      </form>
    </div>
  )
}
