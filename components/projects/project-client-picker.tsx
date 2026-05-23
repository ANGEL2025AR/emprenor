"use client"

import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { getClientComplianceLabel } from "@/lib/compliance/client-types"
import {
  buildProjectClientFields,
  resolveClientRecordComplianceType,
  type ClientRecord,
} from "@/lib/clients/compliance-sync"
import type { ClientComplianceType } from "@/lib/db/models"

export type ProjectClientFields = {
  name: string
  email: string
  phone: string
  address: string
}

type RegistryClient = ClientRecord & { _id: string }

export function ProjectClientPicker({
  clientId,
  onClientIdChange,
  onClientFieldsChange,
  onComplianceTypeHint,
}: {
  clientId: string
  onClientIdChange: (id: string) => void
  onClientFieldsChange: (fields: ProjectClientFields) => void
  onComplianceTypeHint?: (type: ClientComplianceType) => void
}) {
  const [clients, setClients] = useState<RegistryClient[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/clients", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => setClients(data.clients ?? []))
      .catch(() => setClients([]))
      .finally(() => setLoading(false))
  }, [])

  const handleSelect = (value: string) => {
    if (value === "manual") {
      onClientIdChange("")
      return
    }
    onClientIdChange(value)
    const client = clients.find((c) => c._id === value)
    if (client) {
      onClientFieldsChange(buildProjectClientFields(client))
      onComplianceTypeHint?.(resolveClientRecordComplianceType(client))
    }
  }

  const selected = clients.find((c) => c._id === clientId)
  const complianceLabel = selected ? getClientComplianceLabel(resolveClientRecordComplianceType(selected)) : null

  return (
    <div className="space-y-2 rounded-lg border bg-slate-50/80 p-4">
      <Label>Cliente registrado en EMPRENOR</Label>
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Cargando clientes…
        </div>
      ) : (
        <Select value={clientId || "manual"} onValueChange={handleSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar cliente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="manual">Ingresar datos manualmente</SelectItem>
            {clients.map((c) => (
              <SelectItem key={c._id} value={c._id}>
                {c.company ? `${c.company} (${c.name})` : c.name} — {c.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {clientId && complianceLabel ? (
        <p className="text-xs text-muted-foreground">
          Tipo de cumplimiento en portal: <strong>{complianceLabel}</strong> (desde ficha de clientes).
          Podés ajustarlo después en Portal del cliente → Configuración.
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">
          Si elegís un cliente registrado, el tipo de cumplimiento (municipio, empresa, FAO, consorcio, etc.)
          se copia automáticamente al proyecto.
        </p>
      )}
    </div>
  )
}
