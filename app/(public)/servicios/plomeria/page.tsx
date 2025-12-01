import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Droplet, CheckCircle, ArrowRight, Wrench, Waves, Bath } from "lucide-react"
import Link from "next/link"

export default function PlomeriaPage() {
  return (
    <main className="flex flex-col">
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="flex items-center gap-3">
              <Droplet className="h-10 w-10" />
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">Servicios de Plomería</h1>
            </div>
            <p className="text-lg text-primary-foreground/90 leading-relaxed text-pretty">
              Sistemas hidráulicos y sanitarios completos, reparaciones de emergencia e instalaciones de calidad
              certificada.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-12">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-foreground">Plomería Profesional</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Ofrecemos servicios completos de plomería para instalaciones nuevas, reparaciones y mantenimiento.
                  Nuestros plomeros certificados utilizan materiales de primera calidad y técnicas modernas para
                  garantizar instalaciones duraderas y libres de fugas.
                </p>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-foreground">Servicios Especializados</h3>

                <Card className="border-border">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                        <Waves className="h-6 w-6 text-accent" />
                      </div>
                      <h4 className="text-xl font-semibold text-foreground">Instalaciones Hidráulicas</h4>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      Diseño e instalación completa de sistemas de agua potable incluyendo tuberías de alimentación,
                      distribución, cisternas, tinacos y bombas. Utilizamos materiales certificados como cobre, PVC y
                      PEX. Garantizamos presión adecuada y suministro constante.
                    </p>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>Redes de agua potable</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>Cisternas y tinacos</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>Bombas y sistemas de presión</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>Calentadores de agua</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                        <Bath className="h-6 w-6 text-accent" />
                      </div>
                      <h4 className="text-xl font-semibold text-foreground">Instalaciones Sanitarias</h4>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      Instalación de drenajes, bajadas pluviales, fosas sépticas y conexiones al sistema municipal.
                      Incluye instalación de muebles sanitarios, regaderas, tinas, lavabos, inodoros y accesorios.
                      Garantizamos flujo adecuado y prevención de malos olores.
                    </p>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>Drenajes y desagües</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>Muebles sanitarios completos</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>Fosas sépticas</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>Biodigestores</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                        <Wrench className="h-6 w-6 text-accent" />
                      </div>
                      <h4 className="text-xl font-semibold text-foreground">Reparaciones y Mantenimiento</h4>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      Servicio de reparación de fugas, destape de drenajes, cambio de válvulas y accesorios.
                      Mantenimiento preventivo de tinacos, cisternas y sistemas de bombeo. Servicio de emergencia 24/7
                      para atender urgencias y minimizar daños por agua.
                    </p>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>Reparación de fugas</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>Destape de drenajes</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>Cambio de válvulas y llaves</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>Servicio de emergencia 24/7</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-6">
                <Card className="border-accent bg-accent/5">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">¿Necesita un plomero?</h3>
                    <p className="text-sm text-muted-foreground">Servicio profesional y confiable. Emergencias 24/7.</p>
                    <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                      <Link href="/contacto">
                        Solicitar Servicio
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Otros Servicios</h3>
                    <div className="space-y-2">
                      <Link
                        href="/servicios/construccion"
                        className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        → Construcción
                      </Link>
                      <Link
                        href="/servicios/remodelacion"
                        className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        → Remodelación
                      </Link>
                      <Link
                        href="/servicios/albanileria"
                        className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        → Albañilería
                      </Link>
                      <Link
                        href="/servicios/electricidad"
                        className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        → Electricidad
                      </Link>
                      <Link
                        href="/servicios/pintura"
                        className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        → Pintura
                      </Link>
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
