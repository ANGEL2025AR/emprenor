"use client"

import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createPortalListFetcher } from "@/lib/portal/swr"

const fetcher = createPortalListFetcher("tickets")

type TicketRow = {
  _id: string
  subject?: string
  status?: string
  priority?: string
  employeeName?: string
  createdAt?: string
}

export function AdminHelpDeskPanel() {
  const { data } = useSWR("/api/portal/help-desk", fetcher)
  const tickets = (data ?? []) as TicketRow[]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Mesa de ayuda</h1>
        <p className="text-slate-600">Tickets y consultas de todo el personal</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Tickets ({tickets.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {tickets.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No hay tickets</p>
          ) : (
            tickets.map((t) => (
                <div key={t._id} className="p-4 rounded-lg border">
                  <p className="font-semibold">{t.subject || "Sin asunto"}</p>
                  <p className="text-sm text-slate-600">{t.employeeName || "Empleado"}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">{t.status || "abierto"}</Badge>
                    {t.priority && <Badge variant="secondary">{t.priority}</Badge>}
                  </div>
                </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
