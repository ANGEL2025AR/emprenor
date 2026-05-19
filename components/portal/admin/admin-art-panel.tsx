"use client"

import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function AdminArtPanel() {
  const { data, isLoading } = useSWR("/api/portal/accidents", async (url) => {
    const res = await fetch(url)
    if (!res.ok) throw new Error("Error")
    const json = await res.json()
    return json.reports || []
  })

  const accidents = data || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">ART / Seguridad</h1>
        <p className="text-slate-600">Reportes de incidentes y accidentes laborales</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Reportes ({accidents.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <p className="text-slate-500">Cargando...</p>
          ) : accidents.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No hay reportes</p>
          ) : (
            accidents.map((a: { _id: string; location?: string; injuryType?: string; status?: string; employeeName?: string }) => (
              <div key={a._id} className="p-4 rounded-lg border">
                <p className="font-semibold">{a.location || "Sin ubicación"}</p>
                <p className="text-sm text-slate-600">{a.employeeName || "Empleado"}</p>
                {a.injuryType && <p className="text-sm">{a.injuryType}</p>}
                {a.status && <Badge className="mt-2">{a.status}</Badge>}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
