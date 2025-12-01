"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"

interface QuotationItem {
  description: string
  quantity: number
  unitPrice: number
  unit: string
}

export default function EditQuotationForm({ quotation }: { quotation: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<QuotationItem[]>(quotation.items || [])

  const [formData, setFormData] = useState({
    code: quotation.code,
    projectName: quotation.projectName,
    status: quotation.status,
    validUntil: quotation.validUntil?.split("T")[0] || "",
    clientInfo: quotation.clientInfo || { name: "", email: "", phone: "", cuit: "" },
    notes: quotation.notes || "",
  })

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, unitPrice: 0, unit: "unidad" }])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/quotations/${quotation._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, items }),
      })

      if (response.ok) {
        router.push(`/dashboard/cotizaciones/${quotation._id}`)
      }
    } catch (error) {
      console.error("Error updating quotation:", error)
    } finally {
      setLoading(false)
    }
  }

  const total = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Editar Cotización</h1>
          <p className="text-muted-foreground">Actualiza los datos de la cotización</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Código</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Estado</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="borrador">Borrador</SelectItem>
                      <SelectItem value="enviada">Enviada</SelectItem>
                      <SelectItem value="aprobada">Aprobada</SelectItem>
                      <SelectItem value="rechazada">Rechazada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="projectName">Nombre del Proyecto</Label>
                  <Input
                    id="projectName"
                    value={formData.projectName}
                    onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="validUntil">Válida Hasta</Label>
                  <Input
                    id="validUntil"
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Información del Cliente</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Nombre</Label>
                  <Input
                    id="clientName"
                    value={formData.clientInfo.name}
                    onChange={(e) =>
                      setFormData({ ...formData, clientInfo: { ...formData.clientInfo, name: e.target.value } })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientEmail">Email</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={formData.clientInfo.email}
                    onChange={(e) =>
                      setFormData({ ...formData, clientInfo: { ...formData.clientInfo, email: e.target.value } })
                    }
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientPhone">Teléfono</Label>
                  <Input
                    id="clientPhone"
                    value={formData.clientInfo.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, clientInfo: { ...formData.clientInfo, phone: e.target.value } })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientCuit">CUIT</Label>
                  <Input
                    id="clientCuit"
                    value={formData.clientInfo.cuit}
                    onChange={(e) =>
                      setFormData({ ...formData, clientInfo: { ...formData.clientInfo, cuit: e.target.value } })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Items</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={addItem}>
                  <Plus className="h-4 w-4 mr-2" /> Agregar Item
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="flex gap-4 items-end p-4 border rounded-lg">
                  <div className="flex-[3] space-y-2">
                    <Label>Descripción</Label>
                    <Input
                      value={item.description}
                      onChange={(e) => {
                        const newItems = [...items]
                        newItems[index].description = e.target.value
                        setItems(newItems)
                      }}
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label>Cantidad</Label>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => {
                        const newItems = [...items]
                        newItems[index].quantity = Number(e.target.value)
                        setItems(newItems)
                      }}
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label>Precio Unit.</Label>
                    <Input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => {
                        const newItems = [...items]
                        newItems[index].unitPrice = Number(e.target.value)
                        setItems(newItems)
                      }}
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label>Subtotal</Label>
                    <Input disabled value={(item.quantity * item.unitPrice).toLocaleString()} />
                  </div>
                  {items.length > 1 && (
                    <Button type="button" variant="destructive" size="icon" onClick={() => removeItem(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <div className="flex justify-end pt-4 border-t">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">${total.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notas</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                rows={4}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Notas adicionales..."
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
