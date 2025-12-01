import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Home, CheckCircle, ArrowRight, Zap, DollarSign, Clock, Ruler } from "lucide-react"
import Link from "next/link"

export default function ViviendasPrefabricadasPage() {
  return (
    <main className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="flex items-center gap-3">
              <Home className="h-10 w-10" />
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">Viviendas Prefabricadas</h1>
            </div>
            <p className="text-lg text-primary-foreground/90 leading-relaxed text-pretty">
              Construcción rápida, eficiente y económica de viviendas prefabricadas modulares con diseños modernos y
              funcionales.
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
                <h2 className="text-3xl font-bold text-foreground">Soluciones Habitacionales Modernas</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Las viviendas prefabricadas de EMPRENOR combinan diseño contemporáneo, eficiencia energética y rapidez
                  constructiva. Fabricamos módulos estructurales en nuestras instalaciones bajo estricto control de
                  calidad, lo que garantiza terminaciones perfectas y plazos de entrega reducidos.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Ofrecemos desde viviendas económicas de un ambiente hasta casas amplias de múltiples dormitorios,
                  todas con posibilidad de personalización según las necesidades del cliente.
                </p>
              </div>

              {/* Advantages */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-foreground">Ventajas de Nuestras Viviendas</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Card className="border-border">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Clock className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">Construcción Rápida</h4>
                          <p className="text-sm text-muted-foreground">
                            Plazos de entrega de 30 a 90 días según el modelo. Fabricación simultánea de módulos y
                            preparación del terreno.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <DollarSign className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">Costos Predecibles</h4>
                          <p className="text-sm text-muted-foreground">
                            Precio cerrado sin sorpresas. Hasta 30% más económico que construcción tradicional.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Zap className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">Eficiencia Energética</h4>
                          <p className="text-sm text-muted-foreground">
                            Aislación térmica superior, menor consumo de calefacción y refrigeración. Paneles con
                            tecnología SIP.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Ruler className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">Diseño Personalizable</h4>
                          <p className="text-sm text-muted-foreground">
                            Adaptamos diseños estándar o creamos proyectos a medida según sus necesidades y presupuesto.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
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
                          <h4 className="font-semibold text-foreground">Consulta y Diseño</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Reunión para definir necesidades, presupuesto y ubicación. Presentamos catálogo de modelos
                            disponibles o desarrollamos diseño personalizado. Entregamos renders 3D, planos y cotización
                            detallada.
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
                          <h4 className="font-semibold text-foreground">Preparación del Terreno</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Nivelación y compactación del terreno. Construcción de cimientos y base de apoyo (platea de
                            hormigón o pilotes). Instalación de servicios básicos: agua, electricidad, gas y desagües.
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
                          <h4 className="font-semibold text-foreground">Fabricación de Módulos</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Construcción de módulos en planta industrial bajo techo. Estructura de acero galvanizado o
                            madera tratada. Paneles SIP con aislación térmica de alta densidad. Control de calidad en
                            cada etapa.
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
                          <h4 className="font-semibold text-foreground">Montaje en Sitio</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Transporte e instalación de módulos en 3-7 días. Ensamblaje y fijación estructural. Sellado
                            de uniones e impermeabilización. Conexión de todas las instalaciones eléctricas, sanitarias
                            y de gas.
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
                          <h4 className="font-semibold text-foreground">Terminaciones Finales</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Instalación de revestimientos interiores y exteriores. Colocación de pisos, aberturas,
                            sanitarios y artefactos. Pintura y detalles decorativos. Verificación de funcionamiento de
                            todos los sistemas.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Models Available */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-foreground">Modelos Disponibles</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Card className="border-border">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-foreground mb-2">Modelo Compacto</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>25-35 m² - 1 dormitorio</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Cocina-comedor integrado</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Baño completo</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Ideal para primeras viviendas</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-foreground mb-2">Modelo Familiar</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>50-70 m² - 2/3 dormitorios</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Living-comedor separado</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Cocina independiente</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>1 o 2 baños</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-foreground mb-2">Modelo Premium</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>80-120 m² - 3/4 dormitorios</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Ambientes amplios</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Suite principal con baño</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Galería o deck exterior</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-foreground mb-2">Modelo Personalizado</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Diseño a medida</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Dimensiones adaptables</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Distribución según necesidad</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>Terminaciones premium</span>
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
                        href="/servicios/obras-industriales"
                        className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        → Obras Industriales
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
                        href="/servicios/plomeria"
                        className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        → Plomería
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
