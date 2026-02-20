"use client"

import { useState, useEffect, useCallback } from "react"
import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import {
  Wallet, ArrowUpRight, ArrowDownLeft, Clock, DollarSign,
  Plus, TrendingUp, AlertCircle, CheckCircle2, XCircle,
  CreditCard, Banknote, CalendarDays,
} from "lucide-react"

const fetcher = (url: string) => fetch(url).then(r => r.json())

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(amount)
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" })
}

const STATUS_MAP: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pendiente: { label: "Pendiente", variant: "secondary" },
  aprobado: { label: "Aprobado", variant: "default" },
  rechazado: { label: "Rechazado", variant: "destructive" },
  pagado: { label: "Pagado", variant: "outline" },
}

export default function BilleteraPage() {
  const { toast } = useToast()
  const { data: wallet, mutate: mutateWallet } = useSWR("/api/portal/wallet", fetcher)
  const { data: advances, mutate: mutateAdvances } = useSWR("/api/portal/advances", fetcher)
  const [openAdvance, setOpenAdvance] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ amount: "", reason: "" })

  const balance = wallet?.balance ?? 0
  const pendingAdvances = advances?.filter((a: any) => a.status === "pendiente") ?? []
  const approvedTotal = advances?.filter((a: any) => a.status === "aprobado").reduce((s: number, a: any) => s + a.amount, 0) ?? 0

  async function handleRequestAdvance() {
    if (!form.amount || Number(form.amount) <= 0) {
      toast({ title: "Error", description: "Ingresa un monto valido", variant: "destructive" })
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/portal/advances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(form.amount), reason: form.reason }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Error al solicitar adelanto")
      }
      toast({ title: "Solicitud enviada", description: "Tu adelanto fue solicitado correctamente" })
      setForm({ amount: "", reason: "" })
      setOpenAdvance(false)
      mutateAdvances()
      mutateWallet()
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Billetera Virtual</h1>
        <p className="text-muted-foreground">Consulta tu saldo, historial y solicita adelantos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Saldo Disponible</CardTitle>
            <Wallet className="h-5 w-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{formatCurrency(balance)}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Adelantos Pendientes</CardTitle>
            <Clock className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{pendingAdvances.length}</div>
            <p className="text-xs text-muted-foreground mt-1">solicitudes en espera</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Adelantos Aprobados</CardTitle>
            <TrendingUp className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{formatCurrency(approvedTotal)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Dialog open={openAdvance} onOpenChange={setOpenAdvance}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Solicitar Adelanto</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Solicitar Adelanto de Sueldo</DialogTitle>
              <DialogDescription>
                Completa los datos para solicitar un adelanto. Sera revisado por administracion.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Monto</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={(e) => setForm(p => ({ ...p, amount: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Motivo</Label>
                <Textarea
                  id="reason"
                  placeholder="Describe brevemente el motivo..."
                  value={form.reason}
                  onChange={(e) => setForm(p => ({ ...p, reason: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenAdvance(false)}>Cancelar</Button>
              <Button onClick={handleRequestAdvance} disabled={loading}>
                {loading ? "Enviando..." : "Solicitar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Movimientos</CardTitle>
          <CardDescription>Tus adelantos y transacciones recientes</CardDescription>
        </CardHeader>
        <CardContent>
          {!advances || advances.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Banknote className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p>No hay movimientos registrados</p>
            </div>
          ) : (
            <div className="space-y-3">
              {advances.map((adv: any) => {
                const st = STATUS_MAP[adv.status] || STATUS_MAP.pendiente
                return (
                  <div key={adv._id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${adv.status === "aprobado" || adv.status === "pagado" ? "bg-emerald-100 text-emerald-600" : adv.status === "rechazado" ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"}`}>
                        {adv.status === "aprobado" || adv.status === "pagado" ? <CheckCircle2 className="h-4 w-4" /> : adv.status === "rechazado" ? <XCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Adelanto de sueldo</p>
                        <p className="text-sm text-muted-foreground">{adv.reason || "Sin motivo"}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <CalendarDays className="h-3 w-3" />
                          {formatDate(adv.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">{formatCurrency(adv.amount)}</p>
                      <Badge variant={st.variant}>{st.label}</Badge>
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
