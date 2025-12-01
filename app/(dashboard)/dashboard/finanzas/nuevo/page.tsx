"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, DollarSign, TrendingUp, TrendingDown } from "lucide-react"

export default function NuevaTransaccionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialType = searchParams.get("type") || "ingreso"

  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    type: initialType,
    amount: "",
    description: "",
    category: "",
    projectId: "",
    date: new Date().toISOString().split("T")[0],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          amount: Number.parseFloat(formData.amount),
        }),
      })

      if (response.ok) {
        router.push("/dashboard/finanzas")
      }
    } catch {
      // Error silencioso
    } finally {
      setIsLoading(false)
    }
  }

  const isIngreso = formData.type === "ingreso"

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/finanzas">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{isIngreso ? "Nuevo Ingreso" : "Nuevo Egreso"}</h1>
          <p className="text-slate-600">Registra una nueva transacción financiera</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${isIngreso ? "bg-green-100" : "bg-red-100"}`}
            >
              {isIngreso ? (
                <TrendingUp className="w-5 h-5 text-green-600" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-600" />
              )}
            </div>
            <div>
              <CardTitle>Información de la Transacción</CardTitle>
              <CardDescription>Completa los detalles de la transacción</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Transacción *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ingreso">Ingreso</SelectItem>
                    <SelectItem value="egreso">Egreso</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Monto (ARS) *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="pl-10"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoría *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {isIngreso ? (
                      <>
                        <SelectItem value="pago_cliente">Pago de Cliente</SelectItem>
                        <SelectItem value="anticipo">Anticipo</SelectItem>
                        <SelectItem value="financiamiento">Financiamiento</SelectItem>
                        <SelectItem value="otros_ingresos">Otros Ingresos</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="materiales">Materiales</SelectItem>
                        <SelectItem value="mano_obra">Mano de Obra</SelectItem>
                        <SelectItem value="equipos">Equipos</SelectItem>
                        <SelectItem value="transporte">Transporte</SelectItem>
                        <SelectItem value="servicios">Servicios</SelectItem>
                        <SelectItem value="impuestos">Impuestos</SelectItem>
                        <SelectItem value="otros_gastos">Otros Gastos</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Fecha *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Descripción *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe la transacción..."
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/finanzas">Cancelar</Link>
              </Button>
              <Button
                type="submit"
                className={isIngreso ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
                disabled={isLoading}
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? "Guardando..." : `Registrar ${isIngreso ? "Ingreso" : "Egreso"}`}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
