import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Hammer, CheckCircle, ArrowRight, Layers, Square, Boxes } from "lucide-react"
import Link from "next/link"

export default function AlbanileriaPage() {
  return (
    <main className="flex flex-col">
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="flex items-center gap-3">
              <Hammer className="h-10 w-10" />
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">Servicios de Albañilería</h1>
            </div>
            <p className="text-lg text-primary-foreground/90 leading-relaxed text-pretty">
              Trabajos especializados en mampostería, muros, pisos y revestimientos con técnicas tradicionales y
              modernas.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-12">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-foreground">Albañilería Profesional</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Ofrecemos servicios completos de albañilería para proyectos residenciales, comerciales e industriales.
                  Nuestros albañiles certificados cuentan con años de experiencia y dominan tanto técnicas tradicionales
                  como métodos modernos de construcción.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Desde la construcción de muros estructurales hasta acabados decorativos, garantizamos precisión,
                  durabilidad y excelencia en cada trabajo.
                </p>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-foreground">Servicios Especializados</h3>

                <Card className="border-border">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                        <Layers className="h-6 w-6 text-accent" />
                      </div>
                      <h4 className="text-xl font-semibold text-foreground">Construcción de Muros</h4>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      Construcción de muros estructurales y divisorios utilizando diversos materiales como ladrillo,
                      block, concreto y piedra. Incluye cimentación, levantamiento, plomeado y nivelación perfecta.
                      Muros con aislamiento térmico y acústico según especificaciones.
                    </p>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>Muros de carga estructural</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>Muros divisorios interiores</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>Bardas y muros perimetrales</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>Muros de contención</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                        <Square className="h-6 w-6 text-accent" />
                      </div>
                      <h4 className="text-xl font-semibold text-foreground">Pisos y Pavimentos</h4>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      Instalación profesional de todo tipo de pisos incluyendo cerámica, porcelanato, mármol, granito y
                      concreto pulido. Preparación adecuada de superficies, nivelación perfecta y acabados de alta
                      calidad. Trabajos en interiores y exteriores con garantía de durabilidad.
                    </p>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>Pisos de cerámica y porcelanato</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>Mármol y piedra natural</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>Concreto pulido y estampado</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>Firmes y contrapisos</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                        <Boxes className="h-6 w-6 text-accent" />
                      </div>
                      <h4 className="text-xl font-semibold text-foreground">Revestimientos y Acabados</h4>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      Aplicación de diversos revestimientos para proteger y embellecer superficies. Incluye azulejos,
                      losetas, piedra decorativa, estuco, aplanados y texturizados. Trabajo detallado en fachadas,
                      baños, cocinas y áreas exteriores con acabados impecables.
                    </p>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>Azulejos y losetas decorativas</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>Piedra y ladrillo aparente</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>Aplanados y repellados</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>Estuco veneciano y texturas</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-foreground">Materiales que Utilizamos</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <Card className="border-border">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-foreground mb-2">Mampostería</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Ladrillo rojo recocido</li>
                        <li>• Block de concreto</li>
                        <li>• Tabicón y tabique</li>
                        <li>• Adoquín</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-foreground mb-2">Recubrimientos</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Cerámica nacional e importada</li>
                        <li>• Porcelanato de alta gama</li>
                        <li>• Mármol y granito</li>
                        <li>• Piedra natural</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-foreground mb-2">Concretos</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Concreto premezclado</li>
                        <li>• Mortero especial</li>
                        <li>• Cemento Portland</li>
                        <li>• Agregados certificados</li>
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
                    <h3 className="text-lg font-semibold text-foreground">¿Necesita un albañil profesional?</h3>
                    <p className="text-sm text-muted-foreground">
                      Contáctenos para una evaluación gratuita y cotización detallada.
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
                        href="/servicios/remodelacion"
                        className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        → Remodelación
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
