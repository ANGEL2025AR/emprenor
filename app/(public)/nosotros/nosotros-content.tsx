import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Target, Award, Heart, CheckCircle, ArrowRight, MapPin } from "lucide-react"
import { PublicHeroSection } from "@/components/home/public-hero-section"
import { contactFormUrl } from "@/lib/site/urls"
import {
  EMPRENOR_BRAND,
  EMPRENOR_LEGAL,
  EMPRENOR_OFICINAS,
  EMPRENOR_PROVINCIAS,
  EMPRENOR_TITULAR,
  EMPRENOR_TIPOS_OBRA,
} from "@/lib/company/constants"

export default function NosotrosPage() {
  return (
    <main className="flex flex-col">
      <PublicHeroSection slug="nosotros" variant="simple" />

      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-foreground text-center">Nuestra Historia</h2>
              <p className="text-muted-foreground leading-relaxed text-center">
                {EMPRENOR_BRAND.nombreExtendido} es la marca comercial de {EMPRENOR_TITULAR.nombreCompleto}. Desde{" "}
                {EMPRENOR_LEGAL.operacionDesde} desarrollamos proyectos de construcción, remodelación e instalaciones
                en el NOA con planificación, calidad y cumplimiento documentado.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <Card className="border-border">
                <CardContent className="p-6 space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                    <Target className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Misión</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Proporcionar servicios de construcción y remodelación de la más alta calidad, cumpliendo con los
                    plazos y presupuestos establecidos, mientras superamos las expectativas de nuestros clientes
                    mediante un trabajo profesional, ético y comprometido con la excelencia.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="p-6 space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                    <Award className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Visión</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Ser un referente en construcción y servicios en el NOA, reconocidos por la calidad de ejecución,
                    transparencia comercial y cumplimiento de lo acordado con cada cliente.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-4xl space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-foreground">Nuestros Valores</h2>
              <p className="text-muted-foreground leading-relaxed text-pretty">
                Los principios que guían cada proyecto y decisión que tomamos.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="border-border">
                <CardContent className="p-6 space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
                    <CheckCircle className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Calidad</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Comprometidos con los más altos estándares en cada proyecto, utilizando materiales de primera y
                    técnicas comprobadas.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="p-6 space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
                    <Heart className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Compromiso</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Dedicación total a cada proyecto, tratándolo como si fuera propio y asegurando la satisfacción del
                    cliente.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="p-6 space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
                    <Users className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Profesionalismo</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Equipo altamente capacitado y certificado que actúa con ética, respeto y transparencia en todo
                    momento.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="p-6 space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
                    <CheckCircle className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Puntualidad</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Respetamos los plazos acordados, manteniendo comunicación constante y gestionando eficientemente los
                    recursos.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="p-6 space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
                    <Award className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Innovación</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Adoptamos nuevas tecnologías y métodos constructivos para ofrecer soluciones eficientes y
                    sostenibles.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="p-6 space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
                    <Heart className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Seguridad</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Priorizamos la seguridad de nuestro equipo y clientes, cumpliendo rigurosamente con todas las
                    normativas.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-4xl space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-foreground">Nuestro Equipo</h2>
              <p className="text-muted-foreground leading-relaxed text-pretty">
                Profesionales experimentados dedicados a hacer realidad sus proyectos.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="border-border">
                <CardContent className="p-6 text-center space-y-3">
                  <div className="mx-auto h-24 w-24 rounded-full bg-accent/10 flex items-center justify-center">
                    <Users className="h-12 w-12 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Ingenieros</h3>
                    <p className="text-sm text-muted-foreground">Civiles y arquitectos certificados</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="p-6 text-center space-y-3">
                  <div className="mx-auto h-24 w-24 rounded-full bg-accent/10 flex items-center justify-center">
                    <Users className="h-12 w-12 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Maestros de obra</h3>
                    <p className="text-sm text-muted-foreground">Desde {EMPRENOR_LEGAL.operacionDesde} en el NOA</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="p-6 text-center space-y-3">
                  <div className="mx-auto h-24 w-24 rounded-full bg-accent/10 flex items-center justify-center">
                    <Users className="h-12 w-12 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Especialistas</h3>
                    <p className="text-sm text-muted-foreground">Electricistas e instaladores sanitarios</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="p-6 text-center space-y-3">
                  <div className="mx-auto h-24 w-24 rounded-full bg-accent/10 flex items-center justify-center">
                    <Users className="h-12 w-12 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Técnicos</h3>
                    <p className="text-sm text-muted-foreground">Albañiles y pintores</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <MapPin className="h-8 w-8 text-accent" />
              </div>
              <h2 className="text-3xl font-bold text-foreground">Cobertura de Servicios</h2>
              <p className="text-muted-foreground leading-relaxed text-pretty">
                Sede en Campamento Vespucio (Salta) y cobertura operativa en {EMPRENOR_PROVINCIAS.join(", ")}.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-1 max-w-xl mx-auto">
              {EMPRENOR_OFICINAS.map((oficina) => (
                <Card key={oficina.nombre} className="border-accent border-2">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-accent">
                      <MapPin className="h-7 w-7 text-accent-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">{oficina.nombre}</h3>
                      <p className="text-sm text-muted-foreground">{oficina.direccion}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-accent border-2 bg-accent/5">
              <CardContent className="p-8 space-y-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-accent mx-auto">
                  <MapPin className="h-7 w-7 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2 text-center">Provincias que atendemos</h3>
                  <ul className="grid grid-cols-2 gap-3 text-sm text-muted-foreground max-w-md mx-auto">
                    {EMPRENOR_PROVINCIAS.map((provincia) => (
                      <li key={provincia} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>{provincia}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-muted/30">
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Segmentos: {EMPRENOR_TIPOS_OBRA.join(" · ")}.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <Card className="border-accent bg-accent/5">
            <CardContent className="p-8 md:p-12">
              <div className="mx-auto max-w-2xl text-center space-y-6">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
                  ¿Listo para trabajar con nosotros?
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed text-pretty">
                  Contactanos para tu próximo proyecto en {EMPRENOR_PROVINCIAS.join(", ")}.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <Link href={contactFormUrl()}>
                      Contactar ahora
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="/proyectos">Ver proyectos</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
