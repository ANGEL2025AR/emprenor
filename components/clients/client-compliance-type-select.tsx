"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CLIENT_COMPLIANCE_TYPE_OPTIONS } from "@/lib/compliance/client-types"
import type { ClientComplianceType } from "@/lib/db/models"

export function ClientComplianceTypeSelect({
  value,
  onChange,
  id = "complianceType",
  showHint = true,
}: {
  value: ClientComplianceType
  onChange: (value: ClientComplianceType) => void
  id?: string
  showHint?: boolean
}) {
  const profile = CLIENT_COMPLIANCE_TYPE_OPTIONS.find((o) => o.value === value)

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>Tipo de cliente</Label>
      <Select value={value} onValueChange={(v) => onChange(v as ClientComplianceType)}>
        <SelectTrigger id={id}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {CLIENT_COMPLIANCE_TYPE_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {showHint && profile ? (
        <>
          <p className="text-xs text-muted-foreground">{profile.description}</p>
          {profile.examples ? (
            <p className="text-xs text-muted-foreground">Ejemplos: {profile.examples}</p>
          ) : null}
        </>
      ) : null}
    </div>
  )
}
