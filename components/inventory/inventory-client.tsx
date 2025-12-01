"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Package, Search, Plus, AlertTriangle, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

interface InventoryItem {
  _id: string
  name: string
  category: string
  quantity: number
  unit: string
  minStock: number
  cost: number
  supplier?: string
  location?: string
}

export default function InventoryClient() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("todos")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadInventory()
  }, [])

  useEffect(() => {
    filterItems()
  }, [search, categoryFilter, items])

  const loadInventory = async () => {
    try {
      const response = await fetch("/api/inventory")
      if (response.ok) {
        const data = await response.json()
        setItems(data.items || [])
      }
    } catch (error) {
      console.error("[v0] Error loading inventory:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterItems = () => {
    let filtered = items

    if (search) {
      filtered = filtered.filter(
        (item) =>
          item.name?.toLowerCase().includes(search.toLowerCase()) ||
          item.category?.toLowerCase().includes(search.toLowerCase()),
      )
    }

    if (categoryFilter !== "todos") {
      filtered = filtered.filter((item) => item.category === categoryFilter)
    }

    setFilteredItems(filtered)
  }

  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity === 0) return { label: "Sin Stock", color: "bg-red-500" }
    if (item.quantity <= item.minStock) return { label: "Stock Bajo", color: "bg-amber-500" }
    return { label: "Stock OK", color: "bg-green-500" }
  }

  const categories = ["todos", "materiales", "herramientas", "equipos", "consumibles"]

  const lowStockItems = items.filter((item) => item.quantity <= item.minStock)

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/inventory/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Item eliminado",
          description: "El artículo ha sido eliminado del inventario",
        })
        loadInventory()
      } else {
        throw new Error("Error al eliminar")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el artículo",
        variant: "destructive",
      })
    } finally {
      setDeleteId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Alertas de stock bajo */}
      {lowStockItems.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-1" />
              <div>
                <h3 className="font-semibold text-amber-900">
                  {lowStockItems.length} {lowStockItems.length === 1 ? "artículo" : "artículos"} con stock bajo
                </h3>
                <p className="text-sm text-amber-700 mt-1">Revisa el inventario y realiza pedidos de reposición</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Búsqueda y filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Inventario
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por nombre o categoría..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nuevo Item de Inventario</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-slate-600">Funcionalidad de agregar items próximamente</p>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <p className="text-slate-600 text-center py-8">Cargando inventario...</p>
          ) : filteredItems.length === 0 ? (
            <p className="text-slate-600 text-center py-8">No se encontraron artículos</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-sm text-slate-700">Artículo</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-slate-700">Categoría</th>
                    <th className="text-right py-3 px-4 font-semibold text-sm text-slate-700">Cantidad</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-slate-700">Estado</th>
                    <th className="text-right py-3 px-4 font-semibold text-sm text-slate-700">Costo Unit.</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-slate-700">Ubicación</th>
                    <th className="text-center py-3 px-4 font-semibold text-sm text-slate-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => {
                    const status = getStockStatus(item)
                    return (
                      <tr key={item._id} className="border-b hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            {item.supplier && <p className="text-sm text-slate-500">{item.supplier}</p>}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{item.category}</Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="font-medium">
                            {item.quantity} {item.unit}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={`${status.color} text-white`}>{status.label}</Badge>
                        </td>
                        <td className="py-3 px-4 text-right">${item.cost.toLocaleString("es-AR")}</td>
                        <td className="py-3 px-4 text-slate-600">{item.location || "No especificada"}</td>
                        <td className="py-3 px-4 text-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteId(item._id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El artículo será eliminado del inventario.
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
