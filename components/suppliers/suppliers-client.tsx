"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Users, Search, Plus, Phone, Mail, MapPin, Trash2 } from "lucide-react"
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

interface Supplier {
  _id: string
  name: string
  category: string
  contact: {
    name?: string
    phone?: string
    email?: string
  }
  address?: string
  rating?: number
  status: string
}

export default function SuppliersClient() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadSuppliers()
  }, [])

  const loadSuppliers = async () => {
    try {
      const response = await fetch("/api/suppliers")
      if (response.ok) {
        const data = await response.json()
        setSuppliers(data.suppliers || [])
      }
    } catch (error) {
      console.error("[v0] Error loading suppliers:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/suppliers/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Proveedor eliminado",
          description: "El proveedor ha sido eliminado exitosamente",
        })
        loadSuppliers()
      } else {
        throw new Error("Error al eliminar")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el proveedor",
        variant: "destructive",
      })
    } finally {
      setDeleteId(null)
    }
  }

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name?.toLowerCase().includes(search.toLowerCase()) ||
      supplier.category?.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Lista de Proveedores
          </CardTitle>
          <Button asChild>
            <Link href="/dashboard/proveedores/nuevo">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Proveedor
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Buscar proveedores..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-slate-600 text-center py-8">Cargando proveedores...</p>
        ) : filteredSuppliers.length === 0 ? (
          <p className="text-slate-600 text-center py-8">No se encontraron proveedores</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSuppliers.map((supplier) => (
              <Card key={supplier._id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{supplier.name}</h3>
                        <Badge variant="outline" className="mt-1">
                          {supplier.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={supplier.status === "activo" ? "bg-green-500" : "bg-slate-400"}>
                          {supplier.status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(supplier._id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {supplier.contact && (
                      <div className="space-y-2 text-sm">
                        {supplier.contact.phone && (
                          <div className="flex items-center gap-2 text-slate-600">
                            <Phone className="w-4 h-4" />
                            {supplier.contact.phone}
                          </div>
                        )}
                        {supplier.contact.email && (
                          <div className="flex items-center gap-2 text-slate-600">
                            <Mail className="w-4 h-4" />
                            {supplier.contact.email}
                          </div>
                        )}
                        {supplier.address && (
                          <div className="flex items-center gap-2 text-slate-600">
                            <MapPin className="w-4 h-4" />
                            {supplier.address}
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
              Esta acción no se puede deshacer. El proveedor será eliminado permanentemente.
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
