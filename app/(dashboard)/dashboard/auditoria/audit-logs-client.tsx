"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Shield,
  Search,
  Filter,
  Download,
  RefreshCw,
  User,
  Calendar,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface AuditLog {
  _id: string
  timestamp: string
  userId: string | null
  userEmail: string
  userName: string
  action: string
  entityType: string
  entityId: string | null
  entityName?: string
  previousData?: Record<string, unknown>
  newData?: Record<string, unknown>
  changes?: Array<{ field: string; oldValue: unknown; newValue: unknown }>
  metadata: {
    ip: string
    userAgent: string
  }
  status: "success" | "failure"
  errorMessage?: string
  severity: "low" | "medium" | "high" | "critical"
}

const actionLabels: Record<string, string> = {
  CREATE: "Crear",
  READ: "Leer",
  UPDATE: "Actualizar",
  DELETE: "Eliminar",
  LOGIN: "Iniciar Sesión",
  LOGOUT: "Cerrar Sesión",
  LOGIN_FAILED: "Login Fallido",
  PASSWORD_CHANGE: "Cambio Contraseña",
  PERMISSION_CHANGE: "Cambio Permisos",
  EXPORT: "Exportar",
  IMPORT: "Importar",
  APPROVE: "Aprobar",
  REJECT: "Rechazar",
  ARCHIVE: "Archivar",
}

const entityLabels: Record<string, string> = {
  user: "Usuario",
  project: "Proyecto",
  task: "Tarea",
  client: "Cliente",
  contract: "Contrato",
  invoice: "Factura",
  payment: "Pago",
  employee: "Empleado",
  document: "Documento",
  certificate: "Certificado",
  inspection: "Inspección",
  quotation: "Cotización",
  incident: "Incidencia",
  material: "Material",
  report: "Reporte",
  settings: "Configuración",
  session: "Sesión",
}

const severityColors: Record<string, string> = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800",
}

export function AuditLogsClient() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    action: "all",
    entityType: "all",
    severity: "all",
    search: "",
  })
  const [page, setPage] = useState(0)
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.action !== "all") params.set("action", filters.action)
      if (filters.entityType !== "all") params.set("entityType", filters.entityType)
      if (filters.severity !== "all") params.set("severity", filters.severity)
      params.set("limit", "20")
      params.set("skip", String(page * 20))

      const response = await fetch(`/api/audit-logs?${params}`)
      if (response.ok) {
        const data = await response.json()
        setLogs(data.logs)
        setTotal(data.total)
      }
    } catch (error) {
      console.error("Error fetching audit logs:", error)
    } finally {
      setLoading(false)
    }
  }, [filters, page])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  const exportLogs = async () => {
    try {
      const params = new URLSearchParams()
      if (filters.action !== "all") params.set("action", filters.action)
      if (filters.entityType !== "all") params.set("entityType", filters.entityType)
      if (filters.severity !== "all") params.set("severity", filters.severity)
      params.set("limit", "1000")

      const response = await fetch(`/api/audit-logs?${params}`)
      if (response.ok) {
        const data = await response.json()

        const csvContent = [
          ["Fecha", "Usuario", "Email", "Acción", "Entidad", "ID Entidad", "Estado", "Severidad", "IP"].join(","),
          ...data.logs.map((log: AuditLog) =>
            [
              format(new Date(log.timestamp), "yyyy-MM-dd HH:mm:ss"),
              log.userName,
              log.userEmail,
              actionLabels[log.action] || log.action,
              entityLabels[log.entityType] || log.entityType,
              log.entityId || "",
              log.status,
              log.severity,
              log.metadata.ip,
            ].join(","),
          ),
        ].join("\n")

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const link = document.createElement("a")
        link.href = URL.createObjectURL(blob)
        link.download = `audit-logs-${format(new Date(), "yyyy-MM-dd")}.csv`
        link.click()
      }
    } catch (error) {
      console.error("Error exporting logs:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Auditoría del Sistema</h1>
          <p className="text-muted-foreground">
            Registro completo de actividades y cambios para cumplimiento empresarial
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchLogs}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualizar
          </Button>
          <Button onClick={exportLogs}>
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Registros</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Severidad Alta</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {logs.filter((l) => l.severity === "high" || l.severity === "critical").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exitosos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{logs.filter((l) => l.status === "success").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fallidos</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{logs.filter((l) => l.status === "failure").length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por usuario..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-9"
              />
            </div>
            <Select value={filters.action} onValueChange={(value) => setFilters({ ...filters, action: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Acción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las acciones</SelectItem>
                {Object.entries(actionLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filters.entityType} onValueChange={(value) => setFilters({ ...filters, entityType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Entidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las entidades</SelectItem>
                {Object.entries(entityLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filters.severity} onValueChange={(value) => setFilters({ ...filters, severity: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Severidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="low">Baja</SelectItem>
                <SelectItem value="medium">Media</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="critical">Crítica</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Registros de Auditoría
          </CardTitle>
          <CardDescription>
            Mostrando {logs.length} de {total} registros
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Shield className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold">No hay registros</h3>
              <p className="text-sm text-muted-foreground">No se encontraron registros con los filtros seleccionados</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Acción</TableHead>
                    <TableHead>Entidad</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Severidad</TableHead>
                    <TableHead>IP</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log._id}>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {format(new Date(log.timestamp), "dd/MM/yyyy HH:mm", { locale: es })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{log.userName}</div>
                            <div className="text-xs text-muted-foreground">{log.userEmail}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{actionLabels[log.action] || log.action}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{entityLabels[log.entityType] || log.entityType}</div>
                          {log.entityName && <div className="text-xs text-muted-foreground">{log.entityName}</div>}
                        </div>
                      </TableCell>
                      <TableCell>
                        {log.status === "success" ? (
                          <Badge className="bg-green-100 text-green-800">Exitoso</Badge>
                        ) : (
                          <Badge variant="destructive">Fallido</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={severityColors[log.severity]}>
                          {log.severity === "low" && "Baja"}
                          {log.severity === "medium" && "Media"}
                          {log.severity === "high" && "Alta"}
                          {log.severity === "critical" && "Crítica"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{log.metadata.ip}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedLog(log)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Página {page + 1} de {Math.ceil(total / 20)}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(Math.max(0, page - 1))}
                    disabled={page === 0}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={(page + 1) * 20 >= total}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalle del Registro</DialogTitle>
            <DialogDescription>Información completa del evento de auditoría</DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Fecha</label>
                  <p>{format(new Date(selectedLog.timestamp), "PPpp", { locale: es })}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Usuario</label>
                  <p>
                    {selectedLog.userName} ({selectedLog.userEmail})
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Acción</label>
                  <p>{actionLabels[selectedLog.action] || selectedLog.action}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Entidad</label>
                  <p>{entityLabels[selectedLog.entityType] || selectedLog.entityType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">IP</label>
                  <p>{selectedLog.metadata.ip}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">User Agent</label>
                  <p className="text-xs truncate">{selectedLog.metadata.userAgent}</p>
                </div>
              </div>

              {selectedLog.changes && selectedLog.changes.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Cambios Realizados</label>
                  <div className="mt-2 space-y-2">
                    {selectedLog.changes.map((change, index) => (
                      <div key={index} className="rounded border p-2 text-sm">
                        <span className="font-medium">{change.field}:</span>{" "}
                        <span className="text-red-600 line-through">{JSON.stringify(change.oldValue)}</span> →{" "}
                        <span className="text-green-600">{JSON.stringify(change.newValue)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedLog.errorMessage && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Error</label>
                  <p className="text-red-600">{selectedLog.errorMessage}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
