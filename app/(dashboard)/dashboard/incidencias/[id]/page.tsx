import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, AlertTriangle, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getDb } from "@/lib/db/connection"
import { ObjectId } from "mongodb"

export default async function IncidentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  if (!ObjectId.isValid(id)) {
    notFound()
  }

  const db = await getDb()
  const incident = await db.collection("incidents").findOne({ _id: new ObjectId(id) })

  if (!incident) {
    notFound()
  }

  const severityColors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-orange-100 text-orange-800",
    critical: "bg-red-100 text-red-800",
  }

  const statusColors = {
    open: "bg-blue-100 text-blue-800",
    investigating: "bg-yellow-100 text-yellow-800",
    resolved: "bg-green-100 text-green-800",
    closed: "bg-gray-100 text-gray-800",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/incidencias">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{incident.title}</h1>
            <p className="text-muted-foreground">Detalles de la incidencia</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Información de la Incidencia</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Tipo</p>
                <p className="font-medium">{incident.type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Severidad</p>
                <Badge className={severityColors[incident.severity as keyof typeof severityColors]}>
                  {incident.severity}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estado</p>
                <Badge className={statusColors[incident.status as keyof typeof statusColors]}>{incident.status}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fecha de Reporte</p>
                <p className="font-medium">{new Date(incident.reportedDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Descripción</p>
              <p className="text-sm">{incident.description}</p>
            </div>

            {incident.resolution && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Resolución</p>
                <p className="text-sm">{incident.resolution}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estadísticas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Impacto</p>
                <p className="font-semibold">{incident.impact || "Medio"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Fecha Reporte</p>
                <p className="font-semibold">{new Date(incident.reportedDate).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
