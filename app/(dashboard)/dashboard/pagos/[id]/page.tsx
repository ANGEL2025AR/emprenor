import { notFound } from "next/navigation"
import { getDb } from "@/lib/db/connection"
import { ObjectId } from "mongodb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Download, Receipt } from "lucide-react"
import Link from "next/link"

export default async function PagoDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  if (!ObjectId.isValid(id)) {
    notFound()
  }

  const db = await getDb()
  const payment = await db.collection("payments").findOne({ _id: new ObjectId(id) })

  if (!payment) {
    notFound()
  }

  const statusColors = {
    pendiente: "secondary",
    procesando: "default",
    completado: "default",
    rechazado: "destructive",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/pagos">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Pago {payment.code}</h1>
            <p className="text-muted-foreground">Referencia de {payment.invoiceId ? "Factura" : "Proyecto"}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Receipt className="h-4 w-4 mr-2" /> Comprobante
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" /> Descargar PDF
          </Button>
          <Link href={`/dashboard/pagos/${id}/editar`}>
            <Button>
              <Edit className="h-4 w-4 mr-2" /> Editar
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Estado</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={statusColors[payment.status as keyof typeof statusColors] as any}>{payment.status}</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Monto</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {payment.currency} ${payment.amount?.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Método</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{payment.method}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Fecha</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : "N/A"}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalles del Pago</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Código</p>
            <p className="font-medium">{payment.code}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Método de Pago</p>
            <p className="font-medium">{payment.method}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Referencia</p>
            <p className="font-medium">{payment.reference || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Fecha de Pago</p>
            <p className="font-medium">
              {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : "N/A"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Información del Pagador</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Nombre</p>
            <p className="font-medium">{payment.payer?.name || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{payment.payer?.email || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">CUIT</p>
            <p className="font-medium">{payment.payer?.cuit || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Dirección</p>
            <p className="font-medium">{payment.payer?.address || "N/A"}</p>
          </div>
        </CardContent>
      </Card>

      {payment.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{payment.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
