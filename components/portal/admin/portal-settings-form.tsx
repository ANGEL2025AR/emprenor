"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import type { PortalSettings } from "@/lib/portal/portal-settings-shared"
import { Loader2, Save } from "lucide-react"

export function PortalSettingsForm() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<PortalSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch("/api/portal/admin/settings")
      .then((r) => r.json())
      .then((data) => setSettings(data.settings))
      .catch(() => toast({ title: "Error", description: "No se pudo cargar la configuración", variant: "destructive" }))
      .finally(() => setLoading(false))
  }, [toast])

  async function handleSave() {
    if (!settings) return
    setSaving(true)
    try {
      const res = await fetch("/api/portal/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portal: settings }),
      })
      if (!res.ok) throw new Error()
      toast({ title: "Guardado", description: "Configuración del portal actualizada" })
    } catch {
      toast({ title: "Error", description: "No se pudo guardar", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  if (loading || !settings) {
    return <div className="text-slate-500 py-8">Cargando configuración...</div>
  }

  const moduleEntries = Object.entries(settings.modules) as [keyof PortalSettings["modules"], { enabled: boolean; label: string }][]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Módulos visibles para empleados</CardTitle>
          <CardDescription>
            Active o desactive cada sección del portal. Los empleados solo verán lo habilitado.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {moduleEntries.map(([key, mod]) => (
            <div key={key} className="flex items-center justify-between rounded-lg border p-4">
              <Label htmlFor={`mod-${key}`} className="font-medium cursor-pointer">
                {mod.label}
              </Label>
              <Switch
                id={`mod-${key}`}
                checked={mod.enabled}
                onCheckedChange={(checked) =>
                  setSettings((s) =>
                    s
                      ? {
                          ...s,
                          modules: { ...s.modules, [key]: { ...s.modules[key], enabled: checked } },
                        }
                      : s,
                  )
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Adelantos de sueldo</CardTitle>
          <CardDescription>Política de adelantos solicitados desde la billetera</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <Label htmlFor="adv-enabled">Permitir solicitud de adelantos</Label>
            <Switch
              id="adv-enabled"
              checked={settings.advances.enabled}
              onCheckedChange={(checked) =>
                setSettings((s) => (s ? { ...s, advances: { ...s.advances, enabled: checked } } : s))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="adv-max">Monto máximo (ARS)</Label>
            <Input
              id="adv-max"
              type="number"
              min={0}
              value={settings.advances.maxAmount}
              onChange={(e) =>
                setSettings((s) =>
                  s ? { ...s, advances: { ...s.advances, maxAmount: Number(e.target.value) || 0 } } : s,
                )
              }
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <Label htmlFor="adv-approval">Requiere aprobación administrativa</Label>
            <Switch
              id="adv-approval"
              checked={settings.advances.requiresApproval}
              onCheckedChange={(checked) =>
                setSettings((s) =>
                  s ? { ...s, advances: { ...s.advances, requiresApproval: checked } } : s,
                )
              }
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving}>
        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
        Guardar configuración
      </Button>
    </div>
  )
}
