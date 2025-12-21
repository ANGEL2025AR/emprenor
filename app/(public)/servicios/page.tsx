import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Building2,
  Hammer,
  Lightbulb,
  Droplets,
  Paintbrush,
  ArrowRight,
  Home,
  Factory,
  Flame,
  Wrench,
} from "lucide-react"

export const metadata = {
  title: "Servicios - EMPRENOR Construcciones",
  description:
    "Servicios integrales de construcción, remodelación, albañilería, electricidad, plomería, pintura, instalaciones de gas, viviendas prefabricadas y obras industriales en Salta, Jujuy, Tucumán y Formosa.",
}

const services = [
  {
    title: "Construcción",
    description:
      "Construcción de viviendas, edificios comerciales e industriales con los más altos estándares de calidad y cumplimiento de normativas vigentes.",
    icon: Building2,
    href: "/servicios/construccion",
    color: "from-blue-500 to-blue-600",
    features: ["Viviendas unifamiliares", "Edificios comerciales", "Obras públicas", "Estructuras metálicas"],
  },
  {
    title: "Remodelación",
    description:
      "Transformamos espacios existentes en ambientes modernos, funcionales y estéticamente superiores con diseño personalizado.",
    icon: Home,
    href: "/servicios/remodelacion",
    color: "from-purple-500 to-purple-600",
    features: ["Remodelación integral", "Ampliaciones", "Refacciones", "Diseño de interiores"],
  },
  {
    title: "Albañilería",
    description:
      "Trabajos de albañilería profesional con maestros certificados para todo tipo de proyectos residenciales y comerciales.",
    icon: Hammer,
    href: "/servicios/albanileria",
    color: "from-orange-500 to-orange-600",
    features: ["Mampostería", "Revoques", "Contrapisos", "Estructuras"],
  },
  {
    title: "Electricidad",
    description:
      "Instalaciones eléctricas seguras, eficientes y certificadas para hogares y empresas con garantía de cumplimiento normativo.",
    icon: Lightbulb,
    href: "/servicios/electricidad",
    color: "from-yellow-500 to-yellow-600",
    features: ["Instalaciones nuevas", "Tableros eléctricos", "Iluminación", "Sistemas trifásicos"],
  },
  {
    title: "Plomería",
    description:
      "Servicios de plomería completos, desde instalaciones sanitarias nuevas hasta reparaciones y mantenimiento preventivo.",
    icon: Droplets,
    href: "/servicios/plomeria",
    color: "from-cyan-500 to-cyan-600",
    features: ["Instalaciones sanitarias", "Desagües cloacales", "Agua caliente", "Reparaciones"],
  },
  {
    title: "Pintura",
    description:
      "Acabados profesionales de pintura interior y exterior con materiales premium y técnicas especializadas de aplicación.",
    icon: Paintbrush,
    href: "/servicios/pintura",
    color: "from-pink-500 to-pink-600",
    features: ["Pintura interior", "Pintura exterior", "Revestimientos", "Texturas decorativas"],
  },
  {
    title: "Viviendas Prefabricadas",
    description:
      "Soluciones habitacionales modernas, rápidas y de alta calidad con sistemas constructivos innovadores y sustentables.",
    icon: Home,
    href: "/servicios/viviendas-prefabricadas",
    color: "from-teal-500 to-teal-600",
    features: ["Steel framing", "Diseño personalizado", "Montaje rápido", "Eficiencia energética"],
  },
  {
    title: "Obras Industriales",
    description:
      "Proyectos industriales de gran escala con tecnología avanzada, gestión integral y cumplimiento de estándares internacionales.",
    icon: Factory,
    href: "/servicios/obras-industriales",
    color: "from-slate-500 to-slate-600",
    features: ["Plantas industriales", "Galpones", "Naves logísticas", "Infraestructura"],
  },
  {
    title: "Instalaciones de Gas",
    description:
      "Instalaciones de gas natural seguras y certificadas realizadas por profesionales matriculados y con garantía total.",
    icon: Flame,
    href: "/servicios/gas",
    color: "from-red-500 to-red-600",
    features: ["Gas natural", "Gas envasado", "Calderas", "Certificaciones"],
  },
]

export default function ServiciosPage() {
  return (
    <main className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-4xl text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium mb-4">
              <Wrench className="w-4 h-4" />
              Más de 15 años construyendo con excelencia
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-balance">
              Servicios Integrales de{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                Construcción
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed text-pretty">
              Ofrecemos soluciones completas en construcción, remodelación y servicios especializados para todo tipo de
              proyectos en Salta, Jujuy, Tucumán y Formosa. Calidad garantizada y profesionalismo en cada obra.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8"
                asChild
              >
                <Link href="/contacto">
                  Solicitar Cotización
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                asChild
              >
                <Link href="/proyectos">Ver Proyectos Realizados</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 md:py-32 bg-slate-50">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Nuestros Servicios Especializados</h2>
            <p className="text-lg text-slate-600">
              Contamos con equipos profesionales certificados y años de experiencia en cada especialidad. Calidad,
              seguridad y cumplimiento normativo garantizados.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white overflow-hidden"
              >
                <CardContent className="p-8">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                  >
                    <service.icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-semibold text-slate-900 mb-3">{service.title}</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">{service.description}</p>

                  <div className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <Link
                    href={service.href}
                    className="inline-flex items-center text-green-600 font-semibold hover:text-green-700 transition-colors group"
                  >
                    Ver detalles completos
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-900">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">500+</div>
              <div className="text-slate-400">Proyectos Completados</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">15+</div>
              <div className="text-slate-400">Años de Experiencia</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">50+</div>
              <div className="text-slate-400">Profesionales Certificados</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">98%</div>
              <div className="text-slate-400">Clientes Satisfechos</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center text-white space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-balance">
              ¿Listo para iniciar tu proyecto de construcción?
            </h2>
            <p className="text-xl text-green-100 leading-relaxed text-pretty">
              Contáctanos hoy mismo para una consulta gratuita. Nuestro equipo de expertos está listo para convertir tu
              visión en realidad con profesionalismo y garantía de calidad.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-white text-green-600 hover:bg-green-50 px-8" asChild>
                <Link href="/contacto">
                  Solicitar Cotización Gratuita
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 bg-transparent"
                asChild
              >
                <Link href="/nosotros">Conocer Más Sobre Nosotros</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
