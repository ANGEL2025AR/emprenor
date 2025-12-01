import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Building2, CheckCircle, ArrowRight, HardHat, Ruler, ClipboardCheck, Truck } from "lucide-react"
import Link from "next/link"

export default function ConstruccionPage() {
  return (
    <main className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="flex items-center gap-3">
              <Building2 className="h-10 w-10" />
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">Servicios de Construcción</h1>
            </div>
            <p className="text-lg text-primary-foreground/90 leading-relaxed text-pretty">
              Construimos proyectos residenciales, comerciales e industriales con los más altos estándares de calidad,
              seguridad y eficiencia.
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
                <h2 className="text-3xl font-bold text-foreground">Construcción Profesional</h2>
                <p className="text-muted-foreground leading-relaxed">
                  En EMPRENOR, ofrecemos servicios integrales de construcción desde la planificación inicial hasta la
                  entrega final del proyecto. Nuestro equipo de profesionales altamente calificados se encarga de cada
                  detalle para garantizar que su proyecto se complete a tiempo, dentro del presupuesto y con la máxima
                  calidad.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Contamos con más de 15 años de experiencia en la industria de la construcción, habiendo completado
                  exitosamente cientos de proyectos de diversos tamaños y complejidades.
                </p>
              </div>

              {/* Process Steps */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-foreground">Proceso de Construcción</h3>

                <div className="space-y-6">
                  <Card className="border-border">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground font-bold">
                          1
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <ClipboardCheck className="h-5 w-5 text-accent" />
                            <h4 className="font-semibold text-foreground">Consulta y Planificación</h4>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Reunión inicial para comprender sus necesidades y objetivos. Realizamos un análisis
                            detallado del sitio, evaluamos requisitos estructurales y desarrollamos un plan de
                            construcción integral. Incluye estudios de factibilidad, análisis de costos y creación de
                            cronogramas preliminares.
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
                            <Ruler className="h-5 w-5 text-accent" />
                            <h4 className="font-semibold text-foreground">Diseño y Permisos</h4>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Desarrollo de planos arquitectónicos y estructurales detallados. Gestionamos todos los
                            permisos y aprobaciones necesarias con las autoridades locales. Incluye diseño de
                            instalaciones eléctricas, hidráulicas y sanitarias, así como especificaciones técnicas
                            completas.
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
                            <HardHat className="h-5 w-5 text-accent" />
                            <h4 className="font-semibold text-foreground">Preparación del Sitio</h4>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Limpieza y nivelación del terreno, excavaciones necesarias y preparación de cimentaciones.
                            Instalamos servicios temporales, establecemos medidas de seguridad y organizamos el área de
                            trabajo para optimizar el flujo de construcción.
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
                            <Building2 className="h-5 w-5 text-accent" />
                            <h4 className="font-semibold text-foreground">Construcción de Estructura</h4>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Construcción de cimientos, estructura de concreto y/o acero, muros y techos. Utilizamos
                            materiales de primera calidad y técnicas constructivas modernas. Realizamos inspecciones
                            continuas de calidad y cumplimiento de especificaciones técnicas.
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
                            <Truck className="h-5 w-5 text-accent" />
                            <h4 className="font-semibold text-foreground">Instalaciones y Acabados</h4>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Instalación completa de sistemas eléctricos, hidráulicos y sanitarios. Aplicación de
                            acabados interiores y exteriores incluyendo pisos, revestimientos, pintura y detalles
                            finales. Verificación de funcionamiento de todos los sistemas.
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
                            <CheckCircle className="h-5 w-5 text-accent" />
                            <h4 className="font-semibold text-foreground">Inspección Final y Entrega</h4>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Inspección exhaustiva de todos los trabajos realizados. Limpieza final del sitio y
                            corrección de detalles pendientes. Entrega de documentación completa, garantías y
                            certificados de cumplimiento. Capacitación sobre el uso y mantenimiento de las
                            instalaciones.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Types of Construction */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-foreground">Tipos de Construcción</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Card className="border-border">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-foreground mb-2">Construcción Residencial</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Casas unifamiliares</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Condominios y apartamentos</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Desarrollos habitacionales</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-foreground mb-2">Construcción Comercial</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Oficinas y edificios corporativos</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Locales comerciales y tiendas</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Centros comerciales</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-foreground mb-2">Construcción Industrial</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Naves industriales</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Bodegas y almacenes</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Plantas de producción</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-foreground mb-2">Proyectos Especiales</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Instalaciones deportivas</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Instituciones educativas</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Centros de salud</span>
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
