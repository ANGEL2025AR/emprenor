import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Zap, CheckCircle, ArrowRight, Lightbulb, Cable, Shield } from "lucide-react"
import Link from "next/link"

export default function ElectricidadPage() {
  return (
    <main className="flex flex-col">
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="flex items-center gap-3">
              <Zap className="h-10 w-10" />
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">Servicios Eléctricos</h1>
            </div>
            <p className="text-lg text-primary-foreground/90 leading-relaxed text-pretty">
              Instalaciones eléctricas certificadas, reparaciones y mantenimiento cumpliendo todas las normativas de
              seguridad.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-12">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-foreground">Electricidad Profesional</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Nuestros electricistas certificados ofrecen servicios completos de instalación, reparación y
                  mantenimiento eléctrico para residencias, comercios e industrias. Cumplimos estrictamente con todas
                  las normas y códigos eléctricos vigentes para garantizar la seguridad de su propiedad.
                </p>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-foreground">Nuestros Servicios</h3>

                <Card className="border-border">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                        <Cable className="h-6 w-6 text-accent" />
                      </div>
                      <h4 className="text-xl font-semibold text-foreground">Instalaciones Nuevas</h4>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      Diseño e instalación completa de sistemas eléctricos desde cero. Incluye cableado estructurado,
                      tableros de distribución, centros de carga, contactos, apagadores e iluminación. Proyectos
                      residenciales, comerciales e industriales con certificación oficial.
                    </p>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>Cableado completo residencial</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>Instalaciones comerciales</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>Sistemas trifásicos industriales</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>Acometidas y medidores</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                        <Lightbulb className="h-6 w-6 text-accent" />
                      </div>
                      <h4 className="text-xl font-semibold text-foreground">Iluminación</h4>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      Diseño e instalación de sistemas de iluminación eficientes y decorativos. Iluminación LED de bajo
                      consumo, sistemas inteligentes, iluminación exterior y de seguridad. Actualización de luminarias
                      antiguas a tecnología moderna.
                    </p>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>Iluminación LED eficiente</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>Sistemas inteligentes</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>Iluminación decorativa</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>Iluminación exterior</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                        <Shield className="h-6 w-6 text-accent" />
                      </div>
                      <h4 className="text-xl font-semibold text-foreground">Mantenimiento y Reparaciones</h4>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      Servicio de mantenimiento preventivo y correctivo. Diagnóstico y reparación de fallas eléctricas,
                      actualización de instalaciones antiguas, reemplazo de componentes dañados. Servicio de emergencia
                      disponible 24/7.
                    </p>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>Reparaciones de emergencia</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>Mantenimiento preventivo</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>Actualización de tableros</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>Certificación de instalaciones</span>
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
                    <h3 className="text-lg font-semibold text-foreground">¿Necesita un electricista?</h3>
                    <p className="text-sm text-muted-foreground">
                      Contáctenos para servicio profesional y certificado.
                    </p>
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
                        href="/servicios/plomeria"
                        className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        → Plomería
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
