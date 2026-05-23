"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PROJECT_TYPE_SELECT_OPTIONS } from "@/lib/projects/project-service-types"

type ProjectTypeSelectProps = {
  id?: string
  label?: string
  value: string
  onValueChange: (value: string) => void
  required?: boolean
  disabled?: boolean
  placeholder?: string
}

export function ProjectTypeSelect({
  id = "project-type",
  label = "Servicio / tipo de proyecto",
  value,
  onValueChange,
  required,
  disabled,
  placeholder = "Seleccionar servicio",
}: ProjectTypeSelectProps) {
  return (
    <div className="space-y-2">
      {label ? <Label htmlFor={id}>{label}{required ? " *" : ""}</Label> : null}
      <Select value={value} onValueChange={onValueChange} required={required} disabled={disabled}>
        <SelectTrigger id={id}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="max-h-[min(24rem,70vh)]">
          {PROJECT_TYPE_SELECT_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
