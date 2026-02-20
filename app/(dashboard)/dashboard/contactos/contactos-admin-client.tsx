"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { usePermissions } from "@/lib/auth/access-control"
import type { SerializableUser } from "@/lib/auth/session"
import {
  Mail,
  Phone,
  Building2,
  Clock,
  Search,
  CheckCircle2,
  XCircle,
  Loader2,
  Trash2,
  MessageSquare,
  User,
  ExternalLink,
  Filter,
  MailOpen,
  AlertCircle,
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Contacto {
  _id: string
  name: string
  email: string
  phone?: string
  company?: string
  service?: string
  message: string
  status: string
  notes?: string
  priority?: string
  source: string
  createdAt: string
  resolvedAt?: string
  resolvedBy?: { name: string }
  updatedBy?: { name: string }
  updatedAt?: string
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof Mail }> = {
  nuevo: { label: "Nuevo", color: "bg-blue-100 text-blue-800", icon: Mail },
  en_proceso: { label: "En Proceso", color: "bg-yellow-100 text-yellow-800", icon: MailOpen },
  resuelto: { label: "Resuelto", color: "bg-green-100 text-green-800", icon: CheckCircle2 },
  descartado: { label: "Descartado", color: "bg-red-100 text-red-800", icon: XCircle },
}

const PRIORITY_CONFIG: Record<string, { label: string; color: string }> = {
  alta: { label: "Alta", color: "bg-red-100 text-red-800" },
  media: { label: "Media", color: "bg-yellow-100 text-yellow-800" },
  baja: { label: "Baja", color: "bg-gray-100 text-gray-800" },
}

export function ContactosAdminClient({ currentUser }: { currentUser: SerializableUser }) {
  const [contactos, setContactos] = useState<Contacto[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("todos")
  const [selectedContacto, setSelectedContacto] = useState<Contacto | null>(null)
  const [notes, setNotes] = useState("")
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const { toast } = useToast()
  const { can } = usePermissions()

  const fetchContactos = useCallback(async () => {
    try {
      const res = await fetch("/api/contact")
      if (!res.ok) throw new Error("Error al cargar contactos")
      const data = await res.json()
      setContactos(data.contactos || [])
    } catch {
      toast({ title: "Error", description: "No se pudieron cargar los contactos", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchContactos()
  }, [fetchContactos])

  const updateContacto = async (id: string, data: Record<string, unknown>) => {
    setUpdatingId(id)
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Error al actualizar")
      }
      toast({ title: "Actualizado", description: "El contacto ha sido actualizado correctamente." })
      fetchContactos()
      setSelectedContacto(null)
      setNotes("")
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "No se pudo actualizar el contacto",
        variant: "destructive",
      })
    } finally {
      setUpdatingId(null)
    }
  }

  const deleteContacto = async (id: string) => {
    setUpdatingId(id)
    try {
      const res = await fetch(`/api/contact/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Error al eliminar")
      toast({ title: "Eliminado", description: "El contacto ha sido eliminado." })
      fetchContactos()
      setSelectedContacto(null)
    } catch {
      toast({ title: "Error", description: "No se pudo eliminar el contacto", variant: "destructive" })
    } finally {
      setUpdatingId(null)
    }
  }

  const filteredContactos = contactos.filter((c) => {
    const matchesSearch =
      searchQuery === "" ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "todos" || c.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const statusCounts = {
    todos: contactos.length,
    nuevo: contactos.filter((c) => c.status === "nuevo").length,
    en_proceso: contactos.filter((c) => c.status === "en_proceso").length,
    resuelto: contactos.filter((c) => c.status === "resuelto").length,
    descartado: contactos.filter((c) => c.status === "descartado").length,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <MessageSquare className="w-7 h-7 text-emerald-600" />
          Gestion de Contactos
        </h1>
        <p className="text-slate-500 mt-1">
          Administra las consultas recibidas desde el formulario de contacto web.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {Object.entries(statusCounts).map(([key, count]) => {
          const isActive = statusFilter === key
          const config = STATUS_CONFIG[key]
          return (
            <button
              key={key}
              onClick={() => setStatusFilter(key)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isActive
                  ? "border-emerald-300 bg-emerald-50 shadow-sm"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <p className="text-xs text-slate-500 capitalize">
                {key === "todos" ? "Todos" : config?.label || key}
              </p>
              <p className="text-xl font-bold text-slate-900 mt-1">{count}</p>
            </button>
          )
        })}
      </div>

      {/* Busqueda */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Buscar por nombre, email, empresa o mensaje..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="nuevo">Nuevos</SelectItem>
              <SelectItem value="en_proceso">En Proceso</SelectItem>
              <SelectItem value="resuelto">Resueltos</SelectItem>
              <SelectItem value="descartado">Descartados</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lista de contactos */}
      {filteredContactos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Mail className="w-12 h-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-700">No hay contactos</h3>
            <p className="text-slate-500 text-sm mt-1">
              {searchQuery || statusFilter !== "todos"
                ? "No se encontraron contactos con los filtros aplicados."
                : "Aun no se han recibido consultas desde el formulario web."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredContactos.map((contacto) => {
            const config = STATUS_CONFIG[contacto.status] || STATUS_CONFIG.nuevo
            const StatusIcon = config.icon
            const priorityConfig = contacto.priority ? PRIORITY_CONFIG[contacto.priority] : null

            return (
              <Card
                key={contacto._id}
                className={`transition-all hover:shadow-md cursor-pointer ${
                  contacto.status === "nuevo" ? "border-l-4 border-l-blue-500" : ""
                }`}
                onClick={() => {
                  setSelectedContacto(contacto)
                  setNotes(contacto.notes || "")
                }}
              >
                <CardContent className="p-4 md:p-5">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                    {/* Info principal */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <h3 className="font-semibold text-slate-900">{contacto.name}</h3>
                        <Badge className={config.color} variant="secondary">
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {config.label}
                        </Badge>
                        {priorityConfig && (
                          <Badge className={priorityConfig.color} variant="secondary">
                            {priorityConfig.label}
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 mb-2">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5" />
                          {contacto.email}
                        </span>
                        {contacto.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5" />
                            {contacto.phone}
                          </span>
                        )}
                        {contacto.company && (
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5" />
                            {contacto.company}
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-slate-600 line-clamp-2">{contacto.message}</p>

                      {contacto.service && (
                        <Badge variant="outline" className="mt-2 text-xs">
                          {contacto.service}
                        </Badge>
                      )}
                    </div>

                    {/* Fecha y acciones rapidas */}
                    <div className="flex flex-row md:flex-col items-center md:items-end gap-2 text-xs text-slate-400 flex-shrink-0">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(contacto.createdAt).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      {contacto.resolvedBy && (
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {contacto.resolvedBy.name}
                        </span>
                      )}

                      {can("contacts.manage") && contacto.status === "nuevo" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs h-7"
                          onClick={(e) => {
                            e.stopPropagation()
                            updateContacto(contacto._id, { status: "en_proceso" })
                          }}
                          disabled={updatingId === contacto._id}
                        >
                          {updatingId === contacto._id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            "Tomar"
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Dialog de detalle */}
      <Dialog open={!!selectedContacto} onOpenChange={(open) => !open && setSelectedContacto(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedContacto && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {selectedContacto.name}
                </DialogTitle>
                <DialogDescription>
                  Recibido el{" "}
                  {new Date(selectedContacto.createdAt).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                {/* Info de contacto */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <a
                      href={`mailto:${selectedContacto.email}`}
                      className="text-emerald-600 hover:underline flex items-center gap-1"
                    >
                      {selectedContacto.email}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  {selectedContacto.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <a
                        href={`tel:${selectedContacto.phone}`}
                        className="text-emerald-600 hover:underline"
                      >
                        {selectedContacto.phone}
                      </a>
                    </div>
                  )}
                  {selectedContacto.company && (
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      <span>{selectedContacto.company}</span>
                    </div>
                  )}
                  {selectedContacto.service && (
                    <div className="flex items-center gap-2 text-sm">
                      <AlertCircle className="w-4 h-4 text-slate-400" />
                      <span>{selectedContacto.service}</span>
                    </div>
                  )}
                </div>

                {/* Estado y prioridad */}
                <div className="flex items-center gap-3">
                  <Badge className={STATUS_CONFIG[selectedContacto.status]?.color} variant="secondary">
                    {STATUS_CONFIG[selectedContacto.status]?.label || selectedContacto.status}
                  </Badge>
                  {selectedContacto.priority && (
                    <Badge className={PRIORITY_CONFIG[selectedContacto.priority]?.color} variant="secondary">
                      Prioridad: {PRIORITY_CONFIG[selectedContacto.priority]?.label}
                    </Badge>
                  )}
                </div>

                {/* Mensaje */}
                <Card className="bg-slate-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Mensaje</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">{selectedContacto.message}</p>
                  </CardContent>
                </Card>

                {/* Notas internas */}
                {can("contacts.manage") && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Notas internas</label>
                    <Textarea
                      placeholder="Agrega notas sobre esta consulta..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                  </div>
                )}

                {/* Info de seguimiento */}
                {selectedContacto.updatedBy && (
                  <p className="text-xs text-slate-400">
                    Ultima actualizacion por {selectedContacto.updatedBy.name} el{" "}
                    {selectedContacto.updatedAt
                      ? new Date(selectedContacto.updatedAt).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </p>
                )}

                {/* Cambiar prioridad */}
                {can("contacts.manage") && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Prioridad</label>
                    <Select
                      value={selectedContacto.priority || ""}
                      onValueChange={(val) =>
                        updateContacto(selectedContacto._id, {
                          priority: val,
                          notes: notes || undefined,
                        })
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sin prioridad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="alta">Alta</SelectItem>
                        <SelectItem value="media">Media</SelectItem>
                        <SelectItem value="baja">Baja</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                {can("contacts.manage") && (
                  <>
                    {selectedContacto.status !== "resuelto" && (
                      <Button
                        onClick={() =>
                          updateContacto(selectedContacto._id, {
                            status: "resuelto",
                            notes: notes || undefined,
                          })
                        }
                        disabled={updatingId === selectedContacto._id}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {updatingId === selectedContacto._id ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                        )}
                        Marcar como Resuelto
                      </Button>
                    )}

                    {selectedContacto.status !== "en_proceso" && selectedContacto.status !== "resuelto" && (
                      <Button
                        variant="outline"
                        onClick={() =>
                          updateContacto(selectedContacto._id, {
                            status: "en_proceso",
                            notes: notes || undefined,
                          })
                        }
                        disabled={updatingId === selectedContacto._id}
                      >
                        En Proceso
                      </Button>
                    )}

                    {selectedContacto.status !== "descartado" && (
                      <Button
                        variant="outline"
                        onClick={() =>
                          updateContacto(selectedContacto._id, {
                            status: "descartado",
                            notes: notes || undefined,
                          })
                        }
                        disabled={updatingId === selectedContacto._id}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Descartar
                      </Button>
                    )}

                    {notes !== (selectedContacto.notes || "") && (
                      <Button
                        variant="outline"
                        onClick={() =>
                          updateContacto(selectedContacto._id, { notes })
                        }
                        disabled={updatingId === selectedContacto._id}
                      >
                        Guardar Notas
                      </Button>
                    )}
                  </>
                )}

                {can("contacts.delete") && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Eliminar
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Eliminar contacto</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta accion eliminara permanentemente esta consulta de {selectedContacto.name}. No se puede deshacer.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteContacto(selectedContacto._id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
