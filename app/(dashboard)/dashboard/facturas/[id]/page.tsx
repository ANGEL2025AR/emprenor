import { notFound } from "next/navigation"
import { getDb } from "@/lib/db/connection"
import { ObjectId } from "mongodb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Download, Send } from "lucide-react"
import Link from "next/link"

export default async function FacturaDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  if (!ObjectId.isValid(id)) {
    notFound()
  }

  const db = await getDb()
  const invoice = await db.collection("invoices").findOne({ _id: new ObjectId(id) })

  if (!invoice) {
    notFound()
  }

  const statusColors = {
    borrador: "secondary",
    emitida: "default",
    pagada: "default",
    vencida: "destructive",
    cancelada: "destructive",
  }

  const subtotal = invoice.items?.reduce((sum: number, item: any) => sum + item.quantity * item.unitPrice, 0) || 0
  const iva = subtotal * 0.21
  const total = subtotal + iva

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/facturas">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Factura {invoice.number}</h1>
            <p className="text-muted-foreground">
              Tipo {invoice.type} - CAE: {invoice.cae || "Pendiente"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" /> Descargar PDF
          </Button>
          <Button variant="outline">
            <Send className="h-4 w-4 mr-2" /> Enviar por Email
          </Button>
          <Link href={`/dashboard/facturas/${id}/editar`}>
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
            <Badge variant={statusColors[invoice.status as keyof typeof statusColors] as any}>{invoice.status}</Badge>
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
            <CardTitle className="text-sm font-medium">Fecha Emisión</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{invoice.issueDate ? new Date(invoice.issueDate).toLocaleDateString() : "N/A"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Vencimiento</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : "N/A"}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Cliente</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Nombre/Razón Social</p>
            <p className="font-medium">{invoice.clientInfo?.name || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">CUIT</p>
            <p className="font-medium">{invoice.clientInfo?.cuit || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Dirección</p>
            <p className="font-medium">{invoice.clientInfo?.address || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Condición Fiscal</p>
            <p className="font-medium">{invoice.clientInfo?.taxCondition || "N/A"}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detalle de la Factura</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3">Descripción</th>
                    <th className="text-right p-3">Cantidad</th>
                    <th className="text-right p-3">Precio Unit.</th>
                    <th className="text-right p-3">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items?.map((item: any, index: number) => (
                    <tr key={index} className="border-t">
                      <td className="p-3">{item.description}</td>
                      <td className="text-right p-3">{item.quantity}</td>
                      <td className="text-right p-3">${item.unitPrice?.toLocaleString()}</td>
                      <td className="text-right p-3 font-medium">
                        ${(item.quantity * item.unitPrice)?.toLocaleString()}
                      </td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan={4} className="p-3 text-center text-muted-foreground">
                        No hay items
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-medium">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">IVA (21%):</span>
                  <span className="font-medium">${iva.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>${total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {invoice.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Observaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{invoice.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
