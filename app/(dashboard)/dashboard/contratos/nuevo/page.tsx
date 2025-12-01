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

interface PaymentTerm {
  percentage: number
  description: string
  dueDate: string
}

export default function NuevoContratoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [paymentTerms, setPaymentTerms] = useState<PaymentTerm[]>([
    { percentage: 30, description: "Anticipo", dueDate: "" },
    { percentage: 40, description: "Avance de obra 50%", dueDate: "" },
    { percentage: 30, description: "Finalización", dueDate: "" },
  ])

  const addPaymentTerm = () => {
    setPaymentTerms([...paymentTerms, { percentage: 0, description: "", dueDate: "" }])
  }

  const removePaymentTerm = (index: number) => {
    setPaymentTerms(paymentTerms.filter((_, i) => i !== index))
  }

  const updatePaymentTerm = (index: number, field: keyof PaymentTerm, value: string | number) => {
    const newTerms = [...paymentTerms]
    newTerms[index] = { ...newTerms[index], [field]: value }
    setPaymentTerms(newTerms)
  }

  const totalPercentage = paymentTerms.reduce((sum, term) => sum + term.percentage, 0)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (totalPercentage !== 100) {
      alert("Los porcentajes de pago deben sumar 100%")
      return
    }

    setLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      const response = await fetch("/api/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName: formData.get("projectName"),
          clientInfo: {
            name: formData.get("clientName"),
            email: formData.get("clientEmail"),
            phone: formData.get("clientPhone"),
            address: formData.get("clientAddress"),
            dni: formData.get("clientDNI"),
          },
          amount: Number.parseFloat(formData.get("amount") as string),
          startDate: formData.get("startDate"),
          endDate: formData.get("endDate"),
          paymentTerms,
          scope: formData.get("scope"),
          deliverables: (formData.get("deliverables") as string)?.split("\n").filter((d) => d.trim()),
          warranties: formData.get("warranties"),
          penaltyClause: formData.get("penaltyClause"),
        }),
      })

      if (response.ok) {
        router.push("/dashboard/contratos")
      } else {
        alert("Error al crear contrato")
      }
    } catch (error) {
      alert("Error al crear contrato")
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
          <h1 className="text-3xl font-bold">Nuevo Contrato</h1>
          <p className="text-muted-foreground">Crea un nuevo contrato de construcción</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Información del Proyecto</CardTitle>
            <CardDescription>Datos básicos del proyecto a contratar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="projectName">Nombre del Proyecto *</Label>
              <Input id="projectName" name="projectName" placeholder="Ej: Construcción Casa Moderna" required />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Monto Total (ARS) *</Label>
                <Input id="amount" name="amount" type="number" min="0" step="0.01" placeholder="1000000.00" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Fecha de Inicio *</Label>
                <Input id="startDate" name="startDate" type="date" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Fecha de Fin Estimada *</Label>
                <Input id="endDate" name="endDate" type="date" required />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Información del Cliente</CardTitle>
            <CardDescription>Datos legales del contratante</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Nombre Completo / Razón Social *</Label>
                <Input id="clientName" name="clientName" placeholder="Juan Pérez" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientDNI">DNI / CUIT *</Label>
                <Input id="clientDNI" name="clientDNI" placeholder="20-12345678-9" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientEmail">Email *</Label>
                <Input id="clientEmail" name="clientEmail" type="email" placeholder="juan@example.com" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientPhone">Teléfono *</Label>
                <Input id="clientPhone" name="clientPhone" placeholder="+54 9 11 1234-5678" required />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="clientAddress">Dirección *</Label>
                <Input
                  id="clientAddress"
                  name="clientAddress"
                  placeholder="Av. Siempre Viva 123, Salta, Argentina"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alcance del Proyecto</CardTitle>
            <CardDescription>Define qué incluye el contrato</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="scope">Descripción del Alcance *</Label>
              <Textarea
                id="scope"
                name="scope"
                placeholder="Ej: Construcción completa de vivienda unifamiliar de 120m2, incluyendo instalaciones eléctricas, sanitarias y terminaciones..."
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliverables">Entregables (uno por línea)</Label>
              <Textarea
                id="deliverables"
                name="deliverables"
                placeholder={
                  "Planos aprobados\nPermisos municipales\nObra terminada con certificado final\nGarantía de construcción"
                }
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Términos de Pago</CardTitle>
                <CardDescription>Define cómo se realizarán los pagos (debe sumar 100%)</CardDescription>
              </div>
              <Button type="button" onClick={addPaymentTerm} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Pago
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {paymentTerms.map((term, index) => (
              <div key={index} className="grid md:grid-cols-12 gap-4 items-end border-b pb-4">
                <div className="md:col-span-2 space-y-2">
                  <Label>Porcentaje % *</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={term.percentage}
                    onChange={(e) => updatePaymentTerm(index, "percentage", Number.parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="md:col-span-5 space-y-2">
                  <Label>Descripción *</Label>
                  <Input
                    placeholder="Ej: Anticipo, Avance 50%, Final"
                    value={term.description}
                    onChange={(e) => updatePaymentTerm(index, "description", e.target.value)}
                    required
                  />
                </div>

                <div className="md:col-span-4 space-y-2">
                  <Label>Fecha de Vencimiento</Label>
                  <Input
                    type="date"
                    value={term.dueDate}
                    onChange={(e) => updatePaymentTerm(index, "dueDate", e.target.value)}
                  />
                </div>

                <div className="md:col-span-1">
                  {paymentTerms.length > 1 && (
                    <Button type="button" variant="destructive" size="icon" onClick={() => removePaymentTerm(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}

            <div className={`text-right font-semibold ${totalPercentage === 100 ? "text-green-600" : "text-red-600"}`}>
              Total: {totalPercentage}% {totalPercentage !== 100 && "(debe ser 100%)"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cláusulas Adicionales</CardTitle>
            <CardDescription>Garantías y penalizaciones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="warranties">Garantías</Label>
              <Textarea
                id="warranties"
                name="warranties"
                placeholder="Ej: 2 años de garantía estructural, 1 año en instalaciones..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="penaltyClause">Cláusula de Penalización</Label>
              <Textarea
                id="penaltyClause"
                name="penaltyClause"
                placeholder="Ej: Por cada día de retraso se aplicará una penalización del 0.1% del monto total..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Creando..." : "Crear Contrato"}
          </Button>
        </div>
      </form>
    </div>
  )
}
