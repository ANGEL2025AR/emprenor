import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Wrench, CheckCircle, ArrowRight, Home, Sparkles, ClipboardList, Paintbrush } from "lucide-react"
import Link from "next/link"

export default function RemodelacionPage() {
  return (
    <main className="flex flex-col">
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="flex items-center gap-3">
              <Wrench className="h-10 w-10" />
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">Servicios de Remodelación</h1>
            </div>
            <p className="text-lg text-primary-foreground/90 leading-relaxed text-pretty">
              Transformamos y modernizamos espacios existentes para adaptarlos a sus necesidades actuales con diseño
              innovador y funcionalidad mejorada.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-12">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-foreground">Remodelación Integral</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Renovamos y actualizamos espacios residenciales y comerciales para mejorar su funcionalidad, estética
                  y valor. Nuestro equipo trabaja con usted desde el concepto inicial hasta la ejecución final,
                  asegurando que cada detalle refleje su visión.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Ya sea que desee modernizar una cocina, renovar un baño, ampliar su hogar o transformar completamente
                  un espacio comercial, tenemos la experiencia y los recursos necesarios.
                </p>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-foreground">Proceso de Remodelación</h3>

                <div className="space-y-6">
                  <Card className="border-border">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground font-bold">
                          1
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <ClipboardList className="h-5 w-5 text-accent" />
                            <h4 className="font-semibold text-foreground">Evaluación Inicial</h4>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Visitamos su propiedad para evaluar el estado actual, identificar oportunidades de mejora y
                            comprender sus objetivos. Realizamos mediciones precisas, análisis estructural y evaluación
                            de instalaciones existentes. Discutimos presupuesto, plazos y expectativas.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground font-bold">
                          2
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-accent" />
                            <h4 className="font-semibold text-foreground">Diseño y Planificación</h4>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Desarrollamos propuestas de diseño que maximizan el potencial de su espacio. Creamos renders
                            3D y planos detallados para visualizar el resultado final. Seleccionamos materiales,
                            acabados y accesorios que se ajusten a su estilo y presupuesto. Obtenemos permisos
                            necesarios.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground font-bold">
                          3
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Home className="h-5 w-5 text-accent" />
                            <h4 className="font-semibold text-foreground">Demolición y Preparación</h4>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Protegemos las áreas que no serán remodeladas y procedemos con la demolición controlada de
                            estructuras existentes. Retiramos escombros y preparamos el espacio para la nueva
                            construcción. Actualizamos o reemplazan instalaciones eléctricas e hidráulicas según sea
                            necesario.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground font-bold">
                          4
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Wrench className="h-5 w-5 text-accent" />
                            <h4 className="font-semibold text-foreground">Construcción e Instalación</h4>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Ejecutamos la construcción siguiendo los planos aprobados. Instalamos nuevas estructuras,
                            acabados, gabinetes, iluminación y accesorios. Realizamos trabajos de carpintería,
                            albañilería, electricidad y plomería con precisión profesional. Mantenemos comunicación
                            constante sobre el progreso.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground font-bold">
                          5
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Paintbrush className="h-5 w-5 text-accent" />
                            <h4 className="font-semibold text-foreground">Acabados y Detalles</h4>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Aplicamos los toques finales incluyendo pintura, revestimientos decorativos y detalles
                            arquitectónicos. Instalamos pisos, azulejos y molduras. Verificamos el funcionamiento
                            perfecto de todas las instalaciones. Limpieza profunda y presentación final del espacio
                            renovado.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-foreground">Áreas de Especialización</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Card className="border-border">
                    <CardContent className="p-4 space-y-3">
                      <h4 className="font-semibold text-foreground">Cocinas</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Renovación completa de cocinas</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Instalación de gabinetes modernos</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Encimeras de cuarzo y granito</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Actualización de electrodomésticos</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardContent className="p-4 space-y-3">
                      <h4 className="font-semibold text-foreground">Baños</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Renovación de baños completos</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Duchas y bañeras modernas</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Vanidades y lavamanos elegantes</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Iluminación y ventilación mejorada</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardContent className="p-4 space-y-3">
                      <h4 className="font-semibold text-foreground">Espacios de Vida</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Salas y comedores</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Recámaras y vestidores</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Oficinas en casa</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Sótanos y áticos</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardContent className="p-4 space-y-3">
                      <h4 className="font-semibold text-foreground">Exteriores</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Fachadas y revestimientos</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Terrazas y patios</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Jardines y paisajismo</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Garajes y cocheras</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-6">
                <Card className="border-accent bg-accent/5">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">¿Listo para renovar?</h3>
                    <p className="text-sm text-muted-foreground">
                      Solicite una consulta gratuita y descubra cómo podemos transformar su espacio.
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
                      <Link
                        href="/servicios/construccion"
                        className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        → Construcción
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
