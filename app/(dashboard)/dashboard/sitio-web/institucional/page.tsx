"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { ImageUploadField } from "@/components/site/image-upload-field"
import {
  INSTITUTIONAL_LABELS,
  INSTITUTIONAL_SLUGS,
  type InstitutionalPageContent,
  type InstitutionalSlug,
} from "@/lib/site/institutional-pages"
import { Loader2, Plus, Save, Trash2 } from "lucide-react"

export default function InstitucionalAdminPage() {
  const { toast } = useToast()
  const [active, setActive] = useState<InstitutionalSlug>("licitaciones")
  const [pages, setPages] = useState<Partial<Record<InstitutionalSlug, InstitutionalPageContent>>>({})
  const [loading, setLoading] = useState<InstitutionalSlug | null>(null)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async (slug: InstitutionalSlug) => {
    setLoading(slug)
    try {
      const res = await fetch(`/api/site-institutional/${slug}`, { credentials: "include" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "No se pudo cargar")
      setPages((prev) => ({ ...prev, [slug]: data.page }))
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo cargar la página",
        variant: "destructive",
      })
    } finally {
      setLoading(null)
    }
  }, [toast])

  useEffect(() => {
    if (!pages[active]) void load(active)
  }, [active, load, pages])

  const page = pages[active]

  const update = (patch: Partial<InstitutionalPageContent>) => {
    if (!page) return
    setPages((prev) => ({ ...prev, [active]: { ...page, ...patch } }))
  }

  const save = async () => {
    if (!page) return
    setSaving(true)
    try {
      const res = await fetch(`/api/site-institutional/${active}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(page),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "No se pudo guardar")
      toast({ title: "Guardado", description: "La página pública ya usa este texto." })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo guardar",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Páginas de Empresa</h1>
        <p className="text-muted-foreground">
          Editá licitaciones, seguridad, sostenibilidad y la introducción de la línea de ética. Un enlace se escribe
          como [texto](/ruta) o [mail](mailto:correo@emprenor.com.ar). Una lista es una línea por ítem que empiece con
          &quot;- &quot;.
        </p>
      </div>

      <Tabs value={active} onValueChange={(value) => setActive(value as InstitutionalSlug)}>
        <TabsList className="flex h-auto flex-wrap">
          {INSTITUTIONAL_SLUGS.map((slug) => (
            <TabsTrigger key={slug} value={slug}>
              {INSTITUTIONAL_LABELS[slug]}
            </TabsTrigger>
          ))}
        </TabsList>

        {INSTITUTIONAL_SLUGS.map((slug) => (
          <TabsContent key={slug} value={slug} className="space-y-4">
            {loading === slug || !page || page.slug !== slug ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Portada</CardTitle>
                    <CardDescription>Título y texto que ve el visitante al entrar.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Título</Label>
                      <Input value={page.title} onChange={(e) => update({ title: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Subtítulo</Label>
                      <Textarea value={page.subtitle} rows={3} onChange={(e) => update({ subtitle: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Descripción para buscadores</Label>
                      <Textarea value={page.description} rows={2} onChange={(e) => update({ description: e.target.value })} />
                    </div>
                    <ImageUploadField
                      label="Imagen de portada"
                      folder="site"
                      allowEmpty
                      value={page.heroImage}
                      onChange={(heroImage) => update({ heroImage })}
                    />
                  </CardContent>
                </Card>

                {slug === "linea-etica" ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Texto del formulario</CardTitle>
                      <CardDescription>El formulario de reporte no se modifica desde acá.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Título sobre el formulario</Label>
                        <Input value={page.formTitle} onChange={(e) => update({ formTitle: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Introducción</Label>
                        <Textarea value={page.formIntro} rows={5} onChange={(e) => update({ formIntro: e.target.value })} />
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle>Secciones</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {page.sections.map((section, index) => (
                          <div key={`${section.title}-${index}`} className="space-y-2 rounded-lg border p-4">
                            <div className="flex items-center justify-between gap-2">
                              <Label>Sección {index + 1}</Label>
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                onClick={() => update({ sections: page.sections.filter((_, item) => item !== index) })}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <Input
                              value={section.title}
                              onChange={(e) => {
                                const sections = [...page.sections]
                                sections[index] = { ...section, title: e.target.value }
                                update({ sections })
                              }}
                            />
                            <Textarea
                              value={section.body}
                              rows={6}
                              onChange={(e) => {
                                const sections = [...page.sections]
                                sections[index] = { ...section, body: e.target.value }
                                update({ sections })
                              }}
                            />
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => update({ sections: [...page.sections, { title: "Nueva sección", body: "Texto de la sección." }] })}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Agregar sección
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Botón y tarjetas</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Texto del botón</Label>
                            <Input value={page.ctaLabel} onChange={(e) => update({ ctaLabel: e.target.value })} />
                          </div>
                          <div className="space-y-2">
                            <Label>Destino del botón</Label>
                            <Input value={page.ctaHref} onChange={(e) => update({ ctaHref: e.target.value })} />
                          </div>
                        </div>
                        {page.highlights.map((item, index) => (
                          <div key={`${item.title}-${index}`} className="grid gap-2 sm:grid-cols-[1fr_2fr_auto]">
                            <Input
                              value={item.title}
                              onChange={(e) => {
                                const highlights = [...page.highlights]
                                highlights[index] = { ...item, title: e.target.value }
                                update({ highlights })
                              }}
                            />
                            <Input
                              value={item.text}
                              onChange={(e) => {
                                const highlights = [...page.highlights]
                                highlights[index] = { ...item, text: e.target.value }
                                update({ highlights })
                              }}
                            />
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              onClick={() => update({ highlights: page.highlights.filter((_, card) => card !== index) })}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => update({ highlights: [...page.highlights, { title: "Tarjeta", text: "Texto breve" }] })}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Agregar tarjeta
                        </Button>
                      </CardContent>
                    </Card>
                  </>
                )}

                <Button type="button" onClick={save} disabled={saving}>
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Guardar página
                </Button>
              </>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
