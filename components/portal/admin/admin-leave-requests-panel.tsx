"use client"

import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle2, XCircle } from "lucide-react"
import { createPortalListFetcher } from "@/lib/portal/swr"

const fetcher = createPortalListFetcher("requests")

type LeaveRequestRow = {
  _id: string
  employeeName?: string
  type?: string
  startDate: string
  endDate: string
  reason?: string
  status: string
}

const STATUS_MAP: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
  pendiente: { label: "Pendiente", variant: "secondary" },
  aprobada: { label: "Aprobada", variant: "default" },
  rechazada: { label: "Rechazada", variant: "destructive" },
}

export function AdminLeaveRequestsPanel() {
  const { toast } = useToast()
  const { data, mutate } = useSWR("/api/portal/leave-requests", fetcher)
  const requests = (data ?? []) as LeaveRequestRow[]

  async function review(id: string, status: "aprobada" | "rechazada") {
    const res = await fetch(`/api/portal/leave-requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    if (!res.ok) {
      toast({ title: "Error", description: "No se pudo actualizar", variant: "destructive" })
      return
    }
    toast({ title: status === "aprobada" ? "Solicitud aprobada" : "Solicitud rechazada" })
    mutate()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Solicitudes de licencia</h1>
        <p className="text-slate-600">Gestione vacaciones, permisos y licencias de todo el personal</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {requests.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No hay solicitudes</p>
          ) : (
            requests.map((req) => {
                const st = STATUS_MAP[req.status] || STATUS_MAP.pendiente
                return (
                  <div
                    key={req._id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border"
                  >
                    <div>
                      <p className="font-semibold">{req.employeeName || "Empleado"}</p>
                      <p className="text-sm text-slate-600 capitalize">{req.type?.replace(/_/g, " ")}</p>
                      <p className="text-sm text-slate-500">
                        {new Date(req.startDate).toLocaleDateString("es-AR")} —{" "}
                        {new Date(req.endDate).toLocaleDateString("es-AR")}
                      </p>
                      {req.reason && <p className="text-xs text-slate-500 mt-1">{req.reason}</p>}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={st.variant}>{st.label}</Badge>
                      {req.status === "pendiente" && (
                        <>
                          <Button size="sm" onClick={() => review(req._id, "aprobada")}>
                            <CheckCircle2 className="w-4 h-4 mr-1" /> Aprobar
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => review(req._id, "rechazada")}>
                            <XCircle className="w-4 h-4 mr-1" /> Rechazar
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                )
              },
            )
          )}
        </CardContent>
      </Card>
    </div>
  )
}
