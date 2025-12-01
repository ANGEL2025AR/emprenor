import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Flame, CheckCircle, ArrowRight, Gauge, ShieldCheck, Wrench, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function GasPage() {
  return (
    <main className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="flex items-center gap-3">
              <Flame className="h-10 w-10" />
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">Instalaciones de Gas</h1>
            </div>
            <p className="text-lg text-primary-foreground/90 leading-relaxed text-pretty">
              Instalaciones de gas natural, envasado y GLP con certificación oficial. Seguridad y calidad garantizada en
              cada proyecto.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-12">
              {/* Overview */}
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-foreground">Instalaciones de Gas Certificadas</h2>
                <p className="text-muted-foreground leading-relaxed">
                  En EMPRENOR somos especialistas en instalaciones de gas para uso residencial, comercial e industrial.
                  Contamos con matriculación habilitante y cumplimos con todas las normativas de seguridad vigentes.
                  Nuestro equipo de gasistas certificados garantiza instalaciones seguras y eficientes.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Realizamos desde pequeñas instalaciones domiciliarias hasta grandes proyectos industriales, siempre
                  con el máximo compromiso de seguridad y calidad.
                </p>
              </div>

              {/* Process Steps */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-foreground">Proceso de Instalación</h3>

                <div className="space-y-6">
                  <Card className="border-border">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground font-bold">
                          1
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-accent" />
                            <h4 className="font-semibold text-foreground">Evaluación y Diagnóstico</h4>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Inspección inicial del sitio, análisis de viabilidad y evaluación de necesidades
                            energéticas. Verificamos condiciones de ventilación, ubicación de artefactos y recorrido de
                            cañerías. Elaboramos informe técnico y presupuesto detallado.
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
                            <Gauge className="h-5 w-5 text-accent" />
                            <h4 className="font-semibold text-foreground">Diseño y Cálculo</h4>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Diseño técnico de la instalación según normativas NAG-200 y reglamentaciones locales.
                            Cálculo de dimensionamiento de cañerías, medidores y reguladores de presión. Planificación
                            de recorridos optimizados y seguros.
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
                            <Wrench className="h-5 w-5 text-accent" />
                            <h4 className="font-semibold text-foreground">Instalación de Cañerías</h4>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Instalación de cañerías de acero o cobre según tipo de gas y presión. Tendido interno y
                            externo con fijaciones apropiadas. Instalación de válvulas de corte, reguladores de presión
                            y medidores. Utilizamos materiales certificados de primera calidad.
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
                            <AlertTriangle className="h-5 w-5 text-accent" />
                            <h4 className="font-semibold text-foreground">Pruebas de Hermeticidad</h4>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Pruebas de estanqueidad con aire comprimido o nitrógeno según normativa. Verificación de
                            todas las uniones y conexiones. Control de presión durante 24 horas para garantizar ausencia
                            total de fugas. Documentación fotográfica de todo el proceso.
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
                            <CheckCircle className="h-5 w-5 text-accent" />
                            <h4 className="font-semibold text-foreground">Conexión de Artefactos</h4>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Conexión segura de todos los artefactos a gas: cocinas, hornos, calefones, calderas,
                            termotanques, estufas y equipos industriales. Regulación y puesta en marcha de cada equipo.
                            Verificación de combustión correcta y ajustes finales.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground font-bold">
                          6
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-accent" />
                            <h4 className="font-semibold text-foreground">Certificación y Habilitación</h4>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Emisión de certificado de instalación con firma de gasista matriculado. Gestión de trámites
                            ante la distribuidora de gas. Entrega de planos conforme a obra y manual de uso.
                            Asesoramiento sobre mantenimiento preventivo y medidas de seguridad.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Types of Gas Installations */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-foreground">Tipos de Instalaciones</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Card className="border-border">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-foreground mb-2">Gas Natural</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Instalaciones domiciliarias</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Edificios y condominios</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Locales comerciales</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Restaurantes y hoteles</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-foreground mb-2">Gas Envasado (GLP)</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Sistemas individuales</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Tanques de almacenamiento</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Instalaciones rurales</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Zonas sin red de gas</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-foreground mb-2">Gas Industrial</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Plantas industriales</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Calderas y hornos</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Equipos de gran consumo</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Sistemas de calefacción central</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-foreground mb-2">Servicios Adicionales</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Mantenimiento preventivo</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Reparación de fugas</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Ampliaciones y modificaciones</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Certificaciones periódicas</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-6">
                <Card className="border-accent bg-accent/5">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">¿Interesado en este servicio?</h3>
                    <p className="text-sm text-muted-foreground">
                      Contáctenos para una consulta gratuita y cotización personalizada.
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
                        href="/servicios/viviendas-prefabricadas"
                        className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        → Viviendas Prefabricadas
                      </Link>
                      <Link
                        href="/servicios/obras-industriales"
                        className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        → Obras Industriales
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
