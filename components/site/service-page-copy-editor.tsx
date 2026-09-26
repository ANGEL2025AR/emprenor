"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

type Field = { path: string; value: string }

export function ServicePageCopyEditor({ slug }: { slug: string }) {
  const { toast } = useToast()
  const [fields, setFields] = useState<Field[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let active = true
    fetch(`/api/site-services/${slug}/page-copy`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (active) setFields(data.fields || [])
      })
      .catch(() => {
        if (active) toast({ title: "No se pudieron cargar los textos de la página", variant: "destructive" })
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [slug, toast])

  async function save() {
    setSaving(true)
    try {
      const res = await fetch(`/api/site-services/${slug}/page-copy`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error al guardar")
      toast({ title: "Textos de la página guardados" })
    } catch (error) {
      toast({ title: error instanceof Error ? error.message : "Error", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-sm text-muted-foreground">Cargando textos publicados…</p>

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Estos textos salen en la página pública del servicio. Guardá esta pestaña por separado de la ficha.
      </p>
      {fields.map((field, index) => (
        <div key={field.path} className="space-y-1">
          <label className="text-xs text-muted-foreground">{field.path}</label>
          <Textarea
            value={field.value}
            rows={field.value.length > 120 ? 4 : 2}
            onChange={(e) => {
              const next = [...fields]
              next[index] = { ...field, value: e.target.value }
              setFields(next)
            }}
          />
        </div>
      ))}
      <Button type="button" onClick={save} disabled={saving || fields.length === 0}>
        {saving ? "Guardando..." : "Guardar textos de la página"}
      </Button>
    </div>
  )
}
