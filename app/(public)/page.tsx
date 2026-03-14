"use client"

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
  Play,
  ArrowUpRight,
  Shield,
  Sparkles,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"

const services = [
  {
    title: "Construccion",
    description: "Proyectos residenciales, comerciales e industriales con los mas altos estandares de calidad.",
    icon: Building2,
    href: "/servicios/construccion",
  },
  {
    title: "Remodelacion",
    description: "Transformamos espacios existentes en ambientes modernos y funcionales.",
    icon: Home,
    href: "/servicios/remodelacion",
  },
  {
    title: "Albanileria",
    description: "Trabajos de albanileria profesional para todo tipo de proyectos.",
    icon: Hammer,
    href: "/servicios/albanileria",
  },
  {
    title: "Electricidad",
    description: "Instalaciones electricas seguras y eficientes para hogares y empresas.",
    icon: Lightbulb,
    href: "/servicios/electricidad",
  },
  {
    title: "Plomeria",
    description: "Servicios de plomeria completos, desde instalaciones hasta reparaciones.",
    icon: Droplets,
    href: "/servicios/plomeria",
  },
  {
    title: "Pintura",
    description: "Acabados profesionales de pintura interior y exterior.",
    icon: Paintbrush,
    href: "/servicios/pintura",
  },
  {
    title: "Viviendas Prefabricadas",
    description: "Soluciones habitacionales modernas, rapidas y de alta calidad.",
    icon: Home,
    href: "/servicios/viviendas-prefabricadas",
  },
  {
    title: "Obras Industriales",
    description: "Proyectos industriales de gran escala con tecnologia avanzada.",
    icon: Factory,
    href: "/servicios/obras-industriales",
  },
  {
    title: "Instalaciones de Gas",
    description: "Instalaciones de gas seguras y certificadas por profesionales matriculados.",
    icon: Flame,
    href: "/servicios/gas",
  },
]

const stats = [
  { number: "500+", label: "Proyectos Completados" },
  { number: "15+", label: "Anos de Experiencia" },
  { number: "50+", label: "Profesionales" },
  { number: "98%", label: "Clientes Satisfechos" },
]

const features = [
  {
    title: "Calidad Garantizada",
    description: "Utilizamos los mejores materiales y tecnicas de construccion.",
    icon: Award,
  },
  {
    title: "Equipo Profesional",
    description: "Profesionales altamente capacitados y con amplia experiencia.",
    icon: Users,
  },
  {
    title: "Cumplimiento de Plazos",
    description: "Nos comprometemos con los tiempos de entrega establecidos.",
    icon: Clock,
  },
  {
    title: "Presupuestos Claros",
    description: "Presupuestos detallados y transparentes, sin costos ocultos.",
    icon: Target,
  },
]

const testimonials = [
  {
    name: "Carlos Mendoza",
    role: "Propietario",
    content:
      "EMPRENOR construyo nuestra casa de ensueno. El equipo fue profesional, cumplio con los plazos y el resultado supero nuestras expectativas.",
    rating: 5,
    image: "/images/team-professional.jpg",
  },
  {
    name: "Maria Garcia",
    role: "Empresaria",
    content:
      "Excelente trabajo en la remodelacion de nuestras oficinas. Muy satisfechos con la calidad y el trato recibido.",
    rating: 5,
    image: "/images/modern-building.jpg",
  },
  {
    name: "Roberto Sanchez",
    role: "Director de Operaciones",
    content:
      "Profesionales de primera. Realizaron las instalaciones electricas de nuestra planta industrial sin contratiempos.",
    rating: 5,
    image: "/images/industrial-project.jpg",
  },
]

const marqueeItems = [
  "CONSTRUCCION",
  "REMODELACION",
  "ALBANILERIA",
  "ELECTRICIDAD",
  "PLOMERIA",
  "PINTURA",
  "GAS",
  "OBRAS INDUSTRIALES",
]

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return { ref, isInView }
}

function AnimatedCounter({ target, duration = 2000 }: { target: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const { ref, isInView } = useInView()
  const numericValue = parseInt(target.replace(/\D/g, ""))
  const suffix = target.replace(/\d/g, "")

  useEffect(() => {
    if (!isInView) return

    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      setCount(Math.floor(progress * numericValue))
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }, [isInView, numericValue, duration])

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  )
}

export default function HomePage() {
  const heroRef = useInView()
  const servicesRef = useInView()
  const whyUsRef = useInView()
  const testimonialsRef = useInView()

  return (
    <div className="flex flex-col overflow-x-hidden">
      {/* Hero Section - Premium Design */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-foreground">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero-construction.jpg"
            alt="Equipo de construccion EMPRENOR trabajando en proyecto"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-foreground/95 via-foreground/80 to-foreground/60" />
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float animation-delay-300" />

        {/* Main Content */}
        <div
          ref={heroRef.ref}
          className={`container relative z-10 px-4 py-20 lg:py-32 ${heroRef.isInView ? "animate-fade-up" : "opacity-0"}`}
        >
          <div className="max-w-5xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-8">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Mas de 15 anos construyendo confianza en el NOA</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-background leading-tight mb-6">
              <span className="block">Construimos tus</span>
              <span className="gradient-text">suenos</span>
              <span className="block text-background/90">con excelencia</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-background/70 mb-10 max-w-2xl leading-relaxed">
              Lideres en construccion y servicios integrales en el NOA. Soluciones completas en construccion,
              remodelacion, electricidad, plomeria y mas. Cobertura en Salta, Jujuy, Tucuman y Formosa.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-xl hover-lift animate-pulse-glow"
                asChild
              >
                <Link href="/contacto">
                  Solicitar Cotizacion Gratis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-background/30 text-background hover:bg-background/10 px-8 py-6 text-lg rounded-xl bg-transparent hover-lift"
                asChild
              >
                <Link href="/proyectos" className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Ver Proyectos
                </Link>
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`text-center ${heroRef.isInView ? "animate-fade-up" : "opacity-0"}`}
                  style={{ animationDelay: `${200 + index * 100}ms` }}
                >
                  <div className="text-3xl md:text-4xl font-bold text-background mb-1">
                    <AnimatedCounter target={stat.number} />
                  </div>
                  <div className="text-sm text-background/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 rounded-full border-2 border-background/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-primary rounded-full" />
          </div>
        </div>
      </section>

      {/* Marquee Section */}
      <section className="py-6 bg-primary overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems].map((item, index) => (
            <span key={index} className="mx-8 text-lg font-medium text-primary-foreground/90 flex items-center gap-2">
              <span className="w-2 h-2 bg-primary-foreground/50 rounded-full" />
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* Services Section - Bento Grid Style */}
      <section className="py-24 bg-background" id="servicios">
        <div className="container px-4">
          <div
            ref={servicesRef.ref}
            className={`text-center max-w-3xl mx-auto mb-16 ${servicesRef.isInView ? "animate-fade-up" : "opacity-0"}`}
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Nuestros Servicios</span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-4 mb-6 text-balance">
              Soluciones integrales para tu proyecto
            </h2>
            <p className="text-lg text-muted-foreground">
              Ofrecemos una amplia gama de servicios de construccion y mantenimiento para satisfacer todas tus
              necesidades.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service, index) => (
              <Link
                key={index}
                href={service.href}
                className={`group relative p-6 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all duration-300 hover-lift ${
                  servicesRef.isInView ? "animate-fade-up" : "opacity-0"
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                    <service.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="rounded-xl hover-lift" asChild>
              <Link href="/servicios">
                Ver todos los servicios
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-muted/50">
        <div className="container px-4">
          <div
            ref={whyUsRef.ref}
            className={`grid lg:grid-cols-2 gap-16 items-center ${whyUsRef.isInView ? "animate-fade-up" : "opacity-0"}`}
          >
            {/* Left Content */}
            <div>
              <span className="text-primary font-medium text-sm uppercase tracking-wider">Por que elegirnos</span>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-4 mb-6 text-balance">
                Experiencia que construye{" "}
                <span className="gradient-text">confianza</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                Con mas de 15 anos de experiencia en el mercado de la construccion del NOA, nos hemos consolidado como
                una empresa lider gracias a nuestro compromiso con la calidad y la satisfaccion del cliente.
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={`flex gap-4 ${whyUsRef.isInView ? "animate-slide-in-left" : "opacity-0"}`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                <Button size="lg" className="rounded-xl hover-lift" asChild>
                  <Link href="/nosotros">
                    Conocer mas
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size="lg" className="rounded-xl" asChild>
                  <Link href="tel:+5491127586521">
                    <Phone className="mr-2 w-4 h-4" />
                    Llamar ahora
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Content - Image Stack */}
            <div
              className={`relative ${whyUsRef.isInView ? "animate-slide-in-right" : "opacity-0"}`}
            >
              <div className="relative">
                {/* Main Image */}
                <div className="rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src="/images/team-professional.jpg"
                    alt="Equipo profesional de EMPRENOR"
                    width={600}
                    height={500}
                    className="w-full h-auto object-cover"
                  />
                </div>

                {/* Floating Card */}
                <div className="absolute -bottom-8 -left-8 bg-card p-6 rounded-2xl shadow-xl border border-border">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                      <Shield className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-foreground">15+</div>
                      <div className="text-muted-foreground text-sm">anos de experiencia</div>
                    </div>
                  </div>
                </div>

                {/* Decorative Element */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Placeholder - Will be replaced by server component */}
      <section className="py-24 bg-foreground">
        <div className="container px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Nuestro Portfolio</span>
            <h2 className="text-3xl md:text-5xl font-bold text-background mt-4 mb-6 text-balance">
              Proyectos que hablan por si mismos
            </h2>
            <p className="text-lg text-background/70">
              Conoce algunos de nuestros proyectos mas representativos en la region del NOA.
            </p>
          </div>

          {/* Project Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Edificio Residencial", location: "Salta Capital", image: "/images/modern-building.jpg" },
              { title: "Planta Industrial", location: "Tartagal", image: "/images/industrial-project.jpg" },
              { title: "Centro Comercial", location: "San Salvador de Jujuy", image: "/images/hero-construction.jpg" },
            ].map((project, index) => (
              <Link
                key={index}
                href="/proyectos"
                className="group relative overflow-hidden rounded-2xl aspect-[4/3] hover-lift"
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-sm rounded-full mb-3">
                    Proyecto Completado
                  </span>
                  <h3 className="text-xl font-semibold text-background mb-1 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-background/70 flex items-center gap-1 text-sm">
                    <MapPin className="w-4 h-4" />
                    {project.location}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              variant="outline"
              className="border-background/30 text-background hover:bg-background/10 rounded-xl bg-transparent hover-lift"
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
      <section className="py-24 bg-background">
        <div className="container px-4">
          <div
            ref={testimonialsRef.ref}
            className={`text-center max-w-3xl mx-auto mb-16 ${testimonialsRef.isInView ? "animate-fade-up" : "opacity-0"}`}
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Testimonios</span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-4 mb-6 text-balance">
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-lg text-muted-foreground">
              La satisfaccion de nuestros clientes es nuestra mayor recompensa.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className={`border-border hover:border-primary/30 transition-all duration-300 hover-lift ${
                  testimonialsRef.isInView ? "animate-fade-up" : "opacity-0"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-muted-foreground mb-6 leading-relaxed">{`"${testimonial.content}"`}</p>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                      {testimonial.name && testimonial.name.length > 0 ? testimonial.name.charAt(0) : "U"}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-background/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-background/5 rounded-full blur-3xl" />

        <div className="container px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-6 text-balance">
              Listo para comenzar tu proyecto?
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
              Contactanos hoy mismo y obtene una cotizacion gratuita. Nuestro equipo esta listo para ayudarte a hacer
              realidad tu proyecto.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-background text-foreground hover:bg-background/90 px-8 py-6 text-lg rounded-xl hover-lift"
                asChild
              >
                <Link href="/contacto">
                  Solicitar Cotizacion
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 px-8 py-6 text-lg rounded-xl bg-transparent hover-lift"
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
      <section className="py-16 bg-foreground">
        <div className="container px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Phone,
                label: "Llamanos",
                value: "+54 9 11 2758-6521",
                href: "tel:+5491127586521",
              },
              {
                icon: Mail,
                label: "Escribinos",
                value: "info@emprenor.com",
                href: "mailto:info@emprenor.com",
              },
              {
                icon: MapPin,
                label: "Ubicacion",
                value: "Salta, Argentina",
                href: null,
              },
            ].map((contact, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <contact.icon className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-background/60 mb-1">{contact.label}</div>
                  {contact.href ? (
                    <a
                      href={contact.href}
                      className="text-lg font-semibold text-background hover:text-primary transition-colors"
                    >
                      {contact.value}
                    </a>
                  ) : (
                    <span className="text-lg font-semibold text-background">{contact.value}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
