import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, CheckCircle } from "lucide-react"
import type { SiteService } from "@/lib/db/models"
import { getServiceIcon } from "@/lib/site/service-icons"
import { ServiceGallery } from "@/components/public/service-gallery"

export function ServiceDetailPage({
  service,
  otherServices,
}: {
  service: SiteService
  otherServices: SiteService[]
}) {
  const Icon = getServiceIcon(service.icon)
  const heroSrc = service.heroImage?.trim() || ""
  const galleryImages = service.gallery.filter(Boolean)

  return (
    <main className="flex flex-col">
      <section className="relative bg-primary text-primary-foreground py-16 md:py-24 overflow-hidden">
        {heroSrc ? (
          <Image
            src={heroSrc}
            alt={service.heroImageAlt}
            fill
            className="object-cover opacity-30"
            priority
            unoptimized={heroSrc.startsWith("http") || heroSrc.startsWith("/uploads")}
          />
        ) : null}
        <div className="container relative px-4 md:px-6">
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="flex items-center gap-3">
              <Icon className="h-10 w-10" />
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">
                Servicios de {service.title}
              </h1>
            </div>
            <p className="text-lg text-primary-foreground/90 leading-relaxed text-pretty">{service.shortDescription}</p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-12">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-foreground">{service.overviewTitle}</h2>
                {service.overviewParagraphs.map((p) => (
                  <p key={p.slice(0, 48)} className="text-muted-foreground leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>

              {galleryImages.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-foreground">Galería de trabajos realizados</h3>
                  <ServiceGallery images={galleryImages} title={service.title} />
                </div>
              ) : null}

              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-foreground">Proceso de trabajo</h3>
                <div className="space-y-6">
                  {[...service.processSteps]
                    .sort((a, b) => a.order - b.order)
                    .map((step) => (
                      <Card key={step.order} className="border-border">
                        <CardContent className="p-6">
                          <div className="flex gap-4">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground font-bold">
                              {step.order}
                            </div>
                            <div className="space-y-2">
                              <h4 className="font-semibold text-foreground">{step.title}</h4>
                              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-foreground">Tipos de trabajo</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {service.workCategories.map((cat) => (
                    <Card key={cat.title} className="border-border overflow-hidden">
                      {cat.image ? (
                        <div className="relative h-40 w-full">
                          <Image
                            src={cat.image}
                            alt={cat.title}
                            fill
                            className="object-cover"
                            unoptimized={cat.image.startsWith("http") || cat.image.startsWith("/uploads")}
                          />
                        </div>
                      ) : null}
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-foreground mb-2">{cat.title}</h4>
                        {cat.description ? (
                          <p className="text-sm text-muted-foreground mb-2">{cat.description}</p>
                        ) : null}
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          {cat.items.map((item) => (
                            <li key={item} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {service.benefits.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-foreground">Por qué elegir EMPRENOR</h3>
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {service.benefits.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-muted-foreground">
                        <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-6">
                <Card className="border-accent bg-accent/5">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">¿Interesado en este servicio?</h3>
                    <p className="text-sm text-muted-foreground">
                      Contactanos para una consulta gratuita y cotización personalizada.
                    </p>
                    <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                      <Link href="/contacto">
                        Solicitar Cotización
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Otros Servicios</h3>
                    <div className="space-y-2">
                      {otherServices
                        .filter((s) => s.slug !== service.slug)
                        .slice(0, 6)
                        .map((s) => (
                          <Link
                            key={s.slug}
                            href={`/servicios/${s.slug}`}
                            className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            → {s.title}
                          </Link>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
