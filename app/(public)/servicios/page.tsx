import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Wrench } from "lucide-react"
import { getPublishedServices } from "@/lib/site/get-services"
import { getServiceIcon } from "@/lib/site/service-icons"
import { buildPageMetadata } from "@/lib/site/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "Servicios",
  description:
    "Servicios integrales de construcción, remodelación, albañilería, electricidad, plomería, pintura, instalaciones de gas, viviendas prefabricadas y obras industriales en el NOA.",
  path: "/servicios",
})

export default async function ServiciosPage() {
  const services = await getPublishedServices()

  return (
    <main className="flex flex-col">
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-4xl text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium mb-4">
              <Wrench className="w-4 h-4" />
              Desde 2018 · construcción y servicios en el NOA
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-balance">
              Servicios Integrales de{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                Construcción
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed text-pretty">
              Soluciones completas en construcción, remodelación y servicios especializados para todo tipo de proyectos
              en Salta, Jujuy, Tucumán y Formosa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8" asChild>
                <Link href="/contacto">
                  Solicitar Cotización
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent" asChild>
                <Link href="/proyectos">Ver Proyectos Realizados</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-slate-50">
        <div className="container px-4 md:px-6">
          <Card className="text-center max-w-3xl mx-auto mb-16 border-0 shadow-none bg-transparent">
            <CardContent className="p-0 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Nuestros Servicios Especializados</h2>
              <p className="text-lg text-slate-600">
                Equipos profesionales certificados en cada especialidad. Calidad, seguridad y cumplimiento normativo
                garantizados en todo el NOA.
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const Icon = getServiceIcon(service.icon)
              const thumb = service.heroImage || service.gallery[0]
              return (
                <Card key={service.slug} className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white overflow-hidden">
                  {thumb ? (
                    <div className="relative h-44 w-full overflow-hidden">
                      <Image
                        src={thumb}
                        alt={service.heroImageAlt}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized={thumb.startsWith("http") || thumb.startsWith("/uploads")}
                      />
                    </div>
                  ) : (
                    <div className={`h-44 bg-gradient-to-br ${service.colorGradient} flex items-center justify-center`}>
                      <Icon className="w-16 h-16 text-white/90" />
                    </div>
                  )}
                  <CardContent className="p-8">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.colorGradient} flex items-center justify-center mb-4 -mt-12 relative z-10 border-4 border-white shadow`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold text-slate-900 mb-3">{service.title}</h3>
                    <p className="text-slate-600 mb-6 leading-relaxed line-clamp-3">{service.shortDescription}</p>
                    <div className="space-y-2 mb-6">
                      {service.features.slice(0, 4).map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-sm text-slate-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    <Link href={`/servicios/${service.slug}`} className="inline-flex items-center text-green-600 font-semibold hover:text-green-700 transition-colors group/link">
                      Ver detalles completos
                      <ArrowRight className="ml-2 w-5 h-5 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}
