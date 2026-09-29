"use client"

import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Phone } from "lucide-react"
import { EMPRENOR_LEGAL } from "@/lib/company/constants"
import { normalizeContactHref } from "@/lib/site/urls"
import { shouldUnoptimizeImage } from "@/lib/site/image-utils"

type Slide = {
  eyebrow?: string
  title?: string
  title_highlight?: string
  subtitle?: string
  image_url?: string
  cta_text?: string
  cta_url?: string
}

export function ServiceHeroSlider({ slides = [], minHeight = "70vh" }: { slides?: Slide[]; minHeight?: string }) {
  const items = slides.length > 0 ? slides : [{ title: "Servicios", subtitle: "EMPRENOR C&S" }]
  const loop = items.length > 1
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop, align: "start" })
  const [selected, setSelected] = useState(0)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelected(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
    return () => {
      emblaApi.off("select", onSelect)
      emblaApi.off("reInit", onSelect)
    }
  }, [emblaApi, onSelect])

  return (
    <section className="relative bg-slate-900 text-white overflow-hidden" style={{ minHeight }}>
      <div className="overflow-hidden" style={{ minHeight }} ref={emblaRef}>
        <div className="flex" style={{ minHeight }}>
          {items.map((slide, index) => (
            <div key={index} className="relative flex-[0_0_100%] shrink-0" style={{ minHeight }}>
              {slide.image_url && (
                <>
                  <Image src={slide.image_url} alt={slide.title || "Servicio"} fill className="object-cover" priority={index === 0} unoptimized={shouldUnoptimizeImage(slide.image_url)} sizes="100vw" />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/82 via-slate-950/48 to-slate-950/15" />
                </>
              )}
              <div className="relative z-10 mx-auto flex w-full max-w-6xl items-center px-6 py-20 pb-32 sm:px-10 lg:px-14" style={{ minHeight }}>
                <div className="max-w-3xl space-y-5">
                  {slide.eyebrow && <span className="text-green-400 font-semibold text-sm tracking-wider uppercase">{slide.eyebrow}</span>}
                  <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                    {slide.title}{" "}
                    {slide.title_highlight && <span className="text-green-400">{slide.title_highlight}</span>}
                  </h1>
                  {slide.subtitle && <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">{slide.subtitle}</p>}
                  <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    {slide.cta_text && (
                      <Button size="lg" className="bg-green-600 hover:bg-green-700" asChild>
                        <Link href={normalizeContactHref(slide.cta_url)}>{slide.cta_text}</Link>
                      </Button>
                    )}
                    <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 bg-transparent" asChild>
                      <Link href={`tel:${EMPRENOR_LEGAL.telefonoPrincipalHref}`}>
                        <Phone className="mr-2 h-4 w-4" />
                        {EMPRENOR_LEGAL.telefonoPrincipal}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {loop && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-slate-950/70 to-transparent pt-16">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 pb-6 sm:px-10 sm:pb-8 lg:px-14">
            <button type="button" aria-label="Anterior" className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-slate-950/55 text-white shadow-lg backdrop-blur hover:bg-slate-950/80" onClick={() => emblaApi?.scrollPrev()}>
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="pointer-events-auto flex items-center justify-center gap-2">
              {items.map((_, i) => (
                <button key={i} type="button" aria-label={`Diapositiva ${i + 1}`} className={`h-2 rounded-full transition-all ${selected === i ? "w-8 bg-green-400" : "w-2 bg-white/55"}`} onClick={() => emblaApi?.scrollTo(i)} />
              ))}
            </div>
            <button type="button" aria-label="Siguiente" className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-slate-950/55 text-white shadow-lg backdrop-blur hover:bg-slate-950/80" onClick={() => emblaApi?.scrollNext()}>
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
