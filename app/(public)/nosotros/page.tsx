import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Target, Award, Heart, CheckCircle, ArrowRight, MapPin } from "lucide-react"
import Link from "next/link"

export default function NosotrosPage() {
  return (
    <main className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <div className="flex items-center justify-center gap-3">
              <Users className="h-10 w-10" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">Sobre Nosotros</h1>
            <p className="text-lg text-primary-foreground/90 leading-relaxed text-pretty">
              Más de 15 años construyendo sueños y superando expectativas con compromiso, calidad y profesionalismo.
            </p>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-foreground text-center">Nuestra Historia</h2>
              <p className="text-muted-foreground leading-relaxed text-center">
                EMPRENOR CONSTRUCCIONES nació en 2009 con una visión clara: ofrecer servicios de construcción de la más
                alta calidad con un enfoque en la satisfacción del cliente y la excelencia operativa.
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
                    Ser la empresa de construcción líder reconocida por nuestra innovación, calidad y compromiso con la
                    satisfacción del cliente, expandiendo nuestros servicios y manteniéndonos a la vanguardia de las
                    mejores prácticas de la industria.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
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

      {/* Team Section */}
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
                    <p className="text-sm text-muted-foreground">Civiles y Arquitectos Certificados</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="p-6 text-center space-y-3">
                  <div className="mx-auto h-24 w-24 rounded-full bg-accent/10 flex items-center justify-center">
                    <Users className="h-12 w-12 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Maestros de Obra</h3>
                    <p className="text-sm text-muted-foreground">Expertos con 15+ años</p>
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
                    <p className="text-sm text-muted-foreground">Electricistas y Plomeros</p>
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
                    <p className="text-sm text-muted-foreground">Albañiles y Pintores</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Services Coverage Section */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <MapPin className="h-8 w-8 text-accent" />
              </div>
              <h2 className="text-3xl font-bold text-foreground">Cobertura de Servicios</h2>
              <p className="text-muted-foreground leading-relaxed text-pretty">
                Atendemos a toda la región del norte argentino con tres oficinas estratégicamente ubicadas.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-accent border-2">
                <CardContent className="p-6 space-y-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-accent">
                    <MapPin className="h-7 w-7 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Salta Capital</h3>
                    <p className="text-sm text-muted-foreground">
                      Ituzaingó 920
                      <br />
                      Salta Capital, Salta
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-accent border-2">
                <CardContent className="p-6 space-y-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-accent">
                    <MapPin className="h-7 w-7 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Tartagal</h3>
                    <p className="text-sm text-muted-foreground">
                      Ituzaingó 1279
                      <br />
                      Tartagal, Salta
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-accent border-2">
                <CardContent className="p-6 space-y-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-accent">
                    <MapPin className="h-7 w-7 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Campamento Vespucio</h3>
                    <p className="text-sm text-muted-foreground">
                      Av. Casiano Casas S/N
                      <br />
                      Barrio Policial, Salta
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-accent border-2 bg-accent/5">
              <CardContent className="p-8 space-y-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-accent mx-auto">
                  <MapPin className="h-7 w-7 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2 text-center">Provincias que Atendemos</h3>
                  <ul className="grid grid-cols-2 gap-3 text-sm text-muted-foreground max-w-md mx-auto">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                      <span>Salta - Cobertura completa</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                      <span>Jujuy - Todas las localidades</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                      <span>Tucumán - Servicio completo</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                      <span>Formosa - Toda la provincia</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-muted/30">
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Con presencia en <span className="font-semibold text-foreground">4 provincias</span> y{" "}
                  <span className="font-semibold text-foreground">3 oficinas</span>, EMPRENOR está cerca de usted para
                  brindarle el mejor servicio de construcción del norte argentino.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <Card className="border-accent bg-accent/5">
            <CardContent className="p-8 md:p-12">
              <div className="mx-auto max-w-2xl text-center space-y-6">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
                  ¿Listo para trabajar con nosotros?
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed text-pretty">
                  Únase a cientos de clientes satisfechos que han confiado en EMPRENOR para sus proyectos de
                  construcción en Salta, Jujuy, Tucumán y Formosa.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <Link href="/contacto">
                      Contactar Ahora
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="/proyectos">Ver Proyectos</Link>
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
