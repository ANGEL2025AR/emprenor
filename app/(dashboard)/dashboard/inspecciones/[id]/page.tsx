"use client"

import type React from "react"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  Loader2,
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
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

export default function InspectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [inspection, setInspection] = useState<Inspection | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInspection = async () => {
      try {
        const response = await fetch(`/api/inspections/${id}`)
        if (response.ok) {
          const data = await response.json()
          setInspection(data.inspection)
        } else {
          router.push("/dashboard/inspecciones")
        }
      } catch {
        router.push("/dashboard/inspecciones")
      } finally {
        setLoading(false)
      }
    }

    fetchInspection()
  }, [id, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    )
  }

  if (!inspection) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Inspección no encontrada</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/inspecciones">Volver a inspecciones</Link>
        </Button>
      </div>
    )
  }

  const ResultIcon = RESULT_ICONS[inspection.result] || AlertTriangle

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/inspecciones">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">{inspection.title}</h1>
            <Badge className={RESULT_COLORS[inspection.result]}>{RESULT_LABELS[inspection.result]}</Badge>
          </div>
          <p className="text-slate-600">Código: {inspection.code}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ResultIcon className="w-5 h-5" />
                Detalles de la Inspección
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-slate-900 mb-2">Descripción</h4>
                <p className="text-slate-600">{inspection.description || "Sin descripción"}</p>
              </div>

              {inspection.observations && (
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Observaciones</h4>
                  <p className="text-slate-600">{inspection.observations}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {inspection.items && inspection.items.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Items de Verificación</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {inspection.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      {item.status === "ok" ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : item.status === "falla" ? (
                        <XCircle className="w-5 h-5 text-red-500" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{item.description}</p>
                        <p className="text-sm text-slate-500">{item.category}</p>
                        {item.comment && <p className="text-sm text-slate-400 mt-1">{item.comment}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {inspection.requiredActions && inspection.requiredActions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Acciones Requeridas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {inspection.requiredActions.map((action, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      {action.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{action.description}</p>
                        {action.deadline && (
                          <p className="text-sm text-slate-500">
                            Fecha límite: {new Date(action.deadline).toLocaleDateString("es-AR")}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500">Fecha</p>
                  <p className="font-medium">{new Date(inspection.date).toLocaleDateString("es-AR")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500">Ubicación</p>
                  <p className="font-medium">{inspection.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500">Tipo</p>
                  <p className="font-medium capitalize">{inspection.type}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {inspection.attachments && inspection.attachments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Archivos Adjuntos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {inspection.attachments.map((url, index) => (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <FileText className="w-5 h-5 text-slate-400" />
                      <span className="text-sm font-medium truncate">Archivo {index + 1}</span>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
