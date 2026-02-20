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
import { useToast } from "@/hooks/use-toast"
import {
  HelpCircle, Plus, Clock, CheckCircle2,
  MessageSquare, AlertCircle, Loader2,
  Wrench, Monitor, Key, HardDrive, Users,
} from "lucide-react"

const fetcher = (url: string) => fetch(url).then(r => r.json())

const CATEGORIES = [
  { value: "sistemas", label: "Sistemas / IT", icon: Monitor },
  { value: "rrhh", label: "Recursos Humanos", icon: Users },
  { value: "mantenimiento", label: "Mantenimiento", icon: Wrench },
  { value: "accesos", label: "Accesos / Permisos", icon: Key },
  { value: "equipamiento", label: "Equipamiento", icon: HardDrive },
  { value: "otro", label: "Otro", icon: HelpCircle },
]

const PRIORITY_MAP: Record<string, { label: string; color: string }> = {
  baja: { label: "Baja", color: "bg-slate-100 text-slate-700" },
  media: { label: "Media", color: "bg-amber-100 text-amber-700" },
  alta: { label: "Alta", color: "bg-orange-100 text-orange-700" },
  urgente: { label: "Urgente", color: "bg-red-100 text-red-700" },
}

const STATUS_MAP: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  abierto: { label: "Abierto", variant: "secondary" },
  en_progreso: { label: "En Progreso", variant: "outline" },
  resuelto: { label: "Resuelto", variant: "default" },
  cerrado: { label: "Cerrado", variant: "destructive" },
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("es-AR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })
}

export default function MesaAyudaPage() {
  const { toast } = useToast()
  const { data: tickets, mutate } = useSWR("/api/portal/help-desk", fetcher)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    subject: "",
    category: "",
    priority: "media",
    description: "",
  })

  const openTickets = tickets?.filter((t: any) => t.status === "abierto" || t.status === "en_progreso") ?? []

  async function handleSubmit() {
    if (!form.subject || !form.category || !form.description) {
      toast({ title: "Error", description: "Completa todos los campos obligatorios", variant: "destructive" })
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/portal/help-desk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Error al crear ticket")
      }
      toast({ title: "Ticket creado", description: "Tu solicitud fue registrada. Te notificaremos cuando haya novedades." })
      setForm({ subject: "", category: "", priority: "media", description: "" })
      setOpen(false)
      mutate()
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mesa de Ayuda</h1>
          <p className="text-muted-foreground">Solicita soporte tecnico, administrativo o de equipamiento</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Nuevo Ticket</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Nuevo Ticket de Soporte</DialogTitle>
              <DialogDescription>Describe tu problema o solicitud</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Asunto *</Label>
                <Input placeholder="Ej: No funciona el acceso al sistema" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Categoria *</Label>
                  <Select value={form.category} onValueChange={v => setForm(p => ({ ...p, category: v }))}>
                    <SelectTrigger><SelectValue placeholder="Selecciona" /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Prioridad</Label>
                  <Select value={form.priority} onValueChange={v => setForm(p => ({ ...p, priority: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baja">Baja</SelectItem>
                      <SelectItem value="media">Media</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="urgente">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Descripcion *</Label>
                <Textarea
                  rows={4}
                  placeholder="Detalla tu problema o solicitud..."
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Creando...</> : "Crear Ticket"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tickets Abiertos</CardTitle>
            <Clock className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent><div className="text-3xl font-bold text-foreground">{openTickets.length}</div></CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Resueltos</CardTitle>
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {tickets?.filter((t: any) => t.status === "resuelto").length ?? 0}
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
            <MessageSquare className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent><div className="text-3xl font-bold text-foreground">{tickets?.length ?? 0}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mis Tickets</CardTitle>
          <CardDescription>Historial de solicitudes de soporte</CardDescription>
        </CardHeader>
        <CardContent>
          {!tickets || tickets.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <HelpCircle className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p>No has creado tickets aun</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tickets.map((ticket: any) => {
                const cat = CATEGORIES.find(c => c.value === ticket.category)
                const CatIcon = cat?.icon || HelpCircle
                const prio = PRIORITY_MAP[ticket.priority] || PRIORITY_MAP.media
                const st = STATUS_MAP[ticket.status] || STATUS_MAP.abierto
                return (
                  <div key={ticket._id} className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="p-2.5 rounded-full bg-blue-100 text-blue-600 mt-0.5">
                          <CatIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{ticket.subject}</p>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{ticket.description}</p>
                          <p className="text-xs text-muted-foreground mt-2">{formatDate(ticket.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant={st.variant}>{st.label}</Badge>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${prio.color}`}>{prio.label}</span>
                      </div>
                    </div>
                    {ticket.response && (
                      <div className="mt-3 ml-12 p-3 rounded bg-muted/50 border-l-2 border-l-blue-300">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Respuesta:</p>
                        <p className="text-sm text-foreground">{ticket.response}</p>
                      </div>
                    )}
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
