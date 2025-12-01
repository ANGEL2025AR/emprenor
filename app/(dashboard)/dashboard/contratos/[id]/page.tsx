import { notFound } from "next/navigation"
import { getDb } from "@/lib/db/connection"
import { ObjectId } from "mongodb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Download, FileCheck } from "lucide-react"
import Link from "next/link"

export default async function ContratoDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  if (!ObjectId.isValid(id)) {
    notFound()
  }

  const db = await getDb()
  const contract = await db.collection("contracts").findOne({ _id: new ObjectId(id) })

  if (!contract) {
    notFound()
  }

  const statusColors = {
    borrador: "secondary",
    activo: "default",
    finalizado: "default",
    cancelado: "destructive",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/contratos">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Contrato {contract.code}</h1>
            <p className="text-muted-foreground">{contract.projectName}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" /> Descargar PDF
          </Button>
          <Button variant="outline">
            <FileCheck className="h-4 w-4 mr-2" /> Firmar
          </Button>
          <Link href={`/dashboard/contratos/${id}/editar`}>
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
            <Badge variant={statusColors[contract.status as keyof typeof statusColors] as any}>{contract.status}</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Monto Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {contract.currency} ${contract.amount?.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Fecha Inicio</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{contract.startDate ? new Date(contract.startDate).toLocaleDateString() : "N/A"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Fecha Fin</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{contract.endDate ? new Date(contract.endDate).toLocaleDateString() : "N/A"}</p>
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
            <p className="font-medium">{contract.clientInfo?.name || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">CUIT</p>
            <p className="font-medium">{contract.clientInfo?.cuit || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Dirección</p>
            <p className="font-medium">{contract.clientInfo?.address || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{contract.clientInfo?.email || "N/A"}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alcance del Contrato</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{contract.scope || "No especificado"}</p>
        </CardContent>
      </Card>

      {contract.paymentTerms && contract.paymentTerms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Condiciones de Pago</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {contract.paymentTerms.map((term: any, index: number) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{term.description}</p>
                    <p className="text-sm text-muted-foreground">
                      Vencimiento: {new Date(term.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-lg font-bold">{term.percentage}%</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {contract.deliverables && contract.deliverables.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Entregables</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {contract.deliverables.map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                  <p className="font-medium">{item.description}</p>
                  <p className="text-sm text-muted-foreground">
                    Fecha límite: {new Date(item.deadline).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Garantía</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            {contract.warranty?.duration} {contract.warranty?.type}
          </p>
        </CardContent>
      </Card>

      {contract.penaltyClause && (
        <Card>
          <CardHeader>
            <CardTitle>Cláusula de Penalización</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{contract.penaltyClause}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
