"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AlertOctagon, Search, Plus, AlertTriangle, CheckCircle2, Clock } from "lucide-react"

interface Incident {
  _id: string
  title: string
  projectName: string
  severity: "baja" | "media" | "alta" | "critica"
  status: "abierta" | "en_revision" | "resuelta"
  date: string
  description?: string
}

export default function IncidentsClient() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    loadIncidents()
  }, [])

  const loadIncidents = async () => {
    try {
      const response = await fetch("/api/incidents")
      if (response.ok) {
        const data = await response.json()
        setIncidents(data.incidents || [])
      }
    } catch (error) {
      console.error("[v0] Error loading incidents:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredIncidents = incidents.filter(
    (inc) =>
      inc.title?.toLowerCase().includes(search.toLowerCase()) ||
      inc.projectName?.toLowerCase().includes(search.toLowerCase()),
  )

  const severityConfig = {
    baja: { color: "bg-blue-500", label: "Baja" },
    media: { color: "bg-yellow-500", label: "Media" },
    alta: { color: "bg-orange-500", label: "Alta" },
    critica: { color: "bg-red-500", label: "Crítica" },
  }

  const statusConfig = {
    abierta: { icon: AlertTriangle, color: "bg-red-500", label: "Abierta" },
    en_revision: { icon: Clock, color: "bg-amber-500", label: "En Revisión" },
    resuelta: { icon: CheckCircle2, color: "bg-green-500", label: "Resuelta" },
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertOctagon className="w-5 h-5" />
            Incidencias Registradas
          </CardTitle>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Reportar Incidencia
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Buscar incidencias..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-slate-600 text-center py-8">Cargando incidencias...</p>
        ) : filteredIncidents.length === 0 ? (
          <p className="text-slate-600 text-center py-8">No se encontraron incidencias</p>
        ) : (
          <div className="space-y-3">
            {filteredIncidents.map((inc) => {
              const StatusIcon = statusConfig[inc.status].icon
              return (
                <Card key={inc._id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div
                          className={`w-12 h-12 ${statusConfig[inc.status].color} rounded-xl flex items-center justify-center flex-shrink-0`}
                        >
                          <StatusIcon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{inc.title}</h3>
                          <p className="text-sm text-slate-600 mt-1">{inc.projectName}</p>
                          {inc.description && <p className="text-sm text-slate-500 mt-2">{inc.description}</p>}
                          <div className="flex gap-2 mt-3">
                            <Badge className={severityConfig[inc.severity].color}>
                              {severityConfig[inc.severity].label}
                            </Badge>
                            <Badge variant="outline">{statusConfig[inc.status].label}</Badge>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600">{new Date(inc.date).toLocaleDateString("es-AR")}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
