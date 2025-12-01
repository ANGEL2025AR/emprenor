import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Download, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getDb } from "@/lib/db/connection"
import { ObjectId } from "mongodb"

export default async function CertificateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  if (!ObjectId.isValid(id)) {
    notFound()
  }

  const db = await getDb()
  const certificate = await db.collection("certificates").findOne({ _id: new ObjectId(id) })

  if (!certificate) {
    notFound()
  }

  const statusColors = {
    active: "bg-green-100 text-green-800",
    expired: "bg-red-100 text-red-800",
    pending: "bg-yellow-100 text-yellow-800",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/certificados">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{certificate.name}</h1>
            <p className="text-muted-foreground">Detalles del certificado</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Descargar
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Información del Certificado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Tipo</p>
                <p className="font-medium">{certificate.type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estado</p>
                <Badge className={statusColors[certificate.status as keyof typeof statusColors]}>
                  {certificate.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fecha de Emisión</p>
                <p className="font-medium">{new Date(certificate.issueDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fecha de Vencimiento</p>
                <p className="font-medium">{new Date(certificate.expiryDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Entidad Emisora</p>
                <p className="font-medium">{certificate.issuingAuthority}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Número de Certificado</p>
                <p className="font-medium">{certificate.certificateNumber}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full bg-transparent" variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Ver Documento
            </Button>
            <Button className="w-full bg-transparent" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Descargar PDF
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
