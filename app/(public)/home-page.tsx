import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { EMPRENOR_HOME_STATS, EMPRENOR_LEGAL, EMPRENOR_MARKETING } from "@/lib/company/constants"
import { SERVICES_CATALOG } from "@/lib/site/services-catalog"
import { contactFormUrl } from "@/lib/site/urls"
import { getServiceIcon } from "@/lib/site/service-icons"
import { Card, CardContent } from "@/components/ui/card"
import {
  Building2,
  ArrowRight,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Users,
  Award,
  Target,
} from "lucide-react"
import FeaturedProjects from "@/components/home/featured-projects"
import { PublicHeroSection } from "@/components/home/public-hero-section"
import { WorksMapSection } from "@/components/home/works-map-section"
import { SectorsSection } from "@/components/home/sectors-section"
import { EmergencyBanner } from "@/components/home/emergency-banner"
import { WorkProcessSection } from "@/components/home/work-process-section"
import { QualitySection } from "@/components/home/quality-section"
import { CoverageSection } from "@/components/home/coverage-section"
import { TrustSection } from "@/components/home/trust-section"

const services = SERVICES_CATALOG.map((service) => ({
  title: service.title,
  description: service.shortDescription,
  icon: getServiceIcon(service.icon as Parameters<typeof getServiceIcon>[0]),
  href: `/servicios/${service.slug}`,
  color: service.colorGradient,
}))

const statIcons = { CheckCircle, Clock, Users, Award } as const

const stats = EMPRENOR_HOME_STATS.map((stat) => ({
  ...stat,
  icon: statIcons[stat.icon],
}))

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

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <PublicHeroSection slug="home" variant="immersive" />

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

      <section className="py-20 bg-slate-50" id="servicios">
        <div className="container px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Nuestros Servicios</h2>
            <p className="text-lg text-slate-600">
              Ofrecemos una amplia gama de servicios de construcción y mantenimiento para satisfacer todas tus necesidades.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white overflow-hidden">
                <CardContent className="p-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <service.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{service.title}</h3>
                  <p className="text-slate-600 mb-4">{service.description}</p>
                  <Link href={service.href} className="inline-flex items-center text-green-600 font-medium hover:text-green-700 transition-colors">
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
                {EMPRENOR_MARKETING.operacionDesdeLabel} acompañamos proyectos en el NOA con planificación, calidad y cumplimiento. Nuestro compromiso es entregar obra clara, segura y dentro del alcance acordado.
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
              <div className="rounded-2xl shadow-2xl overflow-hidden aspect-[4/3] relative">
                <Image
                  src={EMPRENOR_MARKETING.homeTrustImage}
                  alt={EMPRENOR_MARKETING.homeTrustImageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">{EMPRENOR_MARKETING.operacionDesdeLabel}</div>
                    <div className="text-slate-600">en el NOA</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FeaturedProjects />
      <WorksMapSection />
      <SectorsSection />
      <EmergencyBanner />
      <WorkProcessSection />
      <QualitySection />
      <TrustSection />
      <CoverageSection />

      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">¿Listo para comenzar tu proyecto?</h2>
            <p className="text-xl text-green-100 mb-8">
              Contáctanos hoy mismo y obtén una cotización gratuita. Nuestro equipo está listo para ayudarte a hacer realidad tu proyecto.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-green-600 hover:bg-green-50 px-8 py-6 text-lg" asChild>
                <Link href={contactFormUrl()}>
                  Solicitar Cotización
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg bg-transparent" asChild>
                <Link href={`tel:${EMPRENOR_LEGAL.telefonoPrincipalHref}`}>
                  <Phone className="mr-2 w-5 h-5" />
                  Llamar Ahora
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-900">
        <div className="container px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Phone className="w-7 h-7 text-green-500" />
              </div>
              <div>
                <div className="text-sm text-slate-400 mb-1">Llámanos</div>
                <a href={`tel:${EMPRENOR_LEGAL.telefonoPrincipalHref}`} className="text-lg font-semibold text-white hover:text-green-400 transition-colors">
                  {EMPRENOR_LEGAL.telefonoPrincipal}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Mail className="w-7 h-7 text-green-500" />
              </div>
              <div>
                <div className="text-sm text-slate-400 mb-1">Escríbenos</div>
                <a href={`mailto:${EMPRENOR_LEGAL.emailGeneral}`} className="text-lg font-semibold text-white hover:text-green-400 transition-colors">
                  {EMPRENOR_LEGAL.emailGeneral}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center">
                <MapPin className="w-7 h-7 text-green-500" />
              </div>
              <div>
                <div className="text-sm text-slate-400 mb-1">Ubicación</div>
                <span className="text-lg font-semibold text-white">{EMPRENOR_LEGAL.domicilioComercial.split(",")[0]}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
