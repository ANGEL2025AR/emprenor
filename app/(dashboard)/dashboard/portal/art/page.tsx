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
  ShieldAlert, AlertTriangle, Plus, Clock,
  CheckCircle2, MapPin, Calendar, Loader2,
  HardHat, Activity, FileWarning,
} from "lucide-react"

const fetcher = (url: string) => fetch(url).then(r => r.json())

const SEVERITY_MAP: Record<string, { label: string; color: string }> = {
  leve: { label: "Leve", color: "bg-amber-100 text-amber-700" },
  moderado: { label: "Moderado", color: "bg-orange-100 text-orange-700" },
  grave: { label: "Grave", color: "bg-red-100 text-red-700" },
  muy_grave: { label: "Muy Grave", color: "bg-red-200 text-red-800" },
}

const STATUS_MAP: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  reportado: { label: "Reportado", variant: "secondary" },
  en_investigacion: { label: "En Investigacion", variant: "outline" },
  resuelto: { label: "Resuelto", variant: "default" },
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" })
}

export default function ARTPage() {
  const { toast } = useToast()
  const { data: accidents, mutate } = useSWR("/api/portal/accidents", fetcher)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    date: "",
    location: "",
    severity: "",
    description: "",
    injuryType: "",
    witnesses: "",
  })

  async function handleSubmit() {
    if (!form.date || !form.location || !form.severity || !form.description) {
      toast({ title: "Error", description: "Completa todos los campos obligatorios", variant: "destructive" })
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/portal/accidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Error al reportar accidente")
      }
      toast({ title: "Reporte enviado", description: "El accidente fue reportado correctamente a ART" })
      setForm({ date: "", location: "", severity: "", description: "", injuryType: "", witnesses: "" })
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
          <h1 className="text-2xl font-bold text-foreground">ART y Seguridad Laboral</h1>
          <p className="text-muted-foreground">Reporta accidentes laborales y consulta el historial</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive"><Plus className="h-4 w-4 mr-2" />Reportar Accidente</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Reportar Accidente Laboral</DialogTitle>
              <DialogDescription>Completa todos los datos del incidente para el reporte a ART</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Fecha del Accidente *</Label>
                  <Input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Gravedad *</Label>
                  <Select value={form.severity} onValueChange={v => setForm(p => ({ ...p, severity: v }))}>
                    <SelectTrigger><SelectValue placeholder="Selecciona" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="leve">Leve</SelectItem>
                      <SelectItem value="moderado">Moderado</SelectItem>
                      <SelectItem value="grave">Grave</SelectItem>
                      <SelectItem value="muy_grave">Muy Grave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Lugar del Accidente *</Label>
                <Input placeholder="Ej: Obra calle San Martin 450" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Tipo de Lesion</Label>
                <Input placeholder="Ej: Corte en mano derecha" value={form.injuryType} onChange={e => setForm(p => ({ ...p, injuryType: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Descripcion del Accidente *</Label>
                <Textarea
                  placeholder="Describe como ocurrio el accidente..."
                  rows={4}
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Testigos</Label>
                <Input placeholder="Nombres de testigos presentes" value={form.witnesses} onChange={e => setForm(p => ({ ...p, witnesses: e.target.value }))} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button variant="destructive" onClick={handleSubmit} disabled={loading}>
                {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Enviando...</> : "Enviar Reporte"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Accidentes Reportados</CardTitle>
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{accidents?.length ?? 0}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">En Investigacion</CardTitle>
            <Clock className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {accidents?.filter((a: any) => a.status === "en_investigacion").length ?? 0}
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Resueltos</CardTitle>
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {accidents?.filter((a: any) => a.status === "resuelto").length ?? 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Accidentes</CardTitle>
          <CardDescription>Registro de accidentes laborales reportados</CardDescription>
        </CardHeader>
        <CardContent>
          {!accidents || accidents.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ShieldAlert className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p>No hay accidentes reportados</p>
            </div>
          ) : (
            <div className="space-y-3">
              {accidents.map((acc: any) => {
                const sev = SEVERITY_MAP[acc.severity] || SEVERITY_MAP.leve
                const st = STATUS_MAP[acc.status] || STATUS_MAP.reportado
                return (
                  <div key={acc._id} className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="p-2.5 rounded-full bg-red-100 text-red-600 mt-0.5">
                          <AlertTriangle className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{acc.injuryType || "Accidente laboral"}</p>
                          <p className="text-sm text-muted-foreground mt-1">{acc.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(acc.date)}</span>
                            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{acc.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${sev.color}`}>{sev.label}</span>
                        <Badge variant={st.variant}>{st.label}</Badge>
                      </div>
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
