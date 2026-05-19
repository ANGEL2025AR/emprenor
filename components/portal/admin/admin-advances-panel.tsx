"use client"

import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle2, XCircle, Clock } from "lucide-react"
import { createPortalListFetcher } from "@/lib/portal/swr"

const fetcher = createPortalListFetcher("advances")

type AdvanceRow = {
  _id: string
  employeeName?: string
  amount: number
  reason?: string
  status: string
  createdAt: string
}

const STATUS_MAP: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pendiente: { label: "Pendiente", variant: "secondary" },
  aprobado: { label: "Aprobado", variant: "default" },
  rechazado: { label: "Rechazado", variant: "destructive" },
  pagado: { label: "Pagado", variant: "outline" },
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(amount)
}

export function AdminAdvancesPanel() {
  const { toast } = useToast()
  const { data, mutate } = useSWR("/api/portal/advances", fetcher)
  const advances = (data ?? []) as AdvanceRow[]

  async function updateStatus(id: string, status: "aprobado" | "rechazado") {
    const res = await fetch(`/api/portal/advances/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    if (!res.ok) {
      toast({ title: "Error", description: "No se pudo actualizar", variant: "destructive" })
      return
    }
    toast({
      title: status === "aprobado" ? "Adelanto aprobado" : "Adelanto rechazado",
    })
    mutate()
  }

  const pending = advances.filter((a) => a.status === "pendiente")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Adelantos de sueldo</h1>
        <p className="text-slate-600">Apruebe o rechace solicitudes de todos los empleados</p>
      </div>

      <Card className="border-l-4 border-l-amber-500">
        <CardHeader>
          <CardTitle className="text-lg">Pendientes de revisión</CardTitle>
          <CardDescription>{pending.length} solicitudes esperando decisión</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Todas las solicitudes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {advances.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No hay adelantos registrados</p>
          ) : (
            advances.map((adv) => {
              const st = STATUS_MAP[adv.status] || STATUS_MAP.pendiente
              return (
                <div
                  key={adv._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{adv.employeeName || "Empleado"}</p>
                    <p className="text-sm text-slate-600">{adv.reason || "Sin motivo"}</p>
                    <p className="text-lg font-bold mt-1">{formatCurrency(Number(adv.amount))}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={st.variant}>{st.label}</Badge>
                    {adv.status === "pendiente" && (
                      <>
                        <Button size="sm" onClick={() => updateStatus(adv._id, "aprobado")}>
                          <CheckCircle2 className="w-4 h-4 mr-1" /> Aprobar
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => updateStatus(adv._id, "rechazado")}>
                          <XCircle className="w-4 h-4 mr-1" /> Rechazar
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </CardContent>
      </Card>
    </div>
  )
}
