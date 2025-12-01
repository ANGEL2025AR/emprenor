import { notFound, redirect } from "next/navigation"
import { getDb } from "@/lib/db/connection"
import { ObjectId } from "mongodb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Mail, Phone, Briefcase, Calendar, MapPin, Edit, Trash2 } from "lucide-react"
import { getCurrentUser } from "@/lib/auth/session"

async function getEmployee(id: string) {
  try {
    const db = await getDb()
    const employee = await db.collection("employees").findOne({ _id: new ObjectId(id) })

    if (!employee) return null

    return {
      _id: employee._id.toString(),
      name: employee.name,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      position: employee.position,
      department: employee.department,
      salary: employee.salary,
      hireDate: employee.hireDate?.toISOString().split("T")[0],
      address: employee.address,
      emergencyContact: employee.emergencyContact,
      status: employee.status || "activo",
      createdAt: employee.createdAt?.toISOString(),
    }
  } catch {
    return null
  }
}

export default async function EmpleadoDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const { id } = await params
  const employee = await getEmployee(id)

  if (!employee) notFound()

  const statusColors: Record<string, string> = {
    activo: "bg-green-100 text-green-800",
    inactivo: "bg-gray-100 text-gray-800",
    suspendido: "bg-red-100 text-red-800",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/empleados">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {employee.name} {employee.lastName}
            </h1>
            <p className="text-slate-600">{employee.position}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/empleados/${id}/editar`}>
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Link>
          </Button>
          <Button variant="destructive">
            <Trash2 className="w-4 h-4 mr-2" />
            Eliminar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600">Nombre Completo</p>
                  <p className="font-medium">
                    {employee.name} {employee.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Estado</p>
                  <Badge className={statusColors[employee.status]}>{employee.status}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-500" />
                  <div>
                    <p className="text-sm text-slate-600">Email</p>
                    <p className="font-medium">{employee.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-500" />
                  <div>
                    <p className="text-sm text-slate-600">Teléfono</p>
                    <p className="font-medium">{employee.phone}</p>
                  </div>
                </div>
                {employee.address && (
                  <div className="flex items-center gap-2 col-span-2">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="text-sm text-slate-600">Dirección</p>
                      <p className="font-medium">{employee.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Información Laboral</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-slate-500" />
                  <div>
                    <p className="text-sm text-slate-600">Cargo</p>
                    <p className="font-medium">{employee.position}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Departamento</p>
                  <p className="font-medium">{employee.department || "No asignado"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <div>
                    <p className="text-sm text-slate-600">Fecha de Ingreso</p>
                    <p className="font-medium">{employee.hireDate}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Salario</p>
                  <p className="font-medium">${employee.salary?.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {employee.emergencyContact && (
            <Card>
              <CardHeader>
                <CardTitle>Contacto de Emergencia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600">Nombre</p>
                    <p className="font-medium">{employee.emergencyContact.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Relación</p>
                    <p className="font-medium">{employee.emergencyContact.relationship}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Teléfono</p>
                    <p className="font-medium">{employee.emergencyContact.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-slate-600">Proyectos Asignados</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Tareas Completadas</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Antigüedad</p>
                <p className="text-2xl font-bold">
                  {Math.floor(
                    (new Date().getTime() - new Date(employee.hireDate!).getTime()) / (1000 * 60 * 60 * 24 * 365),
                  )}{" "}
                  años
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
