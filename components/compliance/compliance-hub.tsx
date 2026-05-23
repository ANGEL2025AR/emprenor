"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ComplianceSummaryPanel } from "@/components/compliance/summary-panel"
import { COMPLIANCE_DOC_LABELS, COMPLAINT_STATUS_LABELS, newRosterEntryId, uploadComplianceFile } from "@/components/compliance/constants"
import type { ChecklistItem } from "@/lib/compliance/roster"
import type { ComplianceDocumentCategory, ProjectInstitutionalCompliance, WorkforceRosterEntry } from "@/lib/db/models"
import { periodLabel } from "@/lib/compliance/period"
import {
  ArrowLeft,
  Download,
  Loader2,
  Plus,
  Save,
  Send,
  Trash2,
  Upload,
  ExternalLink,
} from "lucide-react"

type SummaryData = {
  project: {
    _id: string
    name: string
    code: string
    institutionalCompliance: ProjectInstitutionalCompliance
  }
  period: string
  canManage: boolean
  score: number
  checklist: ChecklistItem[]
  openIncidents: number
  openComplaints: number
  localPurchasesTotal: number
}

const emptyEntry = (): WorkforceRosterEntry => ({
  id: newRosterEntryId(),
  lastName: "",
  firstName: "",
  cuil: "",
  roleOnSite: "",
  gender: "M",
  address: "",
  city: "",
  province: "Jujuy",
  isLocalWorkforce: false,
  indigenousCommunity: { yes: false },
  codeOfConductSigned: false,
  patrimonyTrainingSigned: false,
  genderTrainingSigned: false,
  active: true,
})

export function ComplianceHub({
  projectId,
  backHref,
  backLabel = "Volver",
}: {
  projectId: string
  backHref: string
  backLabel?: string
}) {
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab") || "resumen"

  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<SummaryData | null>(null)
  const [period, setPeriod] = useState("")
  const [entries, setEntries] = useState<WorkforceRosterEntry[]>([])
  const [rosterStatus, setRosterStatus] = useState<"borrador" | "enviado">("borrador")
  const [saving, setSaving] = useState(false)

  const [documents, setDocuments] = useState<
    { _id: string; category: ComplianceDocumentCategory; title: string; fileUrl: string; fileName: string; validUntil?: string }[]
  >([])
  const [incidents, setIncidents] = useState<
    { _id: string; workerName: string; cuilOrDni: string; description: string; status: string; occurredAt: string }[]
  >([])
  const [purchases, setPurchases] = useState<
    { _id: string; date: string; detail: string; provider: string; location: string; amount: number }[]
  >([])
  const [complaints, setComplaints] = useState<
    { _id: string; date: string; source: string; description: string; status: string; response?: string }[]
  >([])

  const [settings, setSettings] = useState<ProjectInstitutionalCompliance>({ enabled: false })

  const loadSummary = useCallback(async (p?: string) => {
    const q = p ? `?period=${p}` : ""
    const res = await fetch(`/api/compliance/summary/${projectId}${q}`, { credentials: "include" })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error)
    setSummary(data)
    setPeriod(data.period)
    if (data.roster?.entries) {
      setEntries(data.roster.entries)
      setRosterStatus(data.roster.status)
    } else {
      setEntries([])
      setRosterStatus("borrador")
    }
  }, [projectId])

  const loadExtras = useCallback(async () => {
    const [d, i, p, c] = await Promise.all([
      fetch(`/api/compliance/documents/${projectId}`, { credentials: "include" }).then((r) => r.json()),
      fetch(`/api/compliance/incidents/${projectId}`, { credentials: "include" }).then((r) => r.json()),
      fetch(`/api/compliance/purchases/${projectId}`, { credentials: "include" }).then((r) => r.json()),
      fetch(`/api/compliance/complaints/${projectId}`, { credentials: "include" }).then((r) => r.json()),
    ])
    setDocuments(d.documents ?? [])
    setIncidents(i.incidents ?? [])
    setPurchases(p.purchases ?? [])
    setComplaints(c.complaints ?? [])
  }, [projectId])

  const loadSettings = useCallback(async () => {
    const res = await fetch(`/api/compliance/settings/${projectId}`, { credentials: "include" })
    const data = await res.json()
    if (res.ok) setSettings(data.settings ?? { enabled: false })
  }, [projectId])

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      await Promise.all([loadSummary(period || undefined), loadExtras(), loadSettings()])
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "No se pudo cargar", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }, [loadSummary, loadExtras, loadSettings, period, toast])

  useEffect(() => {
    void refresh()
  }, [projectId])

  const setTab = (t: string) => {
    router.replace(`?tab=${t}`, { scroll: false })
  }

  const saveRoster = async (submit = false) => {
    setSaving(true)
    try {
      const res = await fetch(`/api/compliance/roster/${projectId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ period, entries, submit }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast({
        title: submit ? "Nómina enviada" : "Nómina guardada",
        description: submit ? "El cliente puede ver la nómina del periodo." : "Borrador actualizado.",
      })
      setRosterStatus(data.status)
      await loadSummary(period)
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Error al guardar", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/compliance/settings/${projectId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast({ title: "Configuración guardada" })
      await loadSummary(period)
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Error", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const canManage = summary?.canManage ?? false

  if (loading && !summary) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!summary?.project.institutionalCompliance?.enabled && !canManage) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          El portal de cumplimiento institucional no está habilitado para esta obra.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" size="sm" asChild>
          <Link href={backHref}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {backLabel}
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold">{summary?.project.name}</h1>
          <p className="text-sm text-muted-foreground">{summary?.project.code} · Cumplimiento institucional</p>
        </div>
        <div className="ml-auto flex gap-2">
          <Link href={`/dashboard/proyectos/${projectId}`}>
            <Button variant="ghost" size="sm">
              Ver obra <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </Link>
        </div>
      </div>

      {!summary?.project.institutionalCompliance?.enabled && canManage ? (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="py-4 text-sm">
            Activá el cumplimiento institucional en la pestaña <strong>Configuración</strong> para habilitar el portal al cliente (FAO, etc.).
          </CardContent>
        </Card>
      ) : null}

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="nomina">Nómina y ART</TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
          <TabsTrigger value="incidentes">Incidentes</TabsTrigger>
          <TabsTrigger value="compras">Compras locales</TabsTrigger>
          <TabsTrigger value="quejas">Quejas de obra</TabsTrigger>
          {canManage ? <TabsTrigger value="config">Configuración</TabsTrigger> : null}
        </TabsList>

        <TabsContent value="resumen" className="mt-6">
          {summary ? (
            <ComplianceSummaryPanel
              score={summary.score}
              checklist={summary.checklist}
              projectName={summary.project.name}
              clientOrganization={summary.project.institutionalCompliance?.clientOrganization}
              openIncidents={summary.openIncidents}
              openComplaints={summary.openComplaints}
              localPurchasesTotal={summary.localPurchasesTotal}
            />
          ) : null}
        </TabsContent>

        <TabsContent value="nomina" className="mt-6 space-y-4">
          <RosterTab
            period={period}
            onPeriodChange={setPeriod}
            entries={entries}
            onEntriesChange={setEntries}
            rosterStatus={rosterStatus}
            canManage={canManage}
            saving={saving}
            onSave={() => saveRoster(false)}
            onSubmit={() => saveRoster(true)}
            projectId={projectId}
            onReload={() => loadSummary(period)}
          />
        </TabsContent>

        <TabsContent value="documentos" className="mt-6">
          <DocumentsTab
            documents={documents}
            canManage={canManage}
            projectId={projectId}
            onRefresh={loadExtras}
          />
        </TabsContent>

        <TabsContent value="incidentes" className="mt-6">
          <IncidentsTab incidents={incidents} canManage={canManage} projectId={projectId} onRefresh={loadExtras} />
        </TabsContent>

        <TabsContent value="compras" className="mt-6">
          <PurchasesTab purchases={purchases} canManage={canManage} projectId={projectId} onRefresh={loadExtras} />
        </TabsContent>

        <TabsContent value="quejas" className="mt-6">
          <ComplaintsTab complaints={complaints} canManage={canManage} projectId={projectId} onRefresh={loadExtras} />
        </TabsContent>

        {canManage ? (
          <TabsContent value="config" className="mt-6">
            <SettingsTab settings={settings} onChange={setSettings} onSave={saveSettings} saving={saving} />
          </TabsContent>
        ) : null}
      </Tabs>
    </div>
  )
}

function RosterTab({
  period,
  onPeriodChange,
  entries,
  onEntriesChange,
  rosterStatus,
  canManage,
  saving,
  onSave,
  onSubmit,
  projectId,
  onReload,
}: {
  period: string
  onPeriodChange: (p: string) => void
  entries: WorkforceRosterEntry[]
  onEntriesChange: (e: WorkforceRosterEntry[]) => void
  rosterStatus: string
  canManage: boolean
  saving: boolean
  onSave: () => void
  onSubmit: () => void
  projectId: string
  onReload: () => void
}) {
  const update = (id: string, patch: Partial<WorkforceRosterEntry>) => {
    onEntriesChange(entries.map((e) => (e.id === id ? { ...e, ...patch } : e)))
  }

  const women = entries.filter((e) => e.active && e.gender === "F").length
  const men = entries.filter((e) => e.active && e.gender === "M").length
  const local = entries.filter((e) => e.active && e.isLocalWorkforce).length
  const total = entries.filter((e) => e.active).length

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-end">
        <div className="space-y-1">
          <Label>Periodo (YYYY-MM)</Label>
          <Input value={period} onChange={(e) => onPeriodChange(e.target.value)} className="w-40" disabled={!canManage} />
        </div>
        <Badge>{periodLabel(period)}</Badge>
        <Badge variant={rosterStatus === "enviado" ? "default" : "secondary"}>{rosterStatus === "enviado" ? "Enviado al cliente" : "Borrador"}</Badge>
        <Button variant="outline" size="sm" onClick={onReload}>
          Recargar
        </Button>
        <Button variant="outline" size="sm" asChild>
          <a href={`/api/compliance/roster/${projectId}/export?period=${period}`} download>
            <Download className="h-4 w-4 mr-1" /> Exportar Excel/CSV
          </a>
        </Button>
        {canManage ? (
          <>
            <Button size="sm" onClick={onSave} disabled={saving}>
              <Save className="h-4 w-4 mr-1" /> Guardar
            </Button>
            <Button size="sm" variant="default" onClick={onSubmit} disabled={saving}>
              <Send className="h-4 w-4 mr-1" /> Enviar al cliente
            </Button>
            <Button size="sm" variant="secondary" onClick={() => onEntriesChange([...entries, emptyEntry()])}>
              <Plus className="h-4 w-4 mr-1" /> Persona
            </Button>
          </>
        ) : null}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
        <Card><CardContent className="p-3"><p className="text-muted-foreground">Total</p><p className="text-xl font-bold">{total}</p></CardContent></Card>
        <Card><CardContent className="p-3"><p className="text-muted-foreground">Mujeres</p><p className="text-xl font-bold">{women}</p></CardContent></Card>
        <Card><CardContent className="p-3"><p className="text-muted-foreground">Varones</p><p className="text-xl font-bold">{men}</p></CardContent></Card>
        <Card><CardContent className="p-3"><p className="text-muted-foreground">% local</p><p className="text-xl font-bold">{total ? Math.round((local / total) * 100) : 0}%</p></CardContent></Card>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm min-w-[900px]">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-2 text-left">Apellido</th>
              <th className="p-2 text-left">Nombre</th>
              <th className="p-2">CUIL</th>
              <th className="p-2">Cargo</th>
              <th className="p-2">Sexo</th>
              <th className="p-2">ART / Seguro</th>
              <th className="p-2">Local</th>
              <th className="p-2">Conducta</th>
              {canManage ? <th className="p-2" /> : null}
            </tr>
          </thead>
          <tbody>
            {entries.filter((e) => e.active).map((e) => (
              <tr key={e.id} className="border-t">
                <td className="p-1"><Input value={e.lastName} disabled={!canManage} onChange={(ev) => update(e.id, { lastName: ev.target.value })} className="h-8" /></td>
                <td className="p-1"><Input value={e.firstName} disabled={!canManage} onChange={(ev) => update(e.id, { firstName: ev.target.value })} className="h-8" /></td>
                <td className="p-1"><Input value={e.cuil} disabled={!canManage} onChange={(ev) => update(e.id, { cuil: ev.target.value })} className="h-8 w-32" /></td>
                <td className="p-1"><Input value={e.roleOnSite} disabled={!canManage} onChange={(ev) => update(e.id, { roleOnSite: ev.target.value })} className="h-8" /></td>
                <td className="p-1">
                  <Select value={e.gender} disabled={!canManage} onValueChange={(v) => update(e.id, { gender: v as "M" | "F" })}>
                    <SelectTrigger className="h-8 w-16"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="M">M</SelectItem><SelectItem value="F">F</SelectItem></SelectContent>
                  </Select>
                </td>
                <td className="p-1"><Input value={e.artInsuranceNumber ?? ""} disabled={!canManage} onChange={(ev) => update(e.id, { artInsuranceNumber: ev.target.value })} className="h-8" placeholder="Nº asegurado" /></td>
                <td className="p-1 text-center"><Checkbox checked={e.isLocalWorkforce} disabled={!canManage} onCheckedChange={(c) => update(e.id, { isLocalWorkforce: !!c })} /></td>
                <td className="p-1 text-center"><Checkbox checked={e.codeOfConductSigned} disabled={!canManage} onCheckedChange={(c) => update(e.id, { codeOfConductSigned: !!c })} /></td>
                {canManage ? (
                  <td className="p-1">
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => update(e.id, { active: false })}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {entries.length === 0 ? <p className="text-sm text-muted-foreground text-center py-6">Sin personal cargado para este periodo.</p> : null}
    </div>
  )
}

function DocumentsTab({
  documents,
  canManage,
  projectId,
  onRefresh,
}: {
  documents: { _id: string; category: ComplianceDocumentCategory; title: string; fileUrl: string; fileName: string; validUntil?: string }[]
  canManage: boolean
  projectId: string
  onRefresh: () => void
}) {
  const { toast } = useToast()
  const [uploading, setUploading] = useState(false)
  const [category, setCategory] = useState<ComplianceDocumentCategory>("art_policy")
  const [title, setTitle] = useState("")

  const handleUpload = async (file: File) => {
    setUploading(true)
    try {
      const up = await uploadComplianceFile(file)
      const res = await fetch(`/api/compliance/documents/${projectId}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          title: title || COMPLIANCE_DOC_LABELS[category],
          fileUrl: up.url,
          fileName: up.fileName,
          mimeType: up.mimeType,
          fileSize: up.fileSize,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast({ title: "Documento cargado" })
      setTitle("")
      onRefresh()
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "", variant: "destructive" })
    } finally {
      setUploading(false)
    }
  }

  const remove = async (docId: string) => {
    await fetch(`/api/compliance/documents/${projectId}/${docId}`, { method: "DELETE", credentials: "include" })
    onRefresh()
  }

  return (
    <div className="space-y-4">
      {canManage ? (
        <Card>
          <CardHeader><CardTitle className="text-base">Subir documentación</CardTitle></CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Categoría</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as ComplianceDocumentCategory)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(COMPLIANCE_DOC_LABELS).map(([k, label]) => (
                    <SelectItem key={k} value={k}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Título (opcional)</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={COMPLIANCE_DOC_LABELS[category]} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="doc-file" className="cursor-pointer inline-flex items-center gap-2 border rounded-lg px-4 py-3 hover:bg-slate-50">
                <Upload className="h-4 w-4" />
                {uploading ? "Subiendo…" : "Seleccionar PDF o imagen desde PC"}
              </Label>
              <input id="doc-file" type="file" accept=".pdf,image/*" className="hidden" disabled={uploading} onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleUpload(f) }} />
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="space-y-2">
        {documents.length === 0 ? <p className="text-muted-foreground text-sm">Sin documentos cargados.</p> : null}
        {documents.map((d) => (
          <div key={d._id} className="flex items-center justify-between gap-2 rounded-lg border p-3">
            <div>
              <p className="font-medium">{d.title}</p>
              <p className="text-xs text-muted-foreground">{COMPLIANCE_DOC_LABELS[d.category]} · {d.fileName}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild><a href={d.fileUrl} target="_blank" rel="noreferrer">Ver</a></Button>
              {canManage ? <Button variant="ghost" size="icon" onClick={() => remove(d._id)}><Trash2 className="h-4 w-4" /></Button> : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function IncidentsTab({ incidents, canManage, projectId, onRefresh }: { incidents: { _id: string; workerName: string; cuilOrDni: string; description: string; status: string; occurredAt: string }[]; canManage: boolean; projectId: string; onRefresh: () => void }) {
  const { toast } = useToast()
  const [form, setForm] = useState({ cuilOrDni: "", workerName: "", description: "", careProvided: "", artManagementDetail: "" })

  const submit = async () => {
    const res = await fetch(`/api/compliance/incidents/${projectId}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (!res.ok) { toast({ title: "Error", description: data.error, variant: "destructive" }); return }
    toast({ title: "Incidente registrado" })
    setForm({ cuilOrDni: "", workerName: "", description: "", careProvided: "", artManagementDetail: "" })
    onRefresh()
  }

  return (
    <div className="space-y-4">
      {canManage ? (
        <Card>
          <CardHeader><CardTitle className="text-base">Registrar incidente / accidente</CardTitle></CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Input placeholder="CUIL/DNI" value={form.cuilOrDni} onChange={(e) => setForm({ ...form, cuilOrDni: e.target.value })} />
            <Input placeholder="Nombre trabajador" value={form.workerName} onChange={(e) => setForm({ ...form, workerName: e.target.value })} />
            <Textarea className="sm:col-span-2" placeholder="Descripción" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <Textarea placeholder="Atención brindada" value={form.careProvided} onChange={(e) => setForm({ ...form, careProvided: e.target.value })} />
            <Textarea placeholder="Gestión ante ART" value={form.artManagementDetail} onChange={(e) => setForm({ ...form, artManagementDetail: e.target.value })} />
            <Button onClick={submit} className="sm:col-span-2">Registrar</Button>
          </CardContent>
        </Card>
      ) : null}
      {incidents.map((i) => (
        <Card key={i._id}>
          <CardContent className="p-4">
            <div className="flex justify-between gap-2">
              <div>
                <p className="font-medium">{i.workerName} · {i.cuilOrDni}</p>
                <p className="text-sm text-muted-foreground">{new Date(i.occurredAt).toLocaleDateString("es-AR")}</p>
                <p className="text-sm mt-2">{i.description}</p>
              </div>
              <Badge>{i.status}</Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function PurchasesTab({ purchases, canManage, projectId, onRefresh }: { purchases: { _id: string; date: string; detail: string; provider: string; location: string; amount: number }[]; canManage: boolean; projectId: string; onRefresh: () => void }) {
  const { toast } = useToast()
  const [form, setForm] = useState({ detail: "", provider: "", location: "", amount: "" })

  const submit = async () => {
    const res = await fetch(`/api/compliance/purchases/${projectId}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, amount: Number(form.amount) }),
    })
    if (!res.ok) { toast({ title: "Error", variant: "destructive" }); return }
    toast({ title: "Compra registrada" })
    setForm({ detail: "", provider: "", location: "", amount: "" })
    onRefresh()
  }

  const total = purchases.reduce((s, p) => s + p.amount, 0)

  return (
    <div className="space-y-4">
      <p className="text-lg font-semibold">Total compras locales: ${total.toLocaleString("es-AR")}</p>
      {canManage ? (
        <Card>
          <CardContent className="grid gap-3 sm:grid-cols-2 pt-6">
            <Input placeholder="Detalle (alojamiento, materiales…)" value={form.detail} onChange={(e) => setForm({ ...form, detail: e.target.value })} />
            <Input placeholder="Proveedor" value={form.provider} onChange={(e) => setForm({ ...form, provider: e.target.value })} />
            <Input placeholder="Ubicación" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            <Input type="number" placeholder="Monto ARS" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            <Button onClick={submit} className="sm:col-span-2">Agregar</Button>
          </CardContent>
        </Card>
      ) : null}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-slate-50"><tr><th className="p-2 text-left">Fecha</th><th>Detalle</th><th>Proveedor</th><th>Monto</th></tr></thead>
          <tbody>
            {purchases.map((p) => (
              <tr key={p._id} className="border-t">
                <td className="p-2">{new Date(p.date).toLocaleDateString("es-AR")}</td>
                <td className="p-2">{p.detail}</td>
                <td className="p-2">{p.provider}</td>
                <td className="p-2">${p.amount.toLocaleString("es-AR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ComplaintsTab({ complaints, canManage, projectId, onRefresh }: { complaints: { _id: string; date: string; source: string; description: string; status: string; response?: string }[]; canManage: boolean; projectId: string; onRefresh: () => void }) {
  const { toast } = useToast()
  const [desc, setDesc] = useState("")

  const submit = async () => {
    const res = await fetch(`/api/compliance/complaints/${projectId}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: desc, source: "Libro de quejas / comunidad" }),
    })
    if (!res.ok) { toast({ title: "Error", variant: "destructive" }); return }
    setDesc("")
    onRefresh()
  }

  return (
    <div className="space-y-4">
      {canManage ? (
        <Card>
          <CardContent className="pt-6 space-y-3">
            <Textarea placeholder="Nueva queja o reclamo de obra" value={desc} onChange={(e) => setDesc(e.target.value)} />
            <Button onClick={submit}>Registrar en libro de quejas</Button>
          </CardContent>
        </Card>
      ) : null}
      {complaints.map((c) => (
        <Card key={c._id}>
          <CardContent className="p-4">
            <div className="flex justify-between">
              <Badge>{COMPLAINT_STATUS_LABELS[c.status as keyof typeof COMPLAINT_STATUS_LABELS] ?? c.status}</Badge>
              <span className="text-xs text-muted-foreground">{new Date(c.date).toLocaleDateString("es-AR")}</span>
            </div>
            <p className="font-medium mt-2">{c.source}</p>
            <p className="text-sm">{c.description}</p>
            {c.response ? <p className="text-sm text-muted-foreground mt-2">Respuesta: {c.response}</p> : null}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function SettingsTab({
  settings,
  onChange,
  onSave,
  saving,
}: {
  settings: ProjectInstitutionalCompliance
  onChange: (s: ProjectInstitutionalCompliance) => void
  onSave: () => void
  saving: boolean
}) {
  const patch = (p: Partial<ProjectInstitutionalCompliance>) => onChange({ ...settings, ...p })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuración — Cliente institucional (FAO, etc.)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Habilitar portal de cumplimiento</Label>
          <Switch checked={settings.enabled} onCheckedChange={(c) => patch({ enabled: c })} />
        </div>
        <Input placeholder="Organización cliente (ej: FAO)" value={settings.clientOrganization ?? ""} onChange={(e) => patch({ clientOrganization: e.target.value })} />
        <Input placeholder="Referencia contrato / orden de compra" value={settings.contractReference ?? settings.orderReference ?? ""} onChange={(e) => patch({ contractReference: e.target.value, orderReference: e.target.value })} />
        <Input placeholder="Ubicación libro de quejas (obrador)" value={settings.complaintBookLocation ?? ""} onChange={(e) => patch({ complaintBookLocation: e.target.value })} />
        <Input placeholder="Email salvaguardas (MAC)" value={settings.macEmail ?? ""} onChange={(e) => patch({ macEmail: e.target.value })} />
        <Input placeholder="Línea directa contratista" value={settings.contractorHotline ?? ""} onChange={(e) => patch({ contractorHotline: e.target.value })} />
        <div className="grid sm:grid-cols-2 gap-3">
          <Input placeholder="Responsable social — nombre" value={settings.socialResponsible?.name ?? ""} onChange={(e) => patch({ socialResponsible: { ...settings.socialResponsible, name: e.target.value, phone: settings.socialResponsible?.phone ?? "" } })} />
          <Input placeholder="Responsable social — teléfono" value={settings.socialResponsible?.phone ?? ""} onChange={(e) => patch({ socialResponsible: { name: settings.socialResponsible?.name ?? "", phone: e.target.value, email: settings.socialResponsible?.email } })} />
        </div>
        <Button onClick={onSave} disabled={saving}>{saving ? "Guardando…" : "Guardar configuración"}</Button>
      </CardContent>
    </Card>
  )
}
