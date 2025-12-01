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
import { ArrowLeft, UserPlus } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function NuevoEmpleadoPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name"),
      position: formData.get("position"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      dni: formData.get("dni"),
      address: formData.get("address"),
      salary: Number.parseFloat(formData.get("salary") as string),
      hireDate: formData.get("hireDate"),
      emergencyContact: formData.get("emergencyContact"),
      emergencyPhone: formData.get("emergencyPhone"),
      notes: formData.get("notes"),
    }

    try {
      const response = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error("Error al crear el empleado")

      toast({
        title: "Empleado registrado",
        description: "El empleado se ha registrado correctamente",
      })

      router.push("/dashboard/empleados")
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo registrar el empleado",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/empleados">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nuevo Empleado</h1>
          <p className="text-muted-foreground">Registre un nuevo empleado</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Información del Empleado
            </CardTitle>
            <CardDescription>Complete los datos del empleado</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo *</Label>
                <Input id="name" name="name" required placeholder="Nombre y apellido" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Cargo / Puesto *</Label>
                <Select name="position" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="obrero">Obrero</SelectItem>
                    <SelectItem value="oficial">Oficial</SelectItem>
                    <SelectItem value="capataz">Capataz</SelectItem>
                    <SelectItem value="maestro_mayor">Maestro Mayor de Obras</SelectItem>
                    <SelectItem value="arquitecto">Arquitecto</SelectItem>
                    <SelectItem value="ingeniero">Ingeniero</SelectItem>
                    <SelectItem value="electricista">Electricista</SelectItem>
                    <SelectItem value="plomero">Plomero</SelectItem>
                    <SelectItem value="pintor">Pintor</SelectItem>
                    <SelectItem value="administrativo">Administrativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" name="email" type="email" required placeholder="empleado@email.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono *</Label>
                <Input id="phone" name="phone" type="tel" required placeholder="+54 11 1234-5678" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dni">DNI *</Label>
                <Input id="dni" name="dni" required placeholder="12345678" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hireDate">Fecha de Ingreso *</Label>
                <Input
                  id="hireDate"
                  name="hireDate"
                  type="date"
                  required
                  defaultValue={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary">Salario Mensual</Label>
                <Input id="salary" name="salary" type="number" step="0.01" placeholder="0.00" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Dirección</Label>
                <Input id="address" name="address" placeholder="Calle, número, ciudad, provincia" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Contacto de Emergencia</Label>
                <Input id="emergencyContact" name="emergencyContact" placeholder="Nombre del contacto" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Teléfono de Emergencia</Label>
                <Input id="emergencyPhone" name="emergencyPhone" type="tel" placeholder="+54 11 1234-5678" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notas / Observaciones</Label>
              <Textarea id="notes" name="notes" placeholder="Información adicional sobre el empleado..." rows={4} />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Registrando..." : "Registrar Empleado"}
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
