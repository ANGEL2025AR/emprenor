"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Cloud, Users, AlertTriangle, Package } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface DailyLog {
  _id: string
  logNumber: string
  projectId: string
  date: string
  shift: string
  weather: {
    condition: string
    temperature: number
  }
  workforce: {
    total: number
  }
  activities: unknown[]
  safetyObservations: unknown[]
  status?: string
}

interface DailyLogsClientProps {
  initialLogs: DailyLog[]
}

export function DailyLogsClient({ initialLogs }: DailyLogsClientProps) {
  const [logs] = useState<DailyLog[]>(initialLogs)

  const getWeatherIcon = (condition: string) => {
    return <Cloud className="w-4 h-4" />
  }

  const getShiftColor = (shift: string) => {
    switch (shift) {
      case "mañana":
        return "bg-amber-100 text-amber-700"
      case "tarde":
        return "bg-blue-100 text-blue-700"
      case "noche":
        return "bg-indigo-100 text-indigo-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  if (logs.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Package className="w-16 h-16 text-slate-300 mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No hay bitácoras registradas</h3>
          <p className="text-slate-600 text-center mb-6">
            Comienza a registrar las actividades diarias de tus proyectos
          </p>
          <Button asChild>
            <Link href="/dashboard/bitacora-diaria/nueva">Crear primera bitácora</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <Card key={log._id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <Badge variant="outline" className="font-mono">
                    {log.logNumber}
                  </Badge>
                  <Badge className={getShiftColor(log.shift)}>Turno {log.shift}</Badge>
                  <span className="text-sm text-slate-600">
                    {format(new Date(log.date), "dd 'de' MMMM, yyyy", { locale: es })}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    {getWeatherIcon(log.weather.condition)}
                    <div>
                      <p className="text-xs text-slate-600">Clima</p>
                      <p className="text-sm font-semibold capitalize">{log.weather.condition}</p>
                      <p className="text-xs text-slate-500">{log.weather.temperature}°C</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-xs text-slate-600">Personal</p>
                      <p className="text-sm font-semibold">{log.workforce.total} trabajadores</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-xs text-slate-600">Actividades</p>
                      <p className="text-sm font-semibold">{log.activities.length} registradas</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <div>
                      <p className="text-xs text-slate-600">Seguridad</p>
                      <p className="text-sm font-semibold">{log.safetyObservations.length} observaciones</p>
                    </div>
                  </div>
                </div>
              </div>

              <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/bitacora-diaria/${log._id}`}>
                  <Eye className="w-4 h-4 mr-2" />
                  Ver detalles
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
