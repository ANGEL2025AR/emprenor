"use client"

import { useCallback, useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import type { SiteService, SiteServiceIconKey } from "@/lib/db/models"
import { ImageUploadField } from "@/components/site/image-upload-field"
import { GalleryUploadField } from "@/components/site/gallery-upload-field"
import { ArrowLeft, Loader2, Plus, Save, Trash2 } from "lucide-react"

const ICONS: SiteServiceIconKey[] = ["Building2", "Hammer", "Home", "Factory", "Flame", "Lightbulb", "Droplets", "Paintbrush"]

export default function EditarServicioPage() {
  const params = useParams()
  const slug = params.slug as string
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState<SiteService | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/site-services/${slug}`, { credentials: "include" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error al cargar")
      setForm(data.service)
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "No se pudo cargar", variant: "destructive" })
      router.push("/dashboard/sitio-web/servicios")
    } finally {
      setLoading(false)
    }
  }, [slug, router, toast])

  useEffect(() => {
    load()
  }, [load])

  const save = async () => {
    if (!form) return
    setSaving(true)
    try {
      const res = await fetch(`/api/site-services/${slug}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error al guardar")
      toast({ title: "Guardado", description: "Servicio actualizado en el sitio público." })
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "No se pudo guardar", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  if (loading || !form) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const set = <K extends keyof SiteService>(key: K, value: SiteService[K]) => setForm({ ...form, [key]: value })

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/sitio-web/servicios"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Editar: {form.title}</h1>
          <p className="text-muted-foreground">/servicios/{form.slug}</p>
        </div>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="contenido">Contenido</TabsTrigger>
          <TabsTrigger value="proceso">Proceso</TabsTrigger>
          <TabsTrigger value="trabajos">Tipos de trabajo</TabsTrigger>
          <TabsTrigger value="imagenes">Imágenes</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 mt-4">
          <Card>
            <CardHeader><CardTitle>Datos principales</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Título</Label>
                  <Input value={form.title} onChange={(e) => set("title", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Icono</Label>
                  <Select value={form.icon} onValueChange={(v) => set("icon", v as SiteServiceIconKey)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{ICONS.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Descripción corta</Label>
                <Textarea value={form.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} rows={3} />
              </div>
              <div className="space-y-2">
                <Label>Gradiente (Tailwind, ej: from-blue-500 to-blue-600)</Label>
                <Input value={form.colorGradient} onChange={(e) => set("colorGradient", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Características (una por línea)</Label>
                <Textarea value={form.features.join("\n")} onChange={(e) => set("features", e.target.value.split("\n").filter(Boolean))} rows={4} />
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={form.published} onCheckedChange={(v) => set("published", v)} />
                <Label>Publicado en el sitio</Label>
              </div>
              <div className="space-y-2 max-w-xs">
                <Label>Orden</Label>
                <Input type="number" value={form.order} onChange={(e) => set("order", Number(e.target.value))} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contenido" className="space-y-4 mt-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label>Título sección overview</Label>
                <Input value={form.overviewTitle} onChange={(e) => set("overviewTitle", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Párrafos (separados por línea en blanco)</Label>
                <Textarea value={form.overviewParagraphs.join("\n\n")} onChange={(e) => set("overviewParagraphs", e.target.value.split(/\n\n+/).filter(Boolean))} rows={8} />
              </div>
              <div className="space-y-2">
                <Label>Beneficios (uno por línea)</Label>
                <Textarea value={form.benefits.join("\n")} onChange={(e) => set("benefits", e.target.value.split("\n").filter(Boolean))} rows={4} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="proceso" className="space-y-4 mt-4">
          {form.processSteps.map((step, idx) => (
            <Card key={idx}>
              <CardContent className="pt-6 space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Paso {step.order}</Label>
                  <Button type="button" variant="ghost" size="icon" onClick={() => set("processSteps", form.processSteps.filter((_, i) => i !== idx).map((s, i) => ({ ...s, order: i + 1 })))}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Input value={step.title} onChange={(e) => { const steps = [...form.processSteps]; steps[idx] = { ...step, title: e.target.value }; set("processSteps", steps) }} placeholder="Título del paso" />
                <Textarea value={step.description} onChange={(e) => { const steps = [...form.processSteps]; steps[idx] = { ...step, description: e.target.value }; set("processSteps", steps) }} rows={3} />
              </CardContent>
            </Card>
          ))}
          <Button type="button" variant="outline" onClick={() => set("processSteps", [...form.processSteps, { order: form.processSteps.length + 1, title: "", description: "" }])}>
            <Plus className="h-4 w-4 mr-2" /> Agregar paso
          </Button>
        </TabsContent>

        <TabsContent value="trabajos" className="space-y-4 mt-4">
          {form.workCategories.map((cat, idx) => (
            <Card key={idx}>
              <CardContent className="pt-6 space-y-3">
                <div className="flex justify-between">
                  <Label>Categoría {idx + 1}</Label>
                  <Button type="button" variant="ghost" size="icon" onClick={() => set("workCategories", form.workCategories.filter((_, i) => i !== idx))}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Input value={cat.title} onChange={(e) => { const w = [...form.workCategories]; w[idx] = { ...cat, title: e.target.value }; set("workCategories", w) }} />
                <Textarea value={cat.description || ""} onChange={(e) => { const w = [...form.workCategories]; w[idx] = { ...cat, description: e.target.value }; set("workCategories", w) }} rows={2} placeholder="Descripción opcional" />
                <ImageUploadField label="Imagen del tipo de trabajo" folder="services" value={cat.image || ""} onChange={(url) => { const w = [...form.workCategories]; w[idx] = { ...cat, image: url }; set("workCategories", w) }} onUploadingChange={setUploading} />
                <Textarea value={cat.items.join("\n")} onChange={(e) => { const w = [...form.workCategories]; w[idx] = { ...cat, items: e.target.value.split("\n").filter(Boolean) }; set("workCategories", w) }} rows={4} placeholder="Trabajos incluidos (uno por línea)" />
              </CardContent>
            </Card>
          ))}
          <Button type="button" variant="outline" onClick={() => set("workCategories", [...form.workCategories, { title: "", items: [] }])}>
            <Plus className="h-4 w-4 mr-2" /> Agregar categoría
          </Button>
        </TabsContent>

        <TabsContent value="imagenes" className="space-y-4 mt-4">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <ImageUploadField label="Imagen principal (hero)" folder="services" value={form.heroImage} onChange={(url) => set("heroImage", url)} onUploadingChange={setUploading} />
              <div className="space-y-2">
                <Label>Texto alternativo hero</Label>
                <Input value={form.heroImageAlt} onChange={(e) => set("heroImageAlt", e.target.value)} />
              </div>
              <GalleryUploadField label="Galería de trabajos realizados" folder="services" value={form.gallery} onChange={(g) => set("gallery", g)} onUploadingChange={setUploading} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4 mt-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label>Título SEO</Label>
                <Input value={form.seoTitle || ""} onChange={(e) => set("seoTitle", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Descripción SEO</Label>
                <Textarea value={form.seoDescription || ""} onChange={(e) => set("seoDescription", e.target.value)} rows={3} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex gap-3 sticky bottom-4 bg-background/95 backdrop-blur p-4 border rounded-lg">
        <Button onClick={save} disabled={saving || uploading}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Guardar cambios
        </Button>
        <Button variant="outline" asChild>
          <Link href={`/servicios/${slug}`} target="_blank">Vista previa</Link>
        </Button>
      </div>
    </div>
  )
}
