import Image from "next/image"
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
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Users,
  Award,
  Target,
  Home,
  Factory,
  Flame,
  Star,
  Wrench,
} from "lucide-react"

const services = [
  {
    title: "Construcción",
    description: "Construcción de viviendas, edificios comerciales e industriales con los más altos estándares.",
    icon: Building2,
    href: "/servicios/construccion",
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "Remodelación",
    description: "Transformamos espacios existentes en ambientes modernos y funcionales.",
    icon: Home,
    href: "/servicios/remodelacion",
    color: "from-purple-500 to-purple-600",
  },
  {
    title: "Albañilería",
    description: "Trabajos de albañilería profesional para todo tipo de proyectos.",
    icon: Hammer,
    href: "/servicios/albanileria",
    color: "from-orange-500 to-orange-600",
  },
  {
    title: "Electricidad",
    description: "Instalaciones eléctricas seguras y eficientes para hogares y empresas.",
    icon: Lightbulb,
    href: "/servicios/electricidad",
    color: "from-yellow-500 to-yellow-600",
  },
  {
    title: "Plomería",
    description: "Servicios de plomería completos, desde instalaciones hasta reparaciones.",
    icon: Droplets,
    href: "/servicios/plomeria",
    color: "from-cyan-500 to-cyan-600",
  },
  {
    title: "Pintura",
    description: "Acabados profesionales de pintura interior y exterior.",
    icon: Paintbrush,
    href: "/servicios/pintura",
    color: "from-pink-500 to-pink-600",
  },
  {
    title: "Viviendas Prefabricadas",
    description: "Soluciones habitacionales modernas, rápidas y de alta calidad.",
    icon: Home,
    href: "/servicios/viviendas-prefabricadas",
    color: "from-teal-500 to-teal-600",
  },
  {
    title: "Obras Industriales",
    description: "Proyectos industriales de gran escala con tecnología avanzada.",
    icon: Factory,
    href: "/servicios/obras-industriales",
    color: "from-slate-500 to-slate-600",
  },
  {
    title: "Instalaciones de Gas",
    description: "Instalaciones de gas seguras y certificadas por profesionales matriculados.",
    icon: Flame,
    href: "/servicios/gas",
    color: "from-red-500 to-red-600",
  },
]

const stats = [
  { number: "500+", label: "Proyectos Completados", icon: CheckCircle },
  { number: "15+", label: "Años de Experiencia", icon: Clock },
  { number: "50+", label: "Profesionales", icon: Users },
  { number: "98%", label: "Clientes Satisfechos", icon: Award },
]

const features = [
  {
    title: "Calidad Garantizada",
    description: "Utilizamos los mejores materiales y técnicas de construcción para garantizar resultados duraderos.",
    icon: Award,
  },
  {
    title: "Equipo Profesional",
    description: "Contamos con un equipo de profesionales altamente capacitados y con amplia experiencia.",
    icon: Users,
  },
  {
    title: "Cumplimiento de Plazos",
    description: "Nos comprometemos con los tiempos de entrega establecidos en cada proyecto.",
    icon: Clock,
  },
  {
    title: "Presupuestos Claros",
    description: "Ofrecemos presupuestos detallados y transparentes, sin costos ocultos.",
    icon: Target,
  },
]

const testimonials = [
  {
    name: "Carlos Mendoza",
    role: "Propietario",
    content:
      "EMPRENOR construyó nuestra casa de ensueño. El equipo fue profesional, cumplió con los plazos y el resultado superó nuestras expectativas.",
    rating: 5,
  },
  {
    name: "María García",
    role: "Empresaria",
    content:
      "Excelente trabajo en la remodelación de nuestras oficinas. Muy satisfechos con la calidad y el trato recibido.",
    rating: 5,
  },
  {
    name: "Roberto Sánchez",
    role: "Director de Operaciones",
    content:
      "Profesionales de primera. Realizaron las instalaciones eléctricas de nuestra planta industrial sin contratiempos.",
    rating: 5,
  },
]

const projects = [
  {
    title: "Residencia Familiar",
    location: "Salta Capital",
    category: "Construcción",
    image: "/modern-residential-house-construction.jpg",
  },
  {
    title: "Centro Comercial",
    location: "San Salvador de Jujuy",
    category: "Obra Civil",
    image: "/modern-office-building-construction.jpg",
  },
  {
    title: "Planta Industrial",
    location: "Tartagal",
    category: "Industrial",
    image: "/industrial-warehouse-construction.png",
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/construction-site-workers-blueprint.jpg"
          alt="Equipo de construcción EMPRENOR trabajando"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/50" />

        <div className="container relative z-10 px-4 py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium mb-6">
              <Wrench className="w-4 h-4" />
              Más de 15 años construyendo confianza
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Construimos tus{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                sueños
              </span>{" "}
              con excelencia y profesionalismo
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed">
              Somos líderes en construcción y servicios en el NOA. Ofrecemos soluciones integrales en construcción,
              remodelación, electricidad, plomería y más. Cobertura en Salta, Jujuy, Tucumán y Formosa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-6 text-lg"
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
                className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg bg-transparent"
                asChild
              >
                <Link href="/proyectos">Ver Proyectos</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-900">
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-8 h-8 text-green-500 mx-auto mb-4" />
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-slate-50" id="servicios">
        <div className="container px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Nuestros Servicios</h2>
            <p className="text-lg text-slate-600">
              Ofrecemos una amplia gama de servicios de construcción y mantenimiento para satisfacer todas tus
              necesidades.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-0 bg-white overflow-hidden"
              >
                <CardContent className="p-6">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <service.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{service.title}</h3>
                  <p className="text-slate-600 mb-4">{service.description}</p>
                  <Link
                    href={service.href}
                    className="inline-flex items-center text-green-600 font-medium hover:text-green-700 transition-colors"
                  >
                    Ver más
                    <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                ¿Por qué elegir <span className="text-green-600">EMPRENOR</span>?
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Con más de 15 años de experiencia en el mercado de la construcción del NOA, nos hemos consolidado como
                una empresa líder gracias a nuestro compromiso con la calidad y la satisfacción del cliente.
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">{feature.title}</h3>
                      <p className="text-sm text-slate-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl shadow-2xl overflow-hidden aspect-[4/3]">
                <Image
                  src="/professional-construction-team-working.jpg"
                  alt="Equipo profesional de EMPRENOR"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">15+ años</div>
                    <div className="text-slate-600">de experiencia</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-900">
        <div className="container px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Proyectos Destacados</h2>
            <p className="text-lg text-slate-400">
              Conoce algunos de nuestros proyectos más representativos en la región del NOA.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div key={index} className="group relative overflow-hidden rounded-2xl">
                <div className="relative w-full h-72">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="inline-block px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full mb-3">
                    {project.category}
                  </span>
                  <h3 className="text-xl font-semibold text-white mb-1">{project.title}</h3>
                  <p className="text-slate-400 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {project.location}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 bg-transparent"
              asChild
            >
              <Link href="/proyectos">
                Ver todos los proyectos
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-slate-50">
        <div className="container px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Lo que dicen nuestros clientes</h2>
            <p className="text-lg text-slate-600">La satisfacción de nuestros clientes es nuestra mayor recompensa.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-slate-600 mb-6 italic">{`"${testimonial.content}"`}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-semibold">
                      {testimonial.name && testimonial.name.length > 0 ? testimonial.name.charAt(0) : "U"}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{testimonial.name}</div>
                      <div className="text-sm text-slate-500">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">¿Listo para comenzar tu proyecto?</h2>
            <p className="text-xl text-green-100 mb-8">
              Contáctanos hoy mismo y obtén una cotización gratuita. Nuestro equipo está listo para ayudarte a hacer
              realidad tu proyecto.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-green-600 hover:bg-green-50 px-8 py-6 text-lg" asChild>
                <Link href="/contacto">
                  Solicitar Cotización
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg bg-transparent"
                asChild
              >
                <Link href="tel:+5491127586521">
                  <Phone className="mr-2 w-5 h-5" />
                  Llamar Ahora
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-16 bg-slate-900">
        <div className="container px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Phone className="w-7 h-7 text-green-500" />
              </div>
              <div>
                <div className="text-sm text-slate-400 mb-1">Llámanos</div>
                <a
                  href="tel:+5491127586521"
                  className="text-lg font-semibold text-white hover:text-green-400 transition-colors"
                >
                  +54 9 11 2758-6521
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Mail className="w-7 h-7 text-green-500" />
              </div>
              <div>
                <div className="text-sm text-slate-400 mb-1">Escríbenos</div>
                <a
                  href="mailto:info@emprenor.com"
                  className="text-lg font-semibold text-white hover:text-green-400 transition-colors"
                >
                  info@emprenor.com
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center">
                <MapPin className="w-7 h-7 text-green-500" />
              </div>
              <div>
                <div className="text-sm text-slate-400 mb-1">Ubicación</div>
                <span className="text-lg font-semibold text-white">Salta, Argentina</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
