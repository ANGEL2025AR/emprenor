import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Factory, CheckCircle, ArrowRight, Tractor, Warehouse, Building } from "lucide-react"
import Link from "next/link"

export default function ObrasIndustrialesPage() {
  return (
    <main className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="flex items-center gap-3">
              <Factory className="h-10 w-10" />
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">
                Obras Industriales y Agropecuarias
              </h1>
            </div>
            <p className="text-lg text-primary-foreground/90 leading-relaxed text-pretty">
              Construcción de estructuras metálicas, galpones, naves industriales y establecimientos agropecuarios con
              tecnología de última generación.
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
                <h2 className="text-3xl font-bold text-foreground">Soluciones para la Industria y el Campo</h2>
                <p className="text-muted-foreground leading-relaxed">
                  EMPRENOR es especialista en obras industriales y agropecuarias de gran envergadura. Diseñamos y
                  construimos estructuras metálicas resistentes, funcionales y económicas que se adaptan a las
                  necesidades específicas de cada sector productivo.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Trabajamos con perfiles de acero estructural, cubiertas metálicas, cerramientos y todos los sistemas
                  necesarios para crear espacios de trabajo eficientes y seguros.
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
                          <h4 className="font-semibold text-foreground">Relevamiento y Anteproyecto</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Visita al sitio para evaluar condiciones del terreno, accesos y servicios. Análisis de
                            necesidades operativas y de producción. Desarrollo de anteproyecto con dimensiones,
                            distribución y especificaciones técnicas preliminares.
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
                          <h4 className="font-semibold text-foreground">Ingeniería y Cálculo Estructural</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Diseño estructural completo según normativas vigentes. Cálculo de cargas, dimensionamiento
                            de perfiles y verificación de estabilidad. Planos de fabricación y montaje con detalles
                            constructivos. Memoria de cálculo y especificaciones técnicas.
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
                          <h4 className="font-semibold text-foreground">Preparación de Terreno y Fundaciones</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Movimiento de suelos, nivelación y compactación. Excavación de bases para columnas.
                            Construcción de cimientos de hormigón armado con dados y pedestales. Instalación de anclajes
                            y placas de apoyo para la estructura metálica.
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
                          <h4 className="font-semibold text-foreground">Fabricación de Estructura Metálica</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Corte, perforado y soldadura de perfiles estructurales en taller. Tratamiento anticorrosivo
                            y pintura protectora. Control de calidad dimensional y verificación de soldaduras. Marcado e
                            identificación de piezas para el montaje.
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
                          <h4 className="font-semibold text-foreground">Montaje de Estructura</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Transporte de estructura al sitio. Montaje con equipos especializados (grúas y
                            autoelevadores). Abulonado y soldadura de uniones. Aplomado, nivelación y verificación de
                            tolerancias. Instalación de correas, tirantería y cruces de arriostramiento.
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
                          <h4 className="font-semibold text-foreground">Cubierta y Cerramientos</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Instalación de chapas trapezoidales o paneles tipo sándwich en cubierta. Colocación de
                            cerramientos laterales según requerimiento. Instalación de canaletas, bajadas pluviales y
                            accesorios. Aberturas, portones y sistemas de iluminación natural.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground font-bold">
                          7
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-semibold text-foreground">Instalaciones Complementarias</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Instalación eléctrica industrial completa. Sistemas de iluminación LED de alta eficiencia.
                            Ventilación natural o forzada según necesidad. Instalaciones sanitarias, agua y gas. Pisos
                            industriales de hormigón o resina epoxi. Oficinas y vestuarios si corresponde.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Types of Industrial Projects */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-foreground">Tipos de Proyectos</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Card className="border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Warehouse className="h-5 w-5 text-accent" />
                        <h4 className="font-semibold text-foreground">Naves Industriales</h4>
                      </div>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Plantas de producción</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Depósitos y almacenes</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Talleres mecánicos</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Centros logísticos</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Tractor className="h-5 w-5 text-accent" />
                        <h4 className="font-semibold text-foreground">Establecimientos Agropecuarios</h4>
                      </div>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Galpones para maquinaria agrícola</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Silos y almacenamiento de granos</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Corrales y mangas de ganado</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Tambos y salas de ordeñe</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Building className="h-5 w-5 text-accent" />
                        <h4 className="font-semibold text-foreground">Estructuras Especiales</h4>
                      </div>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Tinglados y cobertizos</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Estructuras para paneles solares</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Puentes grúa</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Marquesinas y porches</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Factory className="h-5 w-5 text-accent" />
                        <h4 className="font-semibold text-foreground">Infraestructura Comercial</h4>
                      </div>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Estaciones de servicio</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Lavaderos de autos</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Centros de acopio</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Mercados y ferias</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-foreground">Características de Nuestras Estructuras</h3>
                <div className="grid gap-4">
                  <Card className="border-border">
                    <CardContent className="p-4">
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>
                            <strong>Resistencia estructural:</strong> Diseñadas para soportar cargas de viento, nieve y
                            sismo según zona geográfica
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>
                            <strong>Grandes luces:</strong> Espacios libres de columnas hasta 30 metros de luz sin
                            apoyos intermedios
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>
                            <strong>Rapidez de montaje:</strong> Estructuras prefabricadas con tiempos de ejecución
                            reducidos
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>
                            <strong>Flexibilidad:</strong> Posibilidad de ampliaciones futuras y modificaciones
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>
                            <strong>Durabilidad:</strong> Tratamientos anticorrosivos y pinturas de alta resistencia
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>
                            <strong>Economía:</strong> Optimización de materiales y menores costos de mantenimiento
                          </span>
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
                        href="/servicios/viviendas-prefabricadas"
                        className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        → Viviendas Prefabricadas
                      </Link>
                      <Link
                        href="/servicios/gas"
                        className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        → Instalaciones de Gas
                      </Link>
                      <Link
                        href="/servicios/electricidad"
                        className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        → Electricidad
                      </Link>
                      <Link
                        href="/servicios/albanileria"
                        className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        → Albañilería
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
