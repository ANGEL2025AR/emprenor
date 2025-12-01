"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { UserCheck, Search, Plus, Phone, Mail, Briefcase, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface Employee {
  _id: string
  name: string
  lastName: string
  role: string
  specialty?: string
  contact: {
    phone?: string
    email?: string
  }
  status: string
  hireDate?: string
}

export default function EmployeesClient() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadEmployees()
  }, [])

  const loadEmployees = async () => {
    try {
      const response = await fetch("/api/employees")
      if (response.ok) {
        const data = await response.json()
        setEmployees(data.employees || [])
      }
    } catch (error) {
      console.error("[v0] Error loading employees:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/employees/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Empleado eliminado",
          description: "El empleado ha sido eliminado exitosamente",
        })
        loadEmployees()
      } else {
        throw new Error("Error al eliminar")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el empleado",
        variant: "destructive",
      })
    } finally {
      setDeleteId(null)
    }
  }

  const filteredEmployees = employees.filter(
    (emp) =>
      `${emp.name || ""} ${emp.lastName || ""}`.toLowerCase().includes(search.toLowerCase()) ||
      emp.role?.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5" />
            Personal Activo
          </CardTitle>
          <Button asChild>
            <Link href="/dashboard/empleados/nuevo">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Empleado
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Buscar empleados..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-slate-600 text-center py-8">Cargando empleados...</p>
        ) : filteredEmployees.length === 0 ? (
          <p className="text-slate-600 text-center py-8">No se encontraron empleados</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEmployees.map((emp) => (
              <Card key={emp._id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {emp.name} {emp.lastName}
                        </h3>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline">{emp.role}</Badge>
                          <Badge className={emp.status === "activo" ? "bg-green-500" : "bg-slate-400"}>
                            {emp.status}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(emp._id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {emp.specialty && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Briefcase className="w-4 h-4" />
                        {emp.specialty}
                      </div>
                    )}

                    {emp.contact && (
                      <div className="space-y-1 text-sm">
                        {emp.contact.phone && (
                          <div className="flex items-center gap-2 text-slate-600">
                            <Phone className="w-4 h-4" />
                            {emp.contact.phone}
                          </div>
                        )}
                        {emp.contact.email && (
                          <div className="flex items-center gap-2 text-slate-600">
                            <Mail className="w-4 h-4" />
                            {emp.contact.email}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El empleado será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
