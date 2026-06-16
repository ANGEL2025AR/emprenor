"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ImageUploadField } from "@/components/site/image-upload-field"
import type { BrochureDirectoryMember } from "@/lib/db/models"
import { BROCHURE_DIRECTORY_DEPARTMENTS } from "@/lib/site/brochure-defaults"
import type { ResolvedBrochureContent } from "@/lib/site/brochure-types"
import {
  ExternalLink,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  Users,
  FileText,
  Building2,
  Sparkles,
} from "lucide-react"

type DirectoryRow = BrochureDirectoryMember & { _id?: string }

function newManifestoItem(order: number) {
  return {
    id: typeof crypto !== "undefined" ? crypto.randomUUID() : `m-${Date.now()}`,
    text: "",
    order,
  }
}

export function BrochureAdminClient() {
  const { toast } = useToast()
  const [content, setContent] = useState<ResolvedBrochureContent | null>(null)
  const [directory, setDirectory] = useState<DirectoryRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [seeding, setSeeding] = useState(false)
  const [editingMember, setEditingMember] = useState<DirectoryRow | null>(null)

  const loadAll = useCallback(async () => {
    setLoading(true)
    try {
      const [brochureRes, dirRes] = await Promise.all([
        fetch("/api/brochure", { credentials: "include" }),
        fetch("/api/brochure/directory?all=true", { credentials: "include" }),
      ])
      const brochureData = await brochureRes.json()
      const dirData = await dirRes.json()
      if (!brochureRes.ok) throw new Error(brochureData.error || "Error al cargar brochure")
      setContent(brochureData.content)
      setDirectory(dirData.members || [])
    } catch (e) {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "No se pudo cargar",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  const saveContent = async () => {
    if (!content) return
    setSaving(true)
    try {
      const res = await fetch("/api/brochure", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error al guardar")
      toast({ title: "Brochure guardado", description: "Los cambios ya están disponibles en /brochure" })
    } catch (e) {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "No se pudo guardar",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const seedDefaults = async () => {
    setSeeding(true)
    try {
      const res = await fetch("/api/brochure/seed", { method: "POST", credentials: "include" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error al inicializar")
      toast({ title: "Contenido inicializado", description: "Se cargaron textos y directorio de referencia." })
      await loadAll()
    } catch (e) {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "No se pudo inicializar",
        variant: "destructive",
      })
    } finally {
      setSeeding(false)
    }
  }

  const saveMember = async (member: DirectoryRow) => {
    try {
      const isNew = !member._id
      const res = await fetch(isNew ? "/api/brochure/directory" : `/api/brochure/directory/${member._id}`, {
        method: isNew ? "POST" : "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(member),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error al guardar miembro")
      toast({ title: isNew ? "Miembro agregado" : "Miembro actualizado" })
      setEditingMember(null)
      await loadAll()
    } catch (e) {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "No se pudo guardar",
        variant: "destructive",
      })
    }
  }

  const deleteMember = async (id: string) => {
    if (!confirm("¿Eliminar este miembro del directorio?")) return
    try {
      const res = await fetch(`/api/brochure/directory/${id}`, { method: "DELETE", credentials: "include" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error al eliminar")
      toast({ title: "Miembro eliminado" })
      await loadAll()
    } catch (e) {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "No se pudo eliminar",
        variant: "destructive",
      })
    }
  }

  if (loading || !content) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        Cargando brochure corporativo...
      </div>
    )
  }

  const patch = (partial: Partial<ResolvedBrochureContent>) => setContent((c) => (c ? { ...c, ...partial } : c))

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Brochure y Directorio</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Editá el folleto corporativo, la razón social en transición y el organigrama publicado en{" "}
            <Link href="/brochure" className="text-green-700 underline" target="_blank">
              /brochure
            </Link>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={seedDefaults} disabled={seeding}>
            {seeding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Inicializar contenido
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/brochure" target="_blank">
              <ExternalLink className="h-4 w-4 mr-2" /> Ver brochure
            </Link>
          </Button>
          <Button size="sm" onClick={saveContent} disabled={saving} className="bg-green-600 hover:bg-green-700">
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Guardar brochure
          </Button>
        </div>
      </div>

      <Tabs defaultValue="empresa" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="empresa"><Building2 className="h-3.5 w-3.5 mr-1.5" />Empresa</TabsTrigger>
          <TabsTrigger value="portada">Portada</TabsTrigger>
          <TabsTrigger value="manifiesto"><Sparkles className="h-3.5 w-3.5 mr-1.5" />Manifiesto</TabsTrigger>
          <TabsTrigger value="carta"><FileText className="h-3.5 w-3.5 mr-1.5" />Carta</TabsTrigger>
          <TabsTrigger value="historia">Historia</TabsTrigger>
          <TabsTrigger value="directorio"><Users className="h-3.5 w-3.5 mr-1.5" />Directorio</TabsTrigger>
          <TabsTrigger value="cierre">Cierre</TabsTrigger>
        </TabsList>

        <TabsContent value="empresa">
          <Card>
            <CardHeader>
              <CardTitle>Razón social y marca comercial</CardTitle>
              <CardDescription>
                Emprendimiento del Norte Construcciones y Servicios SAS (en constitución) · Marca comercial EMPRENOR C&S
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Razón social completa</Label>
                  <Input
                    value={content.legalEntity.legalName}
                    onChange={(e) => patch({ legalEntity: { ...content.legalEntity, legalName: e.target.value } })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nombre corto / denominación</Label>
                  <Input
                    value={content.legalEntity.legalNameShort}
                    onChange={(e) => patch({ legalEntity: { ...content.legalEntity, legalNameShort: e.target.value } })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Marca comercial</Label>
                  <Input
                    value={content.legalEntity.commercialBrand}
                    onChange={(e) => patch({ legalEntity: { ...content.legalEntity, commercialBrand: e.target.value } })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tagline de marca</Label>
                  <Input
                    value={content.legalEntity.commercialTagline}
                    onChange={(e) => patch({ legalEntity: { ...content.legalEntity, commercialTagline: e.target.value } })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>CUIT</Label>
                  <Input
                    value={content.legalEntity.cuit}
                    onChange={(e) => patch({ legalEntity: { ...content.legalEntity, cuit: e.target.value } })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Forma jurídica</Label>
                  <Input
                    value={content.legalEntity.formaJuridica}
                    onChange={(e) => patch({ legalEntity: { ...content.legalEntity, formaJuridica: e.target.value } })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Nota de transición societaria</Label>
                <Textarea
                  rows={3}
                  value={content.legalEntity.transitionNote}
                  onChange={(e) => patch({ legalEntity: { ...content.legalEntity, transitionNote: e.target.value } })}
                />
              </div>
              <div className="space-y-2">
                <Label>Domicilio fiscal</Label>
                <Textarea
                  rows={2}
                  value={content.legalEntity.domicilioFiscal}
                  onChange={(e) => patch({ legalEntity: { ...content.legalEntity, domicilioFiscal: e.target.value } })}
                />
              </div>
              <ImageUploadField
                label="Imagen institucional (página Empresa)"
                folder="brochure"
                value={content.legalEntity.companyImage || ""}
                onChange={(url) => patch({ legalEntity: { ...content.legalEntity, companyImage: url } })}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portada">
          <Card>
            <CardHeader>
              <CardTitle>Portada del brochure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Desde (línea superior)</Label>
                  <Input
                    value={content.cover.since}
                    onChange={(e) => patch({ cover: { ...content.cover, since: e.target.value } })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>CTA</Label>
                  <Input
                    value={content.cover.cta}
                    onChange={(e) => patch({ cover: { ...content.cover, cta: e.target.value } })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Titular (una línea por renglón)</Label>
                <Textarea
                  rows={4}
                  value={content.cover.headline.join("\n")}
                  onChange={(e) =>
                    patch({ cover: { ...content.cover, headline: e.target.value.split("\n").filter(Boolean) } })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Descripción</Label>
                <Textarea
                  rows={3}
                  value={content.cover.description}
                  onChange={(e) => patch({ cover: { ...content.cover, description: e.target.value } })}
                />
              </div>
              <ImageUploadField
                label="Imagen de portada"
                folder="brochure"
                value={content.cover.image}
                onChange={(url) => patch({ cover: { ...content.cover, image: url } })}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manifiesto">
          <Card>
            <CardHeader>
              <CardTitle>Manifiesto «PORQUE EMPRENOR»</CardTitle>
              <CardDescription>Estilo Proyecto Norte: razones que nos diferencian</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Título</Label>
                  <Input
                    value={content.manifesto.title}
                    onChange={(e) => patch({ manifesto: { ...content.manifesto, title: e.target.value } })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subtítulo</Label>
                  <Input
                    value={content.manifesto.subtitle}
                    onChange={(e) => patch({ manifesto: { ...content.manifesto, subtitle: e.target.value } })}
                  />
                </div>
              </div>
              {content.manifesto.items
                .sort((a, b) => a.order - b.order)
                .map((item, index) => (
                  <div key={item.id} className="flex gap-2 items-start">
                    <Textarea
                      className="flex-1"
                      rows={2}
                      value={item.text}
                      onChange={(e) => {
                        const items = content.manifesto.items.map((m) =>
                          m.id === item.id ? { ...m, text: e.target.value } : m,
                        )
                        patch({ manifesto: { ...content.manifesto, items } })
                      }}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const items = content.manifesto.items.filter((m) => m.id !== item.id)
                        patch({ manifesto: { ...content.manifesto, items } })
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  patch({
                    manifesto: {
                      ...content.manifesto,
                      items: [...content.manifesto.items, newManifestoItem(content.manifesto.items.length + 1)],
                    },
                  })
                }
              >
                <Plus className="h-4 w-4 mr-2" /> Agregar «PORQUE»
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="carta">
          <Card>
            <CardHeader><CardTitle>Carta de presentación</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Saludo</Label>
                <Input
                  value={content.presentation.salutation}
                  onChange={(e) => patch({ presentation: { ...content.presentation, salutation: e.target.value } })}
                />
              </div>
              <div className="space-y-2">
                <Label>Párrafos (separados por línea en blanco)</Label>
                <Textarea
                  rows={8}
                  value={content.presentation.paragraphs.join("\n\n")}
                  onChange={(e) =>
                    patch({
                      presentation: {
                        ...content.presentation,
                        paragraphs: e.target.value.split(/\n\n+/).filter(Boolean),
                      },
                    })
                  }
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Firma</Label>
                  <Input
                    value={content.presentation.signatory}
                    onChange={(e) => patch({ presentation: { ...content.presentation, signatory: e.target.value } })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cargo / rol firmante</Label>
                  <Input
                    value={content.presentation.signatoryRole}
                    onChange={(e) => patch({ presentation: { ...content.presentation, signatoryRole: e.target.value } })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historia">
          <Card>
            <CardHeader><CardTitle>Historia, misión y valores</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Historia (párrafos separados por línea en blanco)</Label>
                <Textarea
                  rows={5}
                  value={content.history.paragraphs.join("\n\n")}
                  onChange={(e) =>
                    patch({ history: { ...content.history, paragraphs: e.target.value.split(/\n\n+/).filter(Boolean) } })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Misión</Label>
                <Textarea
                  rows={3}
                  value={content.mission.mission}
                  onChange={(e) => patch({ mission: { ...content.mission, mission: e.target.value } })}
                />
              </div>
              <div className="space-y-2">
                <Label>Visión</Label>
                <Textarea
                  rows={3}
                  value={content.mission.vision}
                  onChange={(e) => patch({ mission: { ...content.mission, vision: e.target.value } })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="directorio">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Directorio y organigrama</CardTitle>
                <CardDescription>Miembros publicados en el brochure, agrupados por área</CardDescription>
              </div>
              <Button
                size="sm"
                onClick={() =>
                  setEditingMember({
                    name: "",
                    role: "",
                    department: "DIRECTORIO",
                    bio: "",
                    photo: "",
                    order: directory.length + 1,
                    published: true,
                    featured: false,
                  } as DirectoryRow)
                }
              >
                <Plus className="h-4 w-4 mr-2" /> Agregar miembro
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {editingMember && (
                <div className="border rounded-lg p-4 space-y-3 bg-slate-50">
                  <p className="font-semibold text-sm">{editingMember._id ? "Editar miembro" : "Nuevo miembro"}</p>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-1">
                      <Label>Nombre</Label>
                      <Input
                        value={editingMember.name}
                        onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Cargo</Label>
                      <Input
                        value={editingMember.role}
                        onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Área / departamento</Label>
                      <Select
                        value={editingMember.department}
                        onValueChange={(v) => setEditingMember({ ...editingMember, department: v })}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {BROCHURE_DIRECTORY_DEPARTMENTS.map((d) => (
                            <SelectItem key={d} value={d}>{d}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label>Orden</Label>
                      <Input
                        type="number"
                        value={editingMember.order}
                        onChange={(e) => setEditingMember({ ...editingMember, order: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label>Bio breve</Label>
                    <Textarea
                      rows={2}
                      value={editingMember.bio || ""}
                      onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                    />
                  </div>
                  <ImageUploadField
                    label="Foto"
                    folder="brochure"
                    value={editingMember.photo || ""}
                    onChange={(url) => setEditingMember({ ...editingMember, photo: url })}
                    allowEmpty
                  />
                  <div className="flex gap-4 items-center">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={editingMember.published}
                        onCheckedChange={(v) => setEditingMember({ ...editingMember, published: v })}
                      />
                      <Label>Publicado</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={editingMember.featured}
                        onCheckedChange={(v) => setEditingMember({ ...editingMember, featured: v })}
                      />
                      <Label>Destacado en resumen</Label>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => saveMember(editingMember)}>Guardar miembro</Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingMember(null)}>Cancelar</Button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {directory.map((m) => (
                  <div
                    key={m._id || m.name}
                    className="flex items-center justify-between border rounded-lg p-3 gap-3"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{m.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {m.department} · {m.role}
                        {!m.published && " · Borrador"}
                      </p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button size="sm" variant="outline" onClick={() => setEditingMember(m)}>Editar</Button>
                      {m._id && (
                        <Button size="sm" variant="ghost" onClick={() => deleteMember(m._id!)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cierre">
          <Card>
            <CardHeader><CardTitle>Página de cierre</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Frase de cierre</Label>
                <Input
                  value={content.closing.headline}
                  onChange={(e) => patch({ closing: { ...content.closing, headline: e.target.value } })}
                />
              </div>
              <div className="space-y-2">
                <Label>Subtítulo</Label>
                <Input
                  value={content.closing.subline}
                  onChange={(e) => patch({ closing: { ...content.closing, subline: e.target.value } })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
