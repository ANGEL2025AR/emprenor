"use client"

import Link from "next/link"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, Eye, Plus } from "lucide-react"
import type { SerializedRFI } from "@/lib/rfis/serialize-rfi"

const STATUS_LABELS: Record<string, string> = {
  abierto: "Abierto",
  en_revision: "En revisión",
  respondido: "Respondido",
  cerrado: "Cerrado",
  cancelado: "Cancelado",
}

const STATUS_COLORS: Record<string, string> = {
  abierto: "bg-blue-100 text-blue-800",
  en_revision: "bg-amber-100 text-amber-800",
  respondido: "bg-green-100 text-green-800",
  cerrado: "bg-slate-100 text-slate-800",
  cancelado: "bg-red-100 text-red-800",
}

const PRIORITY_COLORS: Record<string, string> = {
  baja: "bg-slate-100 text-slate-700",
  normal: "bg-slate-100 text-slate-700",
  alta: "bg-orange-100 text-orange-800",
  urgente: "bg-red-100 text-red-800",
}

export function RfisListClient({ rfis }: { rfis: SerializedRFI[] }) {
  if (rfis.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <MessageSquare className="w-16 h-16 text-slate-300 mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No hay RFIs registrados</h3>
          <p className="text-slate-600 text-center mb-6 max-w-md">
            Crea solicitudes de información para aclarar dudas técnicas y obtener respuestas documentadas.
          </p>
          <Button asChild>
            <Link href="/dashboard/rfis/nuevo">
              <Plus className="w-4 h-4 mr-2" />
              Crear primer RFI
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {rfis.map((rfi) => (
        <Card key={rfi._id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-sm font-semibold text-emerald-700">{rfi.rfiNumber}</span>
                <Badge className={STATUS_COLORS[rfi.status] || "bg-slate-100"}>{STATUS_LABELS[rfi.status] || rfi.status}</Badge>
                <Badge variant="outline" className={PRIORITY_COLORS[rfi.priority]}>
                  {rfi.priority}
                </Badge>
              </div>
              <h3 className="font-semibold text-slate-900 truncate">{rfi.subject}</h3>
              <p className="text-sm text-slate-600 line-clamp-2">{rfi.description}</p>
              <p className="text-xs text-slate-500">
                Solicitado: {rfi.requestedDate ? format(new Date(rfi.requestedDate), "dd MMM yyyy", { locale: es }) : "—"}
                {" · "}
                Respuesta antes:{" "}
                {rfi.requiredResponseDate ? format(new Date(rfi.requiredResponseDate), "dd MMM yyyy", { locale: es }) : "—"}
              </p>
            </div>
            <Button asChild variant="outline" size="sm" className="shrink-0">
              <Link href={`/dashboard/rfis/${rfi._id}`}>
                <Eye className="w-4 h-4 mr-2" />
                Ver detalle
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}


