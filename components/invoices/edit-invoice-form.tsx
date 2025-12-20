"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface EditInvoiceFormProps {
  invoice: any
}

export default function EditInvoiceForm({ invoice }: EditInvoiceFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      clientId: formData.get("clientId"),
      projectId: formData.get("projectId"),
      invoiceNumber: formData.get("invoiceNumber"),
      type: formData.get("type"),
      status: formData.get("status"),
      issueDate: formData.get("issueDate"),
      dueDate: formData.get("dueDate"),
    }

    try {
      const response = await fetch(`/api/invoices/${invoice._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast({
          title: "Factura actualizada",
          description: "La factura se ha actualizado correctamente",
        })
        router.push(`/dashboard/facturas/${invoice._id}`)
        router.refresh()
      } else {
        throw new Error("Error al actualizar")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la factura",
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
            <Link href={`/dashboard/facturas/${invoice._id}`}>
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <CardTitle>Editar Factura</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="invoiceNumber">Número de Factura *</Label>
              <Input id="invoiceNumber" name="invoiceNumber" defaultValue={invoice.invoiceNumber} required />
            </div>

            <div>
              <Label htmlFor="type">Tipo *</Label>
              <Select name="type" defaultValue={invoice.type}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Tipo A</SelectItem>
                  <SelectItem value="B">Tipo B</SelectItem>
                  <SelectItem value="C">Tipo C</SelectItem>
                  <SelectItem value="E">Tipo E</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="issueDate">Fecha de Emisión *</Label>
              <Input
                id="issueDate"
                name="issueDate"
                type="date"
                defaultValue={invoice.issueDate?.split("T")[0]}
                required
              />
            </div>

            <div>
              <Label htmlFor="dueDate">Fecha de Vencimiento *</Label>
              <Input id="dueDate" name="dueDate" type="date" defaultValue={invoice.dueDate?.split("T")[0]} required />
            </div>

            <div>
              <Label htmlFor="status">Estado *</Label>
              <Select name="status" defaultValue={invoice.status}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="borrador">Borrador</SelectItem>
                  <SelectItem value="enviada">Enviada</SelectItem>
                  <SelectItem value="pagada">Pagada</SelectItem>
                  <SelectItem value="vencida">Vencida</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Guardando..." : "Guardar Cambios"}
            </Button>
            <Link href={`/dashboard/facturas/${invoice._id}`}>
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
