"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ProjectServiceLine } from "@/lib/db/models"
import { Wrench } from "lucide-react"

const STATUS_LABELS: Record<string, string> = {
  pendiente: "Pendiente",
  en_curso: "En curso",
  completado: "Completado",
}

const STATUS_COLORS: Record<string, string> = {
  pendiente: "bg-slate-100 text-slate-700",
  en_curso: "bg-amber-100 text-amber-800",
  completado: "bg-emerald-100 text-emerald-800",
}

export function ProjectServicesClient({
  services,
  isClient,
}: {
  services: ProjectServiceLine[]
  isClient?: boolean
}) {
  if (!services?.length) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-slate-500 text-sm">
          Sin líneas de servicio en este proyecto.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-600">
        {isClient
          ? "Servicios incluidos en su obra. La documentación compartida aparece en la pestaña Documentos."
          : "Los 12 servicios EMPRENOR quedan asociados automáticamente a cada obra. Subí planos, ART, permisos y certificaciones en Documentos (marcá «Visible para cliente» cuando corresponda)."}
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((svc) => (
          <Card key={svc.slug} className="hover:border-slate-300 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-sm font-semibold leading-tight">{svc.title}</CardTitle>
                <Wrench className="h-4 w-4 text-slate-400 shrink-0" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Badge variant="outline" className={STATUS_COLORS[svc.status] || STATUS_COLORS.pendiente}>
                {STATUS_LABELS[svc.status] || svc.status}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
