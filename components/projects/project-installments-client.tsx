"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { DollarSign, Loader2, Plus } from "lucide-react"
import type { ProjectInstallment } from "@/lib/projects/project-manager-types"

const STATUS_LABELS: Record<string, string> = {
  pendiente: "Pendiente",
  pagada: "Pagada",
  vencida: "Vencida",
}

const STATUS_COLORS: Record<string, string> = {
  pendiente: "bg-slate-100 text-slate-700",
  pagada: "bg-green-100 text-green-700",
  vencida: "bg-red-100 text-red-700",
}

function formatMoney(n: number, currency = "ARS"): string {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency, maximumFractionDigits: 0 }).format(n)
}

function formatDate(d: string | Date | undefined): string {
  if (!d) return "—"
  return new Date(d).toLocaleDateString("es-AR")
}

export function ProjectInstallmentsClient({
  projectId,
  readOnly = false,
  currency = "ARS",
}: {
  projectId: string
  readOnly?: boolean
  currency?: string
}) {
  const [installments, setInstallments] = useState<ProjectInstallment[]>([])
  const [budgetCurrent, setBudgetCurrent] = useState(0)
  const [totalCollected, setTotalCollected] = useState(0)
  const [totalPending, setTotalPending] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [open, setOpen] = useState(false)
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [dueDate, setDueDate] = useState("")
  const { toast } = useToast()

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}/installments`)
      if (res.ok) {
        const data = await res.json()
        setInstallments(data.installments ?? [])
        setBudgetCurrent(data.budgetCurrent ?? 0)
        setTotalCollected(data.totalCollected ?? 0)
        setTotalPending(data.totalPending ?? 0)
      }
    } finally {
      setLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    load()
  }, [load])

  const addInstallment = async () => {
    const amt = Number.parseFloat(amount)
    if (!description.trim() || !Number.isFinite(amt) || amt <= 0) return
    setSaving(true)
    try {
      const res = await fetch(`/api/projects/${projectId}/installments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: description.trim(),
          amount: amt,
          dueDate: dueDate || undefined,
        }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setInstallments(data.installments ?? [])
      setTotalCollected(data.totalCollected ?? 0)
      setTotalPending(data.totalPending ?? 0)
      setDescription("")
      setAmount("")
      setDueDate("")
      setOpen(false)
      toast({ title: "Cuota registrada" })
    } catch {
      toast({ title: "Error", description: "No se pudo guardar la cuota", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const markPaid = async (installmentId: string) => {
    setSaving(true)
    try {
      const res = await fetch(`/api/projects/${projectId}/installments/${installmentId}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setInstallments(data.installments ?? [])
      setTotalCollected(data.totalCollected ?? 0)
      setTotalPending(data.totalPending ?? 0)
      toast({ title: "Pago registrado" })
    } catch {
      toast({ title: "Error al registrar pago", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    )
  }

  const dueSoon = installments.filter((c) => {
    if (c.status !== "pendiente" || !c.dueDate) return false
    const days = Math.ceil((new Date(c.dueDate).getTime() - Date.now()) / 86400000)
    return days >= 0 && days <= 7
  })

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">Presupuesto actual</p>
            <p className="text-xl font-bold">{formatMoney(budgetCurrent, currency)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">Cobrado</p>
            <p className="text-xl font-bold text-emerald-700">{formatMoney(totalCollected, currency)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">Pendiente</p>
            <p className="text-xl font-bold text-amber-700">{formatMoney(totalPending, currency)}</p>
          </CardContent>
        </Card>
      </div>

      {dueSoon.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          {dueSoon.length} cuota(s) vencen en los próximos 7 días.
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600 flex items-center gap-1">
          <DollarSign className="w-4 h-4" />
          Cuenta corriente por obra
        </p>
        {!readOnly && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Nueva cuota
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar cuota</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <div>
                  <Label>Descripción</Label>
                  <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Anticipo 30%" />
                </div>
                <div>
                  <Label>Monto</Label>
                  <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
                </div>
                <div>
                  <Label>Vencimiento</Label>
                  <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={addInstallment} disabled={saving}>
                  Guardar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {installments.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-slate-500 text-sm">
            {readOnly ? "Sin cuotas cargadas aún." : "Definí las cuotas del contrato para seguir cobros y vencimientos."}
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="p-3 font-medium">#</th>
                <th className="p-3 font-medium">Descripción</th>
                <th className="p-3 font-medium">Monto</th>
                <th className="p-3 font-medium">Vence</th>
                <th className="p-3 font-medium">Estado</th>
                {!readOnly && <th className="p-3 font-medium" />}
              </tr>
            </thead>
            <tbody>
              {installments.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="p-3">{c.number}</td>
                  <td className="p-3">{c.description || "—"}</td>
                  <td className="p-3 font-medium">{formatMoney(c.amount, currency)}</td>
                  <td className="p-3">{formatDate(c.dueDate)}</td>
                  <td className="p-3">
                    <Badge className={STATUS_COLORS[c.status] || ""}>{STATUS_LABELS[c.status] || c.status}</Badge>
                  </td>
                  {!readOnly && (
                    <td className="p-3 text-right">
                      {c.status !== "pagada" && (
                        <Button size="sm" variant="outline" disabled={saving} onClick={() => markPaid(c.id)}>
                          Registrar pago
                        </Button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
