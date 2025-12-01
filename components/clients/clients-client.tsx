"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Mail, Phone, MapPin, Building, Eye, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
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

interface Client {
  _id: string
  name: string
  email: string
  phone: string
  company?: string
  address: string
  cuit?: string
  taxCondition?: string
  projects: number
  totalInvoiced: number
  status: "activo" | "inactivo" | "prospecto"
  createdAt: string
}

export default function ClientsClient() {
  const [clients, setClients] = useState<Client[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const response = await fetch("/api/clients")
      if (response.ok) {
        const data = await response.json()
        setClients(data.clients || [])
      }
    } catch (error) {
      console.error("Error fetching clients:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredClients = clients.filter(
    (client) =>
      client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "activo":
        return "bg-green-100 text-green-800"
      case "inactivo":
        return "bg-gray-100 text-gray-800"
      case "prospecto":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/clients/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Cliente eliminado",
          description: "El cliente ha sido eliminado exitosamente",
        })
        fetchClients()
      } else {
        throw new Error("Error al eliminar")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el cliente",
        variant: "destructive",
      })
    } finally {
      setDeleteId(null)
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">Cargando clientes...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, email o empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button asChild>
          <Link href="/dashboard/clientes/nuevo">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Cliente
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <Card key={client._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{client.name}</CardTitle>
                  {client.company && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Building className="w-4 h-4" />
                      {client.company}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(client.status)}>{client.status}</Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteId(client._id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  {client.email}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  {client.phone}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {client.address}
                </div>
              </div>

              <div className="pt-4 border-t grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold">{client.projects}</div>
                  <div className="text-xs text-muted-foreground">Proyectos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">${client.totalInvoiced.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Facturado</div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                  <Link href={`/dashboard/clientes/${client._id}`}>
                    <Eye className="w-4 h-4 mr-1" />
                    Ver
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                  <Link href={`/dashboard/clientes/${client._id}/editar`}>
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">No se encontraron clientes</div>
      )}

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El cliente será eliminado permanentemente.
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
    </div>
  )
}
