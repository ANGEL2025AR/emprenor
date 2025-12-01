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
import { ArrowLeft, DollarSign } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function NuevoPagoPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      invoiceId: formData.get("invoiceId"),
      projectId: formData.get("projectId"),
      amount: Number.parseFloat(formData.get("amount") as string),
      paymentMethod: formData.get("paymentMethod"),
      paymentDate: formData.get("paymentDate"),
      transactionId: formData.get("transactionId"),
      notes: formData.get("notes"),
      status: "completed",
    }

    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error("Error al crear el pago")

      toast({
        title: "Pago registrado",
        description: "El pago se ha registrado correctamente",
      })

      router.push("/dashboard/pagos")
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo registrar el pago",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/pagos">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Registrar Nuevo Pago</h1>
          <p className="text-muted-foreground">Complete los datos del pago recibido</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Información del Pago
            </CardTitle>
            <CardDescription>Ingrese los detalles del pago recibido</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="invoiceId">ID de Factura (Opcional)</Label>
                <Input id="invoiceId" name="invoiceId" placeholder="Ej: 001-00000123" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectId">ID de Proyecto (Opcional)</Label>
                <Input id="projectId" name="projectId" placeholder="Ingrese ObjectId del proyecto" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Monto *</Label>
                <Input id="amount" name="amount" type="number" step="0.01" required placeholder="0.00" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Método de Pago *</Label>
                <Select name="paymentMethod" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione método" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="efectivo">Efectivo</SelectItem>
                    <SelectItem value="transferencia">Transferencia Bancaria</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                    <SelectItem value="tarjeta_credito">Tarjeta de Crédito</SelectItem>
                    <SelectItem value="tarjeta_debito">Tarjeta de Débito</SelectItem>
                    <SelectItem value="mercadopago">Mercado Pago</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentDate">Fecha de Pago *</Label>
                <Input
                  id="paymentDate"
                  name="paymentDate"
                  type="date"
                  required
                  defaultValue={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="transactionId">ID de Transacción</Label>
                <Input id="transactionId" name="transactionId" placeholder="Número de operación o comprobante" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notas / Observaciones</Label>
              <Textarea id="notes" name="notes" placeholder="Información adicional sobre el pago..." rows={4} />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Registrando..." : "Registrar Pago"}
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
