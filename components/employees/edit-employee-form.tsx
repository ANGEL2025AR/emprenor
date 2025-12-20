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

interface EditEmployeeFormProps {
  employee: any
}

export default function EditEmployeeForm({ employee }: EditEmployeeFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      position: formData.get("position"),
      department: formData.get("department"),
      salary: Number.parseFloat(formData.get("salary") as string),
      hireDate: formData.get("hireDate"),
      status: formData.get("status"),
      address: formData.get("address"),
      emergencyContact: formData.get("emergencyContact"),
    }

    try {
      const response = await fetch(`/api/employees/${employee._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast({
          title: "Empleado actualizado",
          description: "Los datos del empleado se han actualizado correctamente",
        })
        router.push(`/dashboard/empleados/${employee._id}`)
        router.refresh()
      } else {
        throw new Error("Error al actualizar")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron actualizar los datos del empleado",
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
            <Link href={`/dashboard/empleados/${employee._id}`}>
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <CardTitle>Editar Empleado</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nombre Completo *</Label>
              <Input id="name" name="name" defaultValue={employee.name} required />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input id="email" name="email" type="email" defaultValue={employee.email} required />
            </div>

            <div>
              <Label htmlFor="phone">Teléfono *</Label>
              <Input id="phone" name="phone" defaultValue={employee.phone} required />
            </div>

            <div>
              <Label htmlFor="position">Cargo *</Label>
              <Input id="position" name="position" defaultValue={employee.position} required />
            </div>

            <div>
              <Label htmlFor="department">Departamento *</Label>
              <Select name="department" defaultValue={employee.department}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="construccion">Construcción</SelectItem>
                  <SelectItem value="administracion">Administración</SelectItem>
                  <SelectItem value="ventas">Ventas</SelectItem>
                  <SelectItem value="operaciones">Operaciones</SelectItem>
                  <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="salary">Salario</Label>
              <Input id="salary" name="salary" type="number" step="0.01" defaultValue={employee.salary} />
            </div>

            <div>
              <Label htmlFor="hireDate">Fecha de Contratación *</Label>
              <Input
                id="hireDate"
                name="hireDate"
                type="date"
                defaultValue={employee.hireDate?.split("T")[0]}
                required
              />
            </div>

            <div>
              <Label htmlFor="status">Estado *</Label>
              <Select name="status" defaultValue={employee.status}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                  <SelectItem value="vacaciones">Vacaciones</SelectItem>
                  <SelectItem value="licencia">Licencia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="address">Dirección</Label>
            <Textarea id="address" name="address" defaultValue={employee.address} rows={2} />
          </div>

          <div>
            <Label htmlFor="emergencyContact">Contacto de Emergencia</Label>
            <Input id="emergencyContact" name="emergencyContact" defaultValue={employee.emergencyContact} />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Guardando..." : "Guardar Cambios"}
            </Button>
            <Link href={`/dashboard/empleados/${employee._id}`}>
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
