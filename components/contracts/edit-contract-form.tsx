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

interface EditContractFormProps {
  contract: any
}

export default function EditContractForm({ contract }: EditContractFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      projectId: formData.get("projectId"),
      clientId: formData.get("clientId"),
      title: formData.get("title"),
      description: formData.get("description"),
      value: Number.parseFloat(formData.get("value") as string),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
      status: formData.get("status"),
      terms: formData.get("terms"),
    }

    try {
      const response = await fetch(`/api/contracts/${contract._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast({
          title: "Contrato actualizado",
          description: "El contrato se ha actualizado correctamente",
        })
        router.push(`/dashboard/contratos/${contract._id}`)
        router.refresh()
      } else {
        throw new Error("Error al actualizar")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el contrato",
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
            <Link href={`/dashboard/contratos/${contract._id}`}>
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <CardTitle>Editar Contrato</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Título del Contrato *</Label>
              <Input id="title" name="title" defaultValue={contract.title} required />
            </div>

            <div>
              <Label htmlFor="value">Valor del Contrato *</Label>
              <Input id="value" name="value" type="number" step="0.01" defaultValue={contract.value} required />
            </div>

            <div>
              <Label htmlFor="startDate">Fecha de Inicio *</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                defaultValue={contract.startDate?.split("T")[0]}
                required
              />
            </div>

            <div>
              <Label htmlFor="endDate">Fecha de Fin *</Label>
              <Input id="endDate" name="endDate" type="date" defaultValue={contract.endDate?.split("T")[0]} required />
            </div>

            <div>
              <Label htmlFor="status">Estado *</Label>
              <Select name="status" defaultValue={contract.status}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="borrador">Borrador</SelectItem>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="finalizado">Finalizado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" name="description" defaultValue={contract.description} rows={4} />
          </div>

          <div>
            <Label htmlFor="terms">Términos y Condiciones</Label>
            <Textarea id="terms" name="terms" defaultValue={contract.terms} rows={6} />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Guardando..." : "Guardar Cambios"}
            </Button>
            <Link href={`/dashboard/contratos/${contract._id}`}>
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
