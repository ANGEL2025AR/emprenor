"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import useEmblaCarousel from "embla-carousel-react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, MessageSquare, Users, Wrench } from "lucide-react"
import type { SitePageHeroSlide } from "@/lib/db/models"
import { normalizeContactHref } from "@/lib/site/urls"

function HeroTitle({
  title,
  accent,
  className,
  accentClassName,
  as: Tag = "h1",
}: {
  title: string
  accent?: string
  className?: string
  accentClassName?: string
  as?: "h1" | "h2"
}) {
  const gradient = accentClassName ?? "text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500"
  if (!accent) {
    return <Tag className={className}>{title}</Tag>
  }
  const i = title.indexOf(accent)
  if (i < 0) {
    return <Tag className={className}>{title}</Tag>
  }
  return (
    <Tag className={className}>
      {title.slice(0, i)}
      <span className={gradient}>{accent}</span>
      {title.slice(i + accent.length)}
    </Tag>
  )
}

const heroFrame = "mx-auto w-full max-w-6xl px-6 sm:px-10 lg:px-14"

function SliderControls({
  slides,
  selected,
  onPrev,
  onNext,
  onGo,
}: {
  slides: { id: string }[]
  selected: number
  onPrev: () => void
  onNext: () => void
  onGo: (index: number) => void
}) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-slate-950/70 to-transparent pt-16">
      <div className={`${heroFrame} flex items-center justify-between gap-4 pb-6 sm:pb-8`}>
        <button
          type="button"
          aria-label="Anterior"
          className="pointer-events-auto inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 bg-slate-950/55 text-white shadow-lg backdrop-blur hover:bg-slate-950/80"
          onClick={onPrev}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="pointer-events-auto flex min-w-0 items-center justify-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Ir a diapositiva ${index + 1}`}
              className={`h-2 rounded-full transition-all ${selected === index ? "w-8 bg-green-400" : "w-2 bg-white/55"}`}
              onClick={() => onGo(index)}
            />
          ))}
        </div>
        <button
          type="button"
          aria-label="Siguiente"
          className="pointer-events-auto inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 bg-slate-950/55 text-white shadow-lg backdrop-blur hover:bg-slate-950/80"
          onClick={onNext}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
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
                    <Image src={slide.image} alt={slide.alt || slide.title} fill className="object-cover" unoptimized={Boolean(slide.image?.trim() && (slide.image.startsWith("http") || slide.image.startsWith("/assets")))} />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/82 via-primary/50 to-primary/20" />
                  </>
                ) : (
                  <div className="absolute inset-0 bg-primary" />
                )}
                <div className={`relative z-10 ${heroFrame} py-16 pb-28 md:py-20 md:pb-32`}>
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
          <SliderControls
            slides={slides}
            selected={selected}
            onPrev={() => emblaApi?.scrollPrev()}
            onNext={() => emblaApi?.scrollNext()}
            onGo={(index) => emblaApi?.scrollTo(index)}
          />
        ) : null}
      </section>
    )
  }

  return (
    <section className="relative min-h-[calc(100svh-4rem)] overflow-hidden">
      <div className="min-h-[calc(100svh-4rem)] overflow-hidden" ref={emblaRef}>
        <div className="flex h-full min-h-[calc(100svh-4rem)]">
          {slides.map((slide, index) => (
            <div key={slide.id} className="relative min-h-[calc(100svh-4rem)] flex-[0_0_100%] shrink-0 grow-0">
              {slide.image?.trim() ? (
                <Image
                  src={slide.image}
                  alt={slide.alt || slide.title}
                  fill
                  className="object-cover"
                  priority={slide.id === slides[0]?.id}
                  unoptimized={Boolean(slide.image?.trim() && (slide.image.startsWith("http") || slide.image.startsWith("/assets")))}
                />
              ) : (
                <div className="absolute inset-0 bg-slate-900" />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/82 via-slate-950/42 to-slate-950/12" />
              <div className={`relative z-10 flex min-h-[calc(100svh-4rem)] items-center ${heroFrame} py-24 pb-32`}>
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
                    as={index === 0 ? "h1" : "h2"}
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
                        <Link href={normalizeContactHref(slide.primaryCtaHref)}>
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
        <SliderControls
          slides={slides}
          selected={selected}
          onPrev={() => emblaApi?.scrollPrev()}
          onNext={() => emblaApi?.scrollNext()}
          onGo={(index) => emblaApi?.scrollTo(index)}
        />
      ) : (
        <div className="pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce">
          <div className="flex h-12 w-8 items-start justify-center rounded-full border-2 border-white/30 p-2">
            <div className="h-3 w-1 animate-pulse rounded-full bg-white/50" />
          </div>
        </div>
      )}
    </section>
  )
}
