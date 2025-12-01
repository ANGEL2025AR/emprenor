import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PaintBucket, CheckCircle, ArrowRight, Paintbrush, Palette, SprayCan } from "lucide-react"
import Link from "next/link"

export default function PinturaPage() {
  return (
    <main className="flex flex-col">
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="flex items-center gap-3">
              <PaintBucket className="h-10 w-10" />
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">Servicios de Pintura</h1>
            </div>
            <p className="text-lg text-primary-foreground/90 leading-relaxed text-pretty">
              Acabados profesionales en pintura interior y exterior con preparación impecable y revestimientos
              decorativos de alta calidad.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-12">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-foreground">Pintura Profesional</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Transformamos espacios a través del color y los acabados. Nuestro equipo de pintores profesionales
                  prepara meticulosamente cada superficie y aplica técnicas especializadas para lograr resultados
                  impecables y duraderos que realzan la belleza de su propiedad.
                </p>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-foreground">Servicios de Pintura</h3>

                <Card className="border-border">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                        <Paintbrush className="h-6 w-6 text-accent" />
                      </div>
                      <h4 className="text-xl font-semibold text-foreground">Pintura Interior</h4>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      Renovación completa de espacios interiores con preparación profesional de superficies, resanado de
                      grietas, aplicación de sellador y capas de acabado. Utilizamos pinturas de alta calidad lavables y
                      ecológicas. Acabados mate, satinado o brillante según sus preferencias.
                    </p>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>Salas y comedores</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>Recámaras y oficinas</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>Cocinas y baños</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>Techos y plafones</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                        <SprayCan className="h-6 w-6 text-accent" />
                      </div>
                      <h4 className="text-xl font-semibold text-foreground">Pintura Exterior</h4>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      Protección y embellecimiento de fachadas con pinturas especiales para exteriores resistentes a la
                      intemperie, rayos UV y humedad. Incluye limpieza profunda, reparación de superficies,
                      impermeabilización y aplicación de acabados duraderos que mantienen su color por años.
                    </p>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>Fachadas y muros exteriores</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>Bardas y cercos</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>Impermeabilización de azoteas</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>Estructuras metálicas</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                        <Palette className="h-6 w-6 text-accent" />
                      </div>
                      <h4 className="text-xl font-semibold text-foreground">Acabados Decorativos</h4>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      Técnicas especiales para crear efectos únicos y personalizar espacios. Incluye texturas,
                      esgrafiado, estuco, pintura a mano alzada, murales decorativos y acabados metalizados. Asesoría en
                      selección de colores y diseño para lograr la atmósfera deseada.
                    </p>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>Texturas y relieves</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>Murales artísticos</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>Acabados metalizados</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>Asesoría de color</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-foreground">Tipos de Pintura</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <Card className="border-border">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-foreground mb-2">Interiores</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Vinílica lavable</li>
                        <li>• Acrílica premium</li>
                        <li>• Esmalte mate/brillante</li>
                        <li>• Ecológica sin VOC</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-foreground mb-2">Exteriores</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Acrílica exterior</li>
                        <li>• Elastomérica</li>
                        <li>• Impermeabilizante</li>
                        <li>• Anti-moho y algas</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-foreground mb-2">Especialidades</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Esmalte para metal</li>
                        <li>• Barniz para madera</li>
                        <li>• Pintura epóxica</li>
                        <li>• Acabados decorativos</li>
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
                    <h3 className="text-lg font-semibold text-foreground">¿Quiere renovar con pintura?</h3>
                    <p className="text-sm text-muted-foreground">
                      Contáctenos para asesoría de color y cotización gratuita.
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
