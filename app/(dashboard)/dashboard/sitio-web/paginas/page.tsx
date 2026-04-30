"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import type { SitePageHeroSlide } from "@/lib/db/models"
import { SITE_PAGE_SLUGS, type SitePageSlug } from "@/lib/site/constants"
import { Loader2, Plus, Trash2, ChevronUp, ChevronDown, Save } from "lucide-react"

const SLUG_LABEL: Record<SitePageSlug, string> = {
  home: "Inicio",
  nosotros: "Nosotros",
  contacto: "Contacto",
}

function newSlide(slug: SitePageSlug): SitePageHeroSlide {
  const id = typeof crypto !== "undefined" ? crypto.randomUUID() : `slide-${Date.now()}`
  if (slug === "home") {
    return {
      id,
      image: "/construction-site-workers-blueprint.jpg",
      alt: "Imagen del hero",
      badgeText: "",
      title: "Nueva diapositiva",
      titleAccent: "",
      subtitle: "",
      primaryCtaLabel: "Solicitar Cotización",
      primaryCtaHref: "/contacto",
      secondaryCtaLabel: "Ver Proyectos",
      secondaryCtaHref: "/proyectos",
    }
  }
  return {
    id,
    image: "",
    alt: "",
    title: "Título",
    subtitle: "Texto de apoyo",
  }
}

export default function SitioWebPaginasPage() {
  const { toast } = useToast()
  const [activeSlug, setActiveSlug] = useState<SitePageSlug>("home")
  const [slidesBySlug, setSlidesBySlug] = useState<Record<SitePageSlug, SitePageHeroSlide[]>>({
    home: [],
    nosotros: [],
    contacto: [],
  })
  const [loadingSlug, setLoadingSlug] = useState<SitePageSlug | null>(null)
  const [savingSlug, setSavingSlug] = useState<SitePageSlug | null>(null)

  const loadSlug = useCallback(async (slug: SitePageSlug) => {
    setLoadingSlug(slug)
    try {
      const res = await fetch(`/api/site-pages/${slug}`, { credentials: "include" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error al cargar")
      setSlidesBySlug((prev) => ({ ...prev, [slug]: data.heroSlides || [] }))
    } catch (e) {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "No se pudo cargar la página",
        variant: "destructive",
      })
    } finally {
      setLoadingSlug(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- toast estable del hook
  }, [])

  useEffect(() => {
    loadSlug(activeSlug)
  }, [activeSlug, loadSlug])

  const updateSlide = (slug: SitePageSlug, index: number, patch: Partial<SitePageHeroSlide>) => {
    setSlidesBySlug((prev) => {
      const list = [...(prev[slug] || [])]
      list[index] = { ...list[index], ...patch }
      return { ...prev, [slug]: list }
    })
  }

  const moveSlide = (slug: SitePageSlug, index: number, dir: -1 | 1) => {
    setSlidesBySlug((prev) => {
      const list = [...(prev[slug] || [])]
      const j = index + dir
      if (j < 0 || j >= list.length) return prev
      ;[list[index], list[j]] = [list[j], list[index]]
      return { ...prev, [slug]: list }
    })
  }

  const removeSlide = (slug: SitePageSlug, index: number) => {
    setSlidesBySlug((prev) => {
      const list = [...(prev[slug] || [])].filter((_, i) => i !== index)
      return { ...prev, [slug]: list }
    })
  }

  const addSlide = (slug: SitePageSlug) => {
    setSlidesBySlug((prev) => ({
      ...prev,
      [slug]: [...(prev[slug] || []), newSlide(slug)],
    }))
  }

  const save = async (slug: SitePageSlug) => {
    const slides = slidesBySlug[slug] || []
    if (slides.length === 0) {
      toast({ title: "Agregá al menos una diapositiva", variant: "destructive" })
      return
    }
    setSavingSlug(slug)
    try {
      const res = await fetch(`/api/site-pages/${slug}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ heroSlides: slides }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error al guardar")
      toast({
        title: "Guardado",
        description: "Los cambios se aplicarán en el sitio público (revalidación de caché).",
      })
    } catch (e) {
      toast({
        title: "Error al guardar",
        description: e instanceof Error ? e.message : "Intentá de nuevo",
        variant: "destructive",
      })
    } finally {
      setSavingSlug(null)
    }
  }

  const slides = slidesBySlug[activeSlug] || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Portadas y slider</h1>
        <p className="text-slate-600">
          Editá el carrusel del inicio (imagen a pantalla completa) y las portadas simples de Nosotros y Contacto.
          Guardá cada pestaña por separado.
        </p>
      </div>

      <Tabs value={activeSlug} onValueChange={(v) => setActiveSlug(v as SitePageSlug)} className="space-y-6">
        <TabsList className="flex flex-wrap gap-1">
          {SITE_PAGE_SLUGS.map((s) => (
            <TabsTrigger key={s} value={s}>
              {SLUG_LABEL[s]}
            </TabsTrigger>
          ))}
        </TabsList>

        {SITE_PAGE_SLUGS.map((slug) => (
          <TabsContent key={slug} value={slug} className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
                <div>
                  <CardTitle>{SLUG_LABEL[slug]}</CardTitle>
                  <CardDescription>
                    {slug === "home"
                      ? "Slider inmersivo: varias imágenes, textos y botones por diapositiva."
                      : "Portada centrada: podés dejar imagen vacía para fondo corporativo sólido."}
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => loadSlug(slug)}>
                    Recargar
                  </Button>
                  <Button type="button" variant="secondary" size="sm" onClick={() => addSlide(slug)}>
                    <Plus className="mr-1 h-4 w-4" />
                    Diapositiva
                  </Button>
                  <Button type="button" size="sm" onClick={() => save(slug)} disabled={savingSlug === slug}>
                    {savingSlug === slug ? (
                      <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-1 h-4 w-4" />
                    )}
                    Guardar
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {loadingSlug === slug ? (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Cargando…
                  </div>
                ) : (
                  <>
                    {slides.length === 0 ? (
                      <p className="text-sm text-slate-600">
                        No hay diapositivas. Agregá una con el botón &quot;Diapositiva&quot;.
                      </p>
                    ) : null}
                    {slides.map((slide, index) => (
                  <Card key={slide.id} className="border-slate-200 bg-slate-50/50">
                    <CardHeader className="pb-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <CardTitle className="text-base">Diapositiva {index + 1}</CardTitle>
                        <div className="flex gap-1">
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => moveSlide(slug, index, -1)}
                            disabled={index === 0}
                            aria-label="Subir"
                          >
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => moveSlide(slug, index, 1)}
                            disabled={index === slides.length - 1}
                            aria-label="Bajar"
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-red-600"
                            onClick={() => removeSlide(slug, index)}
                            disabled={slides.length <= 1}
                            aria-label="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2 md:col-span-2">
                        <Label>URL de imagen (vacío en Nosotros/Contacto = sin foto)</Label>
                        <Input
                          value={slide.image}
                          onChange={(e) => updateSlide(slug, index, { image: e.target.value })}
                          placeholder="/mi-imagen.jpg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Texto alternativo (accesibilidad)</Label>
                        <Input
                          value={slide.alt}
                          onChange={(e) => updateSlide(slug, index, { alt: e.target.value })}
                        />
                      </div>
                      {slug === "home" ? (
                        <div className="space-y-2">
                          <Label>Badge (línea superior)</Label>
                          <Input
                            value={slide.badgeText ?? ""}
                            onChange={(e) => updateSlide(slug, index, { badgeText: e.target.value })}
                          />
                        </div>
                      ) : null}
                      <div className="space-y-2 md:col-span-2">
                        <Label>Título</Label>
                        <Input
                          value={slide.title}
                          onChange={(e) => updateSlide(slug, index, { title: e.target.value })}
                        />
                      </div>
                      {slug === "home" ? (
                        <div className="space-y-2">
                          <Label>Palabra a resaltar en el título</Label>
                          <Input
                            value={slide.titleAccent ?? ""}
                            onChange={(e) => updateSlide(slug, index, { titleAccent: e.target.value })}
                            placeholder="ej: sueños"
                          />
                        </div>
                      ) : null}
                      <div className="space-y-2 md:col-span-2">
                        <Label>Subtítulo</Label>
                        <Textarea
                          rows={3}
                          value={slide.subtitle ?? ""}
                          onChange={(e) => updateSlide(slug, index, { subtitle: e.target.value })}
                        />
                      </div>
                      {slug === "home" ? (
                        <>
                          <div className="space-y-2">
                            <Label>Botón principal — texto</Label>
                            <Input
                              value={slide.primaryCtaLabel ?? ""}
                              onChange={(e) => updateSlide(slug, index, { primaryCtaLabel: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Botón principal — enlace</Label>
                            <Input
                              value={slide.primaryCtaHref ?? ""}
                              onChange={(e) => updateSlide(slug, index, { primaryCtaHref: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Botón secundario — texto</Label>
                            <Input
                              value={slide.secondaryCtaLabel ?? ""}
                              onChange={(e) => updateSlide(slug, index, { secondaryCtaLabel: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Botón secundario — enlace</Label>
                            <Input
                              value={slide.secondaryCtaHref ?? ""}
                              onChange={(e) => updateSlide(slug, index, { secondaryCtaHref: e.target.value })}
                            />
                          </div>
                        </>
                      ) : null}
                    </CardContent>
                  </Card>
                    ))}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
