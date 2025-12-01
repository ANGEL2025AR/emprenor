import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Package, Tag, MapPin, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

async function getInventoryItem(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/inventory/${id}`, {
    cache: "no-store",
  })

  if (!res.ok) return null
  return res.json()
}

export default async function InventoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = await getInventoryItem(id)

  if (!item) {
    notFound()
  }

  const statusColors = {
    available: "bg-green-100 text-green-800",
    low: "bg-yellow-100 text-yellow-800",
    out_of_stock: "bg-red-100 text-red-800",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/inventario">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{item.name}</h1>
            <p className="text-muted-foreground">{item.category}</p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/dashboard/inventario/${id}/editar`}>
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Información del Producto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Package className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">SKU</p>
                <p className="font-medium">{item.sku}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Tag className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Categoría</p>
                <Badge variant="secondary">{item.category}</Badge>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Ubicación</p>
                <p className="font-medium">{item.location || "No especificada"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stock y Precios</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Stock Actual</p>
              <p className="text-3xl font-bold">
                {item.quantity} {item.unit}
              </p>
              <Badge className={statusColors[item.status as keyof typeof statusColors]}>{item.status}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Precio Unitario</p>
              <p className="text-2xl font-bold">${item.unitPrice?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Valor Total</p>
              <p className="text-xl font-semibold">
                ${((item.quantity || 0) * (item.unitPrice || 0)).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {item.description && (
        <Card>
          <CardHeader>
            <CardTitle>Descripción</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{item.description}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Información Adicional</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Proveedor:</span>
            <span className="font-medium">{item.supplier || "No especificado"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Fecha de registro:</span>
            <span className="font-medium">{new Date(item.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Última actualización:</span>
            <span className="font-medium">{new Date(item.updatedAt || item.createdAt).toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
