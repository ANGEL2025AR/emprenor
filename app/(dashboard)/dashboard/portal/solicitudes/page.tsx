"use client"

import { useState } from "react"
import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import {
  Calendar, Clock, Plus, CheckCircle2, XCircle,
  Palmtree, Thermometer, Baby, GraduationCap, Heart,
  FileText, AlertCircle, Loader2,
} from "lucide-react"

const fetcher = (url: string) => fetch(url).then(r => r.json())

const LEAVE_TYPES = [
  { value: "vacaciones", label: "Vacaciones", icon: Palmtree, color: "text-emerald-600 bg-emerald-100" },
  { value: "enfermedad", label: "Enfermedad", icon: Thermometer, color: "text-red-600 bg-red-100" },
  { value: "maternidad_paternidad", label: "Maternidad/Paternidad", icon: Baby, color: "text-pink-600 bg-pink-100" },
  { value: "estudio", label: "Examen / Estudio", icon: GraduationCap, color: "text-blue-600 bg-blue-100" },
  { value: "familiar", label: "Asuntos Familiares", icon: Heart, color: "text-purple-600 bg-purple-100" },
  { value: "personal", label: "Asuntos Personales", icon: FileText, color: "text-slate-600 bg-slate-100" },
]

const STATUS_MAP: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pendiente: { label: "Pendiente", variant: "secondary" },
  aprobada: { label: "Aprobada", variant: "default" },
  rechazada: { label: "Rechazada", variant: "destructive" },
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" })
}

export default function SolicitudesPage() {
  const { toast } = useToast()
  const { data: requests, mutate } = useSWR("/api/portal/leave-requests", fetcher)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    type: "",
    startDate: "",
    endDate: "",
    reason: "",
  })

  const pending = requests?.filter((r: any) => r.status === "pendiente") ?? []
  const approved = requests?.filter((r: any) => r.status === "aprobada") ?? []
  const rejected = requests?.filter((r: any) => r.status === "rechazada") ?? []

  async function handleSubmit() {
    if (!form.type || !form.startDate || !form.endDate) {
      toast({ title: "Error", description: "Completa todos los campos obligatorios", variant: "destructive" })
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/portal/leave-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Error al enviar solicitud")
      }
      toast({ title: "Solicitud enviada", description: "Tu solicitud fue registrada correctamente" })
      setForm({ type: "", startDate: "", endDate: "", reason: "" })
      setOpen(false)
      mutate()
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  function RequestCard({ req }: { req: any }) {
    const typeInfo = LEAVE_TYPES.find(t => t.value === req.type) || LEAVE_TYPES[5]
    const Icon = typeInfo.icon
    const st = STATUS_MAP[req.status] || STATUS_MAP.pendiente
    const start = new Date(req.startDate)
    const end = new Date(req.endDate)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1

    return (
      <div className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
        <div className="flex items-center gap-4">
          <div className={`p-2.5 rounded-full ${typeInfo.color}`}>
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <p className="font-medium text-foreground">{typeInfo.label}</p>
            <p className="text-sm text-muted-foreground">
              {formatDate(req.startDate)} - {formatDate(req.endDate)} ({days} {days === 1 ? "dia" : "dias"})
            </p>
            {req.reason && <p className="text-xs text-muted-foreground mt-1">{req.reason}</p>}
          </div>
        </div>
        <Badge variant={st.variant}>{st.label}</Badge>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Solicitudes de Licencia</h1>
          <p className="text-muted-foreground">Gestiona tus vacaciones, licencias y permisos</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Nueva Solicitud</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Nueva Solicitud de Licencia</DialogTitle>
              <DialogDescription>Completa los datos de tu solicitud</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Tipo de Licencia</Label>
                <Select value={form.type} onValueChange={(v) => setForm(p => ({ ...p, type: v }))}>
                  <SelectTrigger><SelectValue placeholder="Selecciona el tipo" /></SelectTrigger>
                  <SelectContent>
                    {LEAVE_TYPES.map(t => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Desde</Label>
                  <Input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm(p => ({ ...p, startDate: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Hasta</Label>
                  <Input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm(p => ({ ...p, endDate: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Observaciones</Label>
                <Textarea
                  placeholder="Detalla el motivo si es necesario..."
                  value={form.reason}
                  onChange={(e) => setForm(p => ({ ...p, reason: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Enviando...</> : "Enviar Solicitud"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pendientes</CardTitle>
            <Clock className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent><div className="text-3xl font-bold text-foreground">{pending.length}</div></CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Aprobadas</CardTitle>
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          </CardHeader>
          <CardContent><div className="text-3xl font-bold text-foreground">{approved.length}</div></CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rechazadas</CardTitle>
            <XCircle className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent><div className="text-3xl font-bold text-foreground">{rejected.length}</div></CardContent>
        </Card>
      </div>

      <Tabs defaultValue="todas">
        <TabsList>
          <TabsTrigger value="todas">Todas ({requests?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="pendientes">Pendientes ({pending.length})</TabsTrigger>
          <TabsTrigger value="aprobadas">Aprobadas ({approved.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="todas" className="space-y-3 mt-4">
          {(!requests || requests.length === 0) ? (
            <Card><CardContent className="text-center py-12 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p>No hay solicitudes registradas</p>
            </CardContent></Card>
          ) : requests.map((r: any) => <RequestCard key={r._id} req={r} />)}
        </TabsContent>
        <TabsContent value="pendientes" className="space-y-3 mt-4">
          {pending.length === 0 ? (
            <Card><CardContent className="text-center py-8 text-muted-foreground">Sin solicitudes pendientes</CardContent></Card>
          ) : pending.map((r: any) => <RequestCard key={r._id} req={r} />)}
        </TabsContent>
        <TabsContent value="aprobadas" className="space-y-3 mt-4">
          {approved.length === 0 ? (
            <Card><CardContent className="text-center py-8 text-muted-foreground">Sin solicitudes aprobadas</CardContent></Card>
          ) : approved.map((r: any) => <RequestCard key={r._id} req={r} />)}
        </TabsContent>
      </Tabs>
    </div>
  )
}
