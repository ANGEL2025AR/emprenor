import { notFound } from "next/navigation"
import { getDb } from "@/lib/db/connection"
import { ObjectId } from "mongodb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Download, Send } from "lucide-react"
import Link from "next/link"

export default async function CotizacionDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  if (!ObjectId.isValid(id)) {
    notFound()
  }

  const db = await getDb()
  const quotation = await db.collection("quotations").findOne({ _id: new ObjectId(id) })

  if (!quotation) {
    notFound()
  }

  const statusColors = {
    borrador: "secondary",
    enviada: "default",
    aprobada: "default",
    rechazada: "destructive",
  }

  const total = quotation.items?.reduce((sum: number, item: any) => sum + item.quantity * item.unitPrice, 0) || 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/cotizaciones">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Cotización {quotation.code}</h1>
            <p className="text-muted-foreground">Proyecto: {quotation.projectName}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" /> Descargar PDF
          </Button>
          <Button variant="outline">
            <Send className="h-4 w-4 mr-2" /> Enviar
          </Button>
          <Link href={`/dashboard/cotizaciones/${id}/editar`}>
            <Button>
              <Edit className="h-4 w-4 mr-2" /> Editar
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Estado</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={statusColors[quotation.status as keyof typeof statusColors] as any}>
              {quotation.status}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${total.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Validez</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{quotation.validUntil ? new Date(quotation.validUntil).toLocaleDateString() : "N/A"}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Cliente</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Nombre</p>
            <p className="font-medium">{quotation.clientInfo?.name || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{quotation.clientInfo?.email || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Teléfono</p>
            <p className="font-medium">{quotation.clientInfo?.phone || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">CUIT</p>
            <p className="font-medium">{quotation.clientInfo?.cuit || "N/A"}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Items de la Cotización</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quotation.items?.map((item: any, index: number) => (
              <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{item.description}</p>
                  <p className="text-sm text-muted-foreground">
                    Cantidad: {item.quantity} | Precio unitario: ${item.unitPrice?.toLocaleString()}
                  </p>
                </div>
                <p className="text-lg font-bold">${(item.quantity * item.unitPrice)?.toLocaleString()}</p>
              </div>
            )) || <p className="text-muted-foreground">No hay items</p>}
          </div>
        </CardContent>
      </Card>

      {quotation.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{quotation.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
