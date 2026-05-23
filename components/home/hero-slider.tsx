"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import useEmblaCarousel from "embla-carousel-react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, MessageSquare, Users, Wrench } from "lucide-react"
import type { SitePageHeroSlide } from "@/lib/db/models"

function HeroTitle({
  title,
  accent,
  className,
  accentClassName,
}: {
  title: string
  accent?: string
  className?: string
  accentClassName?: string
}) {
  const gradient = accentClassName ?? "text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500"
  if (!accent) {
    return <h1 className={className}>{title}</h1>
  }
  const i = title.indexOf(accent)
  if (i < 0) {
    return <h1 className={className}>{title}</h1>
  }
  return (
    <h1 className={className}>
      {title.slice(0, i)}
      <span className={gradient}>{accent}</span>
      {title.slice(i + accent.length)}
    </h1>
  )
}

function SimpleHeroIcon({ pageSlug }: { pageSlug: string }) {
  const Icon = pageSlug === "nosotros" ? Users : MessageSquare
  return (
    <div className="flex items-center justify-center gap-3">
      <Icon className="h-10 w-10" />
    </div>
  )
}

/** Controles abajo del hero: no superponen título ni CTAs. */
function HeroCarouselControls({
  slides,
  selected,
  onPrev,
  onNext,
  onGoTo,
  variant,
}: {
  slides: SitePageHeroSlide[]
  selected: number
  onPrev: () => void
  onNext: () => void
  onGoTo: (index: number) => void
  variant: "immersive" | "simple"
}) {
  const arrowClass =
    variant === "immersive"
      ? "rounded-full bg-white/10 p-2.5 text-white backdrop-blur hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
      : "rounded-full bg-black/30 p-2.5 text-white hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
  const dotActive = variant === "immersive" ? "w-8 bg-green-400" : "w-8 bg-white"
  const dotIdle = variant === "immersive" ? "w-2 bg-white/40" : "w-2 bg-white/50"

  return (
    <div
      className="absolute bottom-6 left-0 right-0 z-20 flex items-center justify-center gap-3 px-4 sm:gap-4"
      role="group"
      aria-label="Navegación del carrusel"
    >
      <button type="button" aria-label="Diapositiva anterior" className={arrowClass} onClick={onPrev}>
        <ChevronLeft className="h-6 w-6 shrink-0" />
      </button>
      <div className="flex max-w-[min(100%,12rem)] flex-wrap items-center justify-center gap-2 sm:max-w-none">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            aria-label={`Ir a diapositiva ${i + 1}`}
            aria-current={selected === i ? "true" : undefined}
            className={`h-2 shrink-0 rounded-full transition-all ${selected === i ? dotActive : dotIdle}`}
            onClick={() => onGoTo(i)}
          />
        ))}
      </div>
      <button type="button" aria-label="Diapositiva siguiente" className={arrowClass} onClick={onNext}>
        <ChevronRight className="h-6 w-6 shrink-0" />
      </button>
    </div>
  )
}

export function HeroSlider({
  slides,
  variant,
  pageSlug = "home",
}: {
  slides: SitePageHeroSlide[]
  variant: "immersive" | "simple"
  pageSlug?: string
}) {
  const loop = slides.length > 1
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop, align: "start" })
  const [selected, setSelected] = useState(0)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelected(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("reInit", onSelect)
    emblaApi.on("select", onSelect)
    return () => {
      emblaApi.off("select", onSelect)
      emblaApi.off("reInit", onSelect)
    }
  }, [emblaApi, onSelect])

  useEffect(() => {
    if (!emblaApi || slides.length <= 1) return
    const t = window.setInterval(() => {
      emblaApi.scrollNext()
    }, 8000)
    return () => window.clearInterval(t)
  }, [emblaApi, slides.length])

  if (variant === "simple") {
    const singleNoCarousel = slides.length === 1 && !slides[0].image?.trim()
    if (singleNoCarousel) {
      const s = slides[0]
      return (
        <section className="bg-primary text-primary-foreground py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center space-y-6">
              <SimpleHeroIcon pageSlug={pageSlug} />
              <HeroTitle
                title={s.title}
                accent={s.titleAccent}
                className="text-4xl font-bold tracking-tight sm:text-5xl text-balance text-primary-foreground"
                accentClassName="text-primary-foreground underline decoration-green-300 decoration-2 underline-offset-4"
              />
              {s.subtitle ? (
                <p className="text-lg text-primary-foreground/90 leading-relaxed text-pretty">{s.subtitle}</p>
              ) : null}
            </div>
          </div>
        </section>
      )
    }

    return (
      <section className="relative min-h-[40vh] md:min-h-[50vh] overflow-hidden bg-primary text-primary-foreground">
        <div className="overflow-hidden min-h-[40vh] md:min-h-[50vh]" ref={emblaRef}>
          <div className="flex min-h-[40vh] md:min-h-[50vh]">
            {slides.map((slide) => (
              <div
                key={slide.id}
                className="relative min-h-[40vh] md:min-h-[50vh] flex-[0_0_100%] flex items-center justify-center"
              >
                {slide.image?.trim() ? (
                  <>
                    <Image src={slide.image} alt={slide.alt || slide.title} fill className="object-cover opacity-40" />
                    <div className="absolute inset-0 bg-primary/85" />
                  </>
                ) : (
                  <div className="absolute inset-0 bg-primary" />
                )}
                <div
                  className={`relative z-10 container px-4 md:px-6 py-16 md:py-24 ${loop ? "pb-28 md:pb-32" : ""}`}
                >
                  <div className="mx-auto max-w-3xl text-center space-y-6">
                    <SimpleHeroIcon pageSlug={pageSlug} />
                    <HeroTitle
                      title={slide.title}
                      accent={slide.titleAccent}
                      className="text-4xl font-bold tracking-tight sm:text-5xl text-balance"
                    />
                    {slide.subtitle ? (
                      <p className="text-lg text-primary-foreground/90 leading-relaxed text-pretty">{slide.subtitle}</p>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {loop ? (
          <HeroCarouselControls
            slides={slides}
            selected={selected}
            variant="simple"
            onPrev={() => emblaApi?.scrollPrev()}
            onNext={() => emblaApi?.scrollNext()}
            onGoTo={(i) => emblaApi?.scrollTo(i)}
          />
        ) : null}
      </section>
    )
  }

  return (
    <section className="relative min-h-[90vh] overflow-hidden">
      <div className="min-h-[90vh] overflow-hidden" ref={emblaRef}>
        <div className="flex h-full min-h-[90vh]">
          {slides.map((slide) => (
            <div key={slide.id} className="relative min-h-[90vh] flex-[0_0_100%] shrink-0 grow-0">
              {slide.image?.trim() ? (
                <Image
                  src={slide.image}
                  alt={slide.alt || slide.title}
                  fill
                  className="object-cover"
                  priority={slide.id === slides[0]?.id}
                />
              ) : (
                <div className="absolute inset-0 bg-slate-900" />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/50" />
              <div
                className={`container relative z-10 mx-auto flex min-h-[90vh] items-center px-4 py-20 ${loop ? "pb-28 md:pb-32" : ""}`}
              >
                <div className="max-w-3xl">
                  {slide.badgeText ? (
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-400">
                      <Wrench className="h-4 w-4" />
                      {slide.badgeText}
                    </div>
                  ) : null}
                  <HeroTitle
                    title={slide.title}
                    accent={slide.titleAccent}
                    className="mb-6 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl"
                  />
                  {slide.subtitle ? (
                    <p className="mb-8 text-lg leading-relaxed text-slate-300 md:text-xl">{slide.subtitle}</p>
                  ) : null}
                  <div className="flex flex-col gap-4 sm:flex-row">
                    {slide.primaryCtaLabel && slide.primaryCtaHref ? (
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6 text-lg text-white hover:from-green-700 hover:to-emerald-700"
                        asChild
                      >
                        <Link href={slide.primaryCtaHref}>
                          {slide.primaryCtaLabel}
                          <ChevronRight className="ml-2 h-5 w-5" />
                        </Link>
                      </Button>
                    ) : null}
                    {slide.secondaryCtaLabel && slide.secondaryCtaHref ? (
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-white/20 bg-transparent px-8 py-6 text-lg text-white hover:bg-white/10"
                        asChild
                      >
                        <Link href={slide.secondaryCtaHref}>{slide.secondaryCtaLabel}</Link>
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {loop ? (
        <HeroCarouselControls
          slides={slides}
          selected={selected}
          variant="immersive"
          onPrev={() => emblaApi?.scrollPrev()}
          onNext={() => emblaApi?.scrollNext()}
          onGoTo={(i) => emblaApi?.scrollTo(i)}
        />
      ) : null}

      {!loop ? (
        <div className="pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce">
          <div className="flex h-12 w-8 items-start justify-center rounded-full border-2 border-white/30 p-2">
            <div className="h-3 w-1 animate-pulse rounded-full bg-white/50" />
          </div>
        </div>
      ) : null}
    </section>
  )
}
