"use client"

import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Download, Calendar, DollarSign, TrendingUp, Eye } from "lucide-react"

const fetcher = (url: string) => fetch(url).then(r => r.json())

function formatCurrency(n: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(n)
}

function formatPeriod(period: string) {
  const [y, m] = period.split("-")
  const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
  return `${months[Number(m) - 1]} ${y}`
}

export default function RecibosPage() {
  const { data: payslips } = useSWR("/api/portal/payslips", fetcher)

  const currentYear = new Date().getFullYear()
  const thisYearTotal = payslips
    ?.filter((p: any) => p.period?.startsWith(String(currentYear)))
    .reduce((s: number, p: any) => s + (p.netAmount || 0), 0) ?? 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Recibos de Sueldo</h1>
        <p className="text-muted-foreground">Consulta y descarga tus recibos de haberes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Recibos Disponibles</CardTitle>
            <FileText className="h-5 w-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{payslips?.length ?? 0}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Acumulado {currentYear}</CardTitle>
            <TrendingUp className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{formatCurrency(thisYearTotal)}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ultimo Recibo</CardTitle>
            <Calendar className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-foreground">
              {payslips?.[0] ? formatPeriod(payslips[0].period) : "---"}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Recibos</CardTitle>
          <CardDescription>Todos tus recibos de haberes ordenados por periodo</CardDescription>
        </CardHeader>
        <CardContent>
          {!payslips || payslips.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p>No hay recibos disponibles</p>
            </div>
          ) : (
            <div className="space-y-3">
              {payslips.map((slip: any) => (
                <div key={slip._id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-full bg-blue-100 text-blue-600">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{formatPeriod(slip.period)}</p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3.5 w-3.5" />
                          Bruto: {formatCurrency(slip.grossAmount || 0)}
                        </span>
                        <span>Deducciones: {formatCurrency(slip.deductions || 0)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right mr-2">
                      <p className="text-sm text-muted-foreground">Neto</p>
                      <p className="font-bold text-foreground">{formatCurrency(slip.netAmount || 0)}</p>
                    </div>
                    <Badge variant={slip.signed ? "default" : "secondary"}>
                      {slip.signed ? "Firmado" : "Pendiente"}
                    </Badge>
                    {slip.fileUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={slip.fileUrl} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
