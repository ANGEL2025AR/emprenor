"use client"

import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Megaphone, Calendar, AlertTriangle,
  Info, Star, Bell, FileText,
} from "lucide-react"

const fetcher = (url: string) => fetch(url).then(r => r.json())

const TYPE_MAP: Record<string, { label: string; icon: any; color: string }> = {
  informativo: { label: "Informativo", icon: Info, color: "bg-blue-100 text-blue-600" },
  importante: { label: "Importante", icon: AlertTriangle, color: "bg-amber-100 text-amber-600" },
  urgente: { label: "Urgente", icon: AlertTriangle, color: "bg-red-100 text-red-600" },
  reconocimiento: { label: "Reconocimiento", icon: Star, color: "bg-emerald-100 text-emerald-600" },
  normativa: { label: "Normativa", icon: FileText, color: "bg-purple-100 text-purple-600" },
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" })
}

export default function ComunicacionesPage() {
  const { data: announcements } = useSWR("/api/portal/announcements", fetcher)

  const unread = announcements?.filter((a: any) => !a.read) ?? []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Comunicaciones Internas</h1>
        <p className="text-muted-foreground">Avisos, normativas y comunicados de la empresa</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Comunicados</CardTitle>
            <Megaphone className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent><div className="text-3xl font-bold text-foreground">{announcements?.length ?? 0}</div></CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sin Leer</CardTitle>
            <Bell className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent><div className="text-3xl font-bold text-foreground">{unread.length}</div></CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Este Mes</CardTitle>
            <Calendar className="h-5 w-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {announcements?.filter((a: any) => {
                const d = new Date(a.createdAt)
                const now = new Date()
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
              }).length ?? 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Comunicados</CardTitle>
          <CardDescription>Listado de comunicaciones internas</CardDescription>
        </CardHeader>
        <CardContent>
          {!announcements || announcements.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Megaphone className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p>No hay comunicados disponibles</p>
            </div>
          ) : (
            <div className="space-y-4">
              {announcements.map((ann: any) => {
                const typeInfo = TYPE_MAP[ann.type] || TYPE_MAP.informativo
                const Icon = typeInfo.icon
                return (
                  <div key={ann._id} className={`p-5 rounded-lg border bg-card hover:bg-accent/50 transition-colors ${!ann.read ? "ring-1 ring-blue-200" : ""}`}>
                    <div className="flex items-start gap-4">
                      <div className={`p-2.5 rounded-full ${typeInfo.color} shrink-0 mt-0.5`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">{ann.title}</h3>
                          {!ann.read && <Badge variant="secondary" className="text-xs">Nuevo</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">{ann.content}</p>
                        <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />{formatDate(ann.createdAt)}
                          </span>
                          {ann.author && <span>Por: {ann.author}</span>}
                          <Badge variant="outline" className="text-xs">{typeInfo.label}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
