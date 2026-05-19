"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { usePermissions } from "@/lib/auth/access-control"
import {
  EMPLOYEE_DOCUMENT_LABELS,
  COMPANY_DOCUMENT_TYPES,
  PERSONAL_DOCUMENT_TYPES,
  type EmployeeDocumentRecord,
  type EmployeeDocumentType,
} from "@/lib/employee-documents/types"
import { allowedUploadTypesForRole } from "@/lib/employee-documents/access"
import {
  FileText,
  Upload,
  Loader2,
  Trash2,
  ExternalLink,
  Building2,
  User,
} from "lucide-react"

type Props = {
  /** Modo legajo propio (portal del empleado) */
  mode?: "own" | "admin"
  employeeId?: string
  userId?: string
  employeeName?: string
}

function formatDate(d?: string) {
  if (!d) return "—"
  return new Date(d).toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" })
}

function statusBadge(status: string) {
  if (status === "vencido") return <Badge variant="destructive">Vencido</Badge>
  if (status === "pendiente") return <Badge variant="secondary">Pendiente</Badge>
  return <Badge variant="outline">Vigente</Badge>
}

export default function EmployeeDocumentsManager({
  mode = "own",
  employeeId,
  userId,
  employeeName,
}: Props) {
  const { toast } = useToast()
  const { user, role, can } = usePermissions()
  const fileRef = useRef<HTMLInputElement>(null)
  const [documents, setDocuments] = useState<EmployeeDocumentRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState({
    type: "certificado_medico" as EmployeeDocumentType,
    name: "",
    description: "",
    issuedAt: "",
    expiresAt: "",
  })

  const isOwn = mode === "own"
  const canManage = can("employees.documents.manage")
  const uploadTypes = allowedUploadTypesForRole(role, { isOwnProfile: isOwn })

  const queryKey = isOwn
    ? "/api/employee-documents"
    : `/api/employee-documents?${userId ? `userId=${userId}` : `employeeId=${employeeId}`}`

  const loadDocuments = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(queryKey)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error al cargar")
      setDocuments(data.documents || [])
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudieron cargar los documentos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [queryKey, toast])

  useEffect(() => {
    loadDocuments()
  }, [loadDocuments])

  const defaultTypeForTab = (tab: "empresa" | "personal"): EmployeeDocumentType =>
    tab === "empresa"
      ? uploadTypes.find((t) => COMPANY_DOCUMENT_TYPES.includes(t)) || "art"
      : uploadTypes.find((t) => PERSONAL_DOCUMENT_TYPES.includes(t)) || "certificado_medico"

  const handleUpload = async () => {
    const file = fileRef.current?.files?.[0]
    if (!file) {
      toast({ title: "Seleccione un archivo", variant: "destructive" })
      return
    }

    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      fd.append("type", form.type)
      fd.append("name", form.name)
      fd.append("description", form.description)
      if (form.issuedAt) fd.append("issuedAt", form.issuedAt)
      if (form.expiresAt) fd.append("expiresAt", form.expiresAt)
      if (!isOwn) {
        if (userId) fd.append("userId", userId)
        if (employeeId) fd.append("employeeId", employeeId)
      }

      const res = await fetch("/api/employee-documents/upload", { method: "POST", body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error al subir")

      toast({ title: "Documento cargado", description: "Se guardó correctamente en el legajo" })
      setUploadOpen(false)
      setForm({ type: defaultTypeForTab("personal"), name: "", description: "", issuedAt: "", expiresAt: "" })
      if (fileRef.current) fileRef.current.value = ""
      loadDocuments()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo subir",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      const res = await fetch(`/api/employee-documents/${deleteId}`, { method: "DELETE" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error al eliminar")
      toast({ title: "Documento eliminado" })
      loadDocuments()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo eliminar",
        variant: "destructive",
      })
    } finally {
      setDeleteId(null)
    }
  }

  const canUpload = uploadTypes.length > 0
  const canDeleteDoc = (doc: EmployeeDocumentRecord) => {
    if (canManage && !isOwn) return true
    if (isOwn && doc.category === "personal" && doc.uploadedBy === user?._id) return true
    return false
  }

  const renderList = (filter: "empresa" | "personal" | "all") => {
    const filtered =
      filter === "all" ? documents : documents.filter((d) => d.category === filter)

    if (loading) {
      return (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )
    }

    if (filtered.length === 0) {
      return (
        <div className="text-center py-10 text-muted-foreground">
          <FileText className="h-10 w-10 mx-auto mb-2 opacity-40" />
          <p>No hay documentos en esta sección</p>
        </div>
      )
    }

    return (
      <div className="space-y-3">
        {filtered.map((doc) => (
          <div
            key={doc._id}
            className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg border bg-card hover:bg-accent/30 transition-colors"
          >
            <div className="p-2 rounded-lg bg-blue-100 text-blue-700 shrink-0 w-fit">
              <FileText className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{doc.name}</p>
              <p className="text-xs text-muted-foreground">
                {EMPLOYEE_DOCUMENT_LABELS[doc.type] || doc.type} · {formatDate(doc.createdAt)}
                {doc.expiresAt ? ` · Vence ${formatDate(doc.expiresAt)}` : ""}
              </p>
              {doc.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{doc.description}</p>}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {statusBadge(doc.status)}
              <Button variant="outline" size="sm" asChild>
                <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Ver
                </a>
              </Button>
              {canDeleteDoc(doc) && (
                <Button variant="ghost" size="icon" onClick={() => setDeleteId(doc._id!)} className="text-red-600">
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const UploadDialog = ({ defaultTab }: { defaultTab: "empresa" | "personal" }) => (
    <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            setForm((f) => ({ ...f, type: defaultTypeForTab(defaultTab) }))
          }}
        >
          <Upload className="h-4 w-4 mr-2" />
          Subir documento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Subir documentación</DialogTitle>
          <DialogDescription>
            {isOwn
              ? "Cargá certificados, antecedentes, EPP y otros documentos personales."
              : `Documentación de ${employeeName || "empleado"} (ART, AFIP, recibos, etc.)`}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Tipo de documento</Label>
            <Select value={form.type} onValueChange={(v: EmployeeDocumentType) => setForm((p) => ({ ...p, type: v }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {uploadTypes.map((t) => (
                  <SelectItem key={t} value={t}>
                    {EMPLOYEE_DOCUMENT_LABELS[t]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Título (opcional)</Label>
            <Input
              placeholder={EMPLOYEE_DOCUMENT_LABELS[form.type]}
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Archivo (PDF, imagen o Word, máx. 15 MB)</Label>
            <Input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fecha emisión</Label>
              <Input
                type="date"
                value={form.issuedAt}
                onChange={(e) => setForm((p) => ({ ...p, issuedAt: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Vencimiento</Label>
              <Input
                type="date"
                value={form.expiresAt}
                onChange={(e) => setForm((p) => ({ ...p, expiresAt: e.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Notas</Label>
            <Textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setUploadOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleUpload} disabled={uploading}>
            {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {isOwn ? "Mi documentación digital" : `Legajo — ${employeeName || "Empleado"}`}
            </CardTitle>
            <CardDescription>
              {isOwn
                ? "Gestioná tu ART, certificados médicos, antecedentes, EPP y más."
                : "Cargá ART, seguros, AFIP, recibos y documentación que el empleado también verá en su portal."}
            </CardDescription>
          </div>
          {canUpload && <UploadDialog defaultTab={canManage && !isOwn ? "empresa" : "personal"} />}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={isOwn ? "personal" : "empresa"}>
          <TabsList className="mb-4">
            {!isOwn && (
              <TabsTrigger value="empresa" className="gap-2">
                <Building2 className="h-4 w-4" />
                Empresa / RRHH
              </TabsTrigger>
            )}
            <TabsTrigger value="personal" className="gap-2">
              <User className="h-4 w-4" />
              {isOwn ? "Mis documentos" : "Personales del empleado"}
            </TabsTrigger>
            <TabsTrigger value="todos">Todos</TabsTrigger>
          </TabsList>
          {!isOwn && <TabsContent value="empresa">{renderList("empresa")}</TabsContent>}
          <TabsContent value="personal">{renderList("personal")}</TabsContent>
          <TabsContent value="todos">{renderList("all")}</TabsContent>
        </Tabs>
      </CardContent>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar documento?</AlertDialogTitle>
            <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}