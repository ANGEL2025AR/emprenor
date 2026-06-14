"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { STATUS_CONFIG, type ProjectStatusKey } from "@/lib/site/project-status"

export type PublicProjectMapFields = {
  status?: string
  progress?: number
  coordinates?: { lat: number; lng: number } | null
  showOnMap?: boolean
}

type Props = {
  value: PublicProjectMapFields
  onChange: (patch: Partial<PublicProjectMapFields>) => void
}

const STATUS_OPTIONS = Object.entries(STATUS_CONFIG).map(([key, cfg]) => ({
  value: key,
  label: cfg.label,
}))

export function PublicProjectMapFields({ value, onChange }: Props) {
  const lat = value.coordinates?.lat ?? ""
  const lng = value.coordinates?.lng ?? ""

  return (
    <div className="space-y-4 rounded-lg border border-border p-4 bg-muted/20">
      <div>
        <h3 className="font-semibold text-sm">Mapa de obras (público)</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Coordenadas GPS y estado operativo para el mapa interactivo en home y proyectos.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="project-status">Estado de obra</Label>
          <Select value={value.status || "Finalizado"} onValueChange={(v) => onChange({ status: v as ProjectStatusKey })}>
            <SelectTrigger id="project-status">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="project-progress">Avance (%)</Label>
          <Input
            id="project-progress"
            type="number"
            min={0}
            max={100}
            value={value.progress ?? ""}
            onChange={(e) => onChange({ progress: e.target.value === "" ? undefined : Number(e.target.value) })}
            placeholder="0–100"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="project-lat">Latitud</Label>
          <Input
            id="project-lat"
            type="number"
            step="any"
            value={lat}
            onChange={(e) => {
              const n = e.target.value === "" ? undefined : Number(e.target.value)
              onChange({
                coordinates: n == null || Number.isNaN(n) ? null : { lat: n, lng: value.coordinates?.lng ?? 0 },
              })
            }}
            placeholder="-24.7859"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="project-lng">Longitud</Label>
          <Input
            id="project-lng"
            type="number"
            step="any"
            value={lng}
            onChange={(e) => {
              const n = e.target.value === "" ? undefined : Number(e.target.value)
              onChange({
                coordinates: n == null || Number.isNaN(n) ? null : { lat: value.coordinates?.lat ?? 0, lng: n },
              })
            }}
            placeholder="-65.4115"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="show-on-map">Mostrar en mapa</Label>
          <p className="text-xs text-muted-foreground">Requiere coordenadas válidas y proyecto publicado</p>
        </div>
        <Switch
          id="show-on-map"
          checked={value.showOnMap !== false}
          onCheckedChange={(checked) => onChange({ showOnMap: checked })}
        />
      </div>
    </div>
  )
}
