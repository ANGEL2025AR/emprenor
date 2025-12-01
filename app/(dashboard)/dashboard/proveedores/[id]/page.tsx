import { notFound, redirect } from "next/navigation"
import { getDb } from "@/lib/db/connection"
import { ObjectId } from "mongodb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Mail, Phone, Building, Globe, MapPin, Edit, Trash2, DollarSign } from "lucide-react"
import { getCurrentUser } from "@/lib/auth/session"

async function getSupplier(id: string) {
  try {
    const db = await getDb()
    const supplier = await db.collection("suppliers").findOne({ _id: new ObjectId(id) })

    if (!supplier) return null

    return {
      _id: supplier._id.toString(),
      name: supplier.name,
      contactName: supplier.contactName,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      city: supplier.city,
      country: supplier.country,
      website: supplier.website,
      category: supplier.category,
      rating: supplier.rating || 0,
      totalOrders: supplier.totalOrders || 0,
      totalSpent: supplier.totalSpent || 0,
      status: supplier.status || "activo",
      notes: supplier.notes,
      createdAt: supplier.createdAt?.toISOString(),
    }
  } catch {
    return null
  }
}

export default async function ProveedorDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const { id } = await params
  const supplier = await getSupplier(id)

  if (!supplier) notFound()

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
            <Link href="/dashboard/proveedores">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{supplier.name}</h1>
            <p className="text-slate-600">{supplier.category}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/proveedores/${id}/editar`}>
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
              <CardTitle>Información de Contacto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600">Nombre de la Empresa</p>
                  <p className="font-medium">{supplier.name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Estado</p>
                  <Badge className={statusColors[supplier.status]}>{supplier.status}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-slate-500" />
                  <div>
                    <p className="text-sm text-slate-600">Contacto Principal</p>
                    <p className="font-medium">{supplier.contactName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-500" />
                  <div>
                    <p className="text-sm text-slate-600">Email</p>
                    <p className="font-medium">{supplier.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-500" />
                  <div>
                    <p className="text-sm text-slate-600">Teléfono</p>
                    <p className="font-medium">{supplier.phone}</p>
                  </div>
                </div>
                {supplier.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="text-sm text-slate-600">Sitio Web</p>
                      <a
                        href={supplier.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {supplier.website}
                      </a>
                    </div>
                  </div>
                )}
                {supplier.address && (
                  <div className="flex items-center gap-2 col-span-2">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="text-sm text-slate-600">Dirección</p>
                      <p className="font-medium">
                        {supplier.address}, {supplier.city}, {supplier.country}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {supplier.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 whitespace-pre-wrap">{supplier.notes}</p>
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
                <p className="text-sm text-slate-600">Total de Órdenes</p>
                <p className="text-2xl font-bold">{supplier.totalOrders}</p>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-slate-600">Total Gastado</p>
                  <p className="text-2xl font-bold">${supplier.totalSpent.toLocaleString()}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-600">Calificación</p>
                <div className="flex items-center gap-1">
                  <p className="text-2xl font-bold">{supplier.rating}</p>
                  <span className="text-slate-500">/5</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
