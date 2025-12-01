"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"

export default function NuevaAutomatizacionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    trigger: "quotation_created",
    action: "send_email",
    frequency: "instant",
    recipientType: "client",
    emailTemplate: "",
    isActive: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/automations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          createdAt: new Date(),
          executionCount: 0,
          lastExecuted: null,
        }),
      })

      if (response.ok) {
        router.push("/dashboard/automatizaciones")
      } else {
        alert("Error al crear automatización")
      }
    } catch (error) {
      console.error("Error creating automation:", error)
      alert("Error al crear automatización")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/automatizaciones">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Nueva Automatización</h1>
          <p className="text-slate-600">Configure una nueva automatización para optimizar sus procesos</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Configuración de Automatización</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la Automatización</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Enviar presupuesto automáticamente"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="trigger">Evento Disparador</Label>
                <Select
                  value={formData.trigger}
                  onValueChange={(value) => setFormData({ ...formData, trigger: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quotation_created">Nueva Cotización Creada</SelectItem>
                    <SelectItem value="quotation_approved">Cotización Aprobada</SelectItem>
                    <SelectItem value="payment_received">Pago Recibido</SelectItem>
                    <SelectItem value="payment_overdue">Pago Vencido</SelectItem>
                    <SelectItem value="project_completed">Proyecto Completado</SelectItem>
                    <SelectItem value="task_completed">Tarea Completada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="action">Acción a Ejecutar</Label>
                <Select value={formData.action} onValueChange={(value) => setFormData({ ...formData, action: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="send_email">Enviar Email</SelectItem>
                    <SelectItem value="send_sms">Enviar SMS</SelectItem>
                    <SelectItem value="create_task">Crear Tarea</SelectItem>
                    <SelectItem value="update_status">Actualizar Estado</SelectItem>
                    <SelectItem value="generate_report">Generar Reporte</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Frecuencia</Label>
                <Select
                  value={formData.frequency}
                  onValueChange={(value) => setFormData({ ...formData, frequency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instant">Instantánea</SelectItem>
                    <SelectItem value="daily">Diaria</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="monthly">Mensual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipientType">Tipo de Destinatario</Label>
                <Select
                  value={formData.recipientType}
                  onValueChange={(value) => setFormData({ ...formData, recipientType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">Cliente</SelectItem>
                    <SelectItem value="employee">Empleado</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="supplier">Proveedor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describa el propósito de esta automatización"
                  rows={3}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="emailTemplate">Plantilla de Email (opcional)</Label>
                <Textarea
                  id="emailTemplate"
                  value={formData.emailTemplate}
                  onChange={(e) => setFormData({ ...formData, emailTemplate: e.target.value })}
                  placeholder="Use {nombre}, {proyecto}, {monto} como variables"
                  rows={6}
                />
                <p className="text-sm text-slate-500">Variables disponibles: nombre, proyecto, monto, fecha, estado</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/automatizaciones">Cancelar</Link>
              </Button>
              <Button type="submit" disabled={loading}>
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Creando..." : "Crear Automatización"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
