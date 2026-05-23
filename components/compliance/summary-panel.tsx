"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { ChecklistItem } from "@/lib/compliance/roster"
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react"

type SummaryPanelProps = {
  score: number
  checklist: ChecklistItem[]
  projectName: string
  clientOrganization?: string
  openIncidents: number
  openComplaints: number
  localPurchasesTotal: number
}

function StatusIcon({ status }: { status: ChecklistItem["status"] }) {
  if (status === "ok") return <CheckCircle2 className="h-5 w-5 text-emerald-600" />
  if (status === "warning") return <AlertTriangle className="h-5 w-5 text-amber-500" />
  if (status === "error") return <XCircle className="h-5 w-5 text-red-600" />
  return null
}

export function ComplianceSummaryPanel({
  score,
  checklist,
  projectName,
  clientOrganization,
  openIncidents,
  openComplaints,
  localPurchasesTotal,
}: SummaryPanelProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Centro de cumplimiento — {projectName}</CardTitle>
          {clientOrganization ? (
            <p className="text-sm text-muted-foreground">Cliente institucional: {clientOrganization}</p>
          ) : null}
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Índice de cumplimiento</span>
              <span className="text-2xl font-bold text-emerald-700">{score}%</span>
            </div>
            <Progress value={score} className="h-3" />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Incidentes abiertos</p>
              <p className="text-xl font-bold">{openIncidents}</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Quejas activas</p>
              <p className="text-xl font-bold">{openComplaints}</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Compras locales</p>
              <p className="text-xl font-bold">${localPurchasesTotal.toLocaleString("es-AR")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Checklist de auditoría</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {checklist.map((item) => (
            <div key={item.key} className="flex items-start gap-3 rounded-lg border p-3">
              <StatusIcon status={item.status} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm">{item.label}</span>
                  <Badge variant={item.status === "ok" ? "default" : "secondary"} className="text-xs">
                    {item.status === "ok" ? "OK" : item.status === "warning" ? "Atención" : item.status === "error" ? "Pendiente" : "N/A"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{item.detail}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
