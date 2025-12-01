"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  Filter,
  Calendar,
  MapPin,
  User,
  Loader2,
  ClipboardCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import type { Inspection } from "@/lib/db/models"

const RESULT_COLORS: Record<string, string> = {
  pendiente: "bg-amber-100 text-amber-700",
  aprobado: "bg-green-100 text-green-700",
  aprobado_con_observaciones: "bg-blue-100 text-blue-700",
  rechazado: "bg-red-100 text-red-700",
}

const RESULT_LABELS: Record<string, string> = {
  pendiente: "Pendiente",
  aprobado: "Aprobado",
  aprobado_con_observaciones: "Con Observaciones",
  rechazado: "Rechazado",
}

const RESULT_ICONS: Record<string, React.ElementType> = {
  pendiente: AlertTriangle,
  aprobado: CheckCircle2,
  aprobado_con_observaciones: ClipboardCheck,
  rechazado: XCircle,
}

export default function InspectionsPage() {
  const [inspections, setInspections] = useState<Inspection[]>([])
  const [loading, setLoading] = useState(true)
  const [resultFilter, setResultFilter] = useState("")

  useEffect(() => {
    fetchInspections()
  }, [resultFilter])

  const fetchInspections = async () => {
    try {
      const params = new URLSearchParams()
      if (resultFilter && resultFilter !== "all") params.append("result", resultFilter)

      const response = await fetch(`/api/inspections?${params}`)
      const data = await response.json()
      setInspections(data.inspections || [])
    } catch {
      // Error silencioso en producción
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inspecciones</h1>
          <p className="text-slate-600">Control de calidad y seguimiento de obras</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/inspecciones/nueva">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Inspección
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <Select value={resultFilter} onValueChange={setResultFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Resultado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="aprobado">Aprobado</SelectItem>
                <SelectItem value="aprobado_con_observaciones">Con Observaciones</SelectItem>
                <SelectItem value="rechazado">Rechazado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      ) : inspections.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <ClipboardCheck className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No hay inspecciones</h3>
            <p className="text-slate-600 mb-4">Comienza creando tu primera inspección</p>
            <Button asChild>
              <Link href="/dashboard/inspecciones/nueva">Crear Inspección</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {inspections.map((inspection) => {
            const ResultIcon = RESULT_ICONS[inspection.result]
            return (
              <Link key={inspection._id?.toString()} href={`/dashboard/inspecciones/${inspection._id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            inspection.result === "aprobado"
                              ? "bg-green-100"
                              : inspection.result === "rechazado"
                                ? "bg-red-100"
                                : "bg-amber-100"
                          }`}
                        >
                          <ResultIcon
                            className={`w-6 h-6 ${
                              inspection.result === "aprobado"
                                ? "text-green-600"
                                : inspection.result === "rechazado"
                                  ? "text-red-600"
                                  : "text-amber-600"
                            }`}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={RESULT_COLORS[inspection.result]}>
                              {RESULT_LABELS[inspection.result]}
                            </Badge>
                            <span className="text-sm text-slate-500">{inspection.code}</span>
                          </div>
                          <h3 className="font-semibold text-slate-900">{inspection.title}</h3>
                          <p className="text-sm text-slate-600 mt-1 line-clamp-2">{inspection.description}</p>
                          <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(inspection.date).toLocaleDateString("es-AR")}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {inspection.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              Inspector
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline">Ver Detalles</Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
