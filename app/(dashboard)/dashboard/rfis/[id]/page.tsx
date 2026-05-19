import { notFound } from "next/navigation"
import Link from "next/link"
import { ObjectId } from "mongodb"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { ArrowLeft, MessageSquare, Calendar, MapPin } from "lucide-react"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { serializeRFI } from "@/lib/rfis/serialize-rfi"
import { RfiDetailActions } from "@/components/rfis/rfi-detail-actions"

const STATUS_LABELS: Record<string, string> = {
  abierto: "Abierto",
  en_revision: "En revisión",
  respondido: "Respondido",
  cerrado: "Cerrado",
  cancelado: "Cancelado",
}

export default async function RfiDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const { id } = await params
  if (!ObjectId.isValid(id)) notFound()

  const db = await getDb()
  const doc = await db.collection("rfis").findOne({ _id: new ObjectId(id) })
  if (!doc) notFound()

  const rfi = serializeRFI(doc as Record<string, unknown>)

  let projectName = rfi.projectId
  if (ObjectId.isValid(rfi.projectId)) {
    const project = await db.collection("projects").findOne({ _id: new ObjectId(rfi.projectId) })
    if (project) projectName = `${project.code || ""} — ${project.name || ""}`.trim()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/rfis">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="font-mono text-sm font-semibold text-emerald-700">{rfi.rfiNumber}</span>
            <Badge>{STATUS_LABELS[rfi.status] || rfi.status}</Badge>
            <Badge variant="outline">{rfi.priority}</Badge>
            <Badge variant="secondary">{rfi.discipline}</Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{rfi.subject}</h1>
          <p className="text-slate-600 mt-1">Proyecto: {projectName}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-600" />
              Consulta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{rfi.description}</p>
            {rfi.response && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-2">
                <h4 className="font-semibold text-emerald-900">Respuesta oficial</h4>
                <p className="text-sm text-slate-800 whitespace-pre-wrap">{rfi.response.responseText}</p>
                {rfi.response.recommendation && (
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">Recomendación:</span> {rfi.response.recommendation}
                  </p>
                )}
                <p className="text-xs text-slate-500">
                  {rfi.response.respondedDate
                    ? format(new Date(rfi.response.respondedDate), "dd MMM yyyy HH:mm", { locale: es })
                    : ""}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Datos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="flex items-center gap-2 text-slate-600">
              <Calendar className="w-4 h-4" />
              Solicitado:{" "}
              {rfi.requestedDate ? format(new Date(rfi.requestedDate), "dd MMM yyyy", { locale: es }) : "—"}
            </p>
            <p className="flex items-center gap-2 text-slate-600">
              <Calendar className="w-4 h-4" />
              Respuesta antes:{" "}
              {rfi.requiredResponseDate ? format(new Date(rfi.requiredResponseDate), "dd MMM yyyy", { locale: es }) : "—"}
            </p>
            {rfi.location && (
              <p className="flex items-center gap-2 text-slate-600">
                <MapPin className="w-4 h-4" />
                {rfi.location}
              </p>
            )}
            {rfi.cost?.hasImpact && (
              <p className="text-amber-800 bg-amber-50 rounded-lg p-2">Impacto en costo registrado</p>
            )}
            {rfi.schedule?.hasImpact && (
              <p className="text-amber-800 bg-amber-50 rounded-lg p-2">Impacto en cronograma registrado</p>
            )}
          </CardContent>
        </Card>
      </div>

      {rfi.comments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Comentarios</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {rfi.comments.map((c, i) => (
              <div key={i} className="rounded-lg border p-3 text-sm">
                <p className="text-slate-800">{c.comment}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {c.date ? format(new Date(c.date), "dd MMM yyyy HH:mm", { locale: es }) : ""}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <RfiDetailActions rfi={rfi} />
    </div>
  )
}
