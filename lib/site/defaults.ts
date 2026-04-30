import type { SitePageHeroSlide } from "@/lib/db/models"
import type { SitePageSlug } from "./constants"

export const SITE_DEFAULT_HERO: Record<SitePageSlug, SitePageHeroSlide[]> = {
  home: [
    {
      id: "home-default-1",
      image: "/construction-site-workers-blueprint.jpg",
      alt: "Equipo de construcción EMPRENOR trabajando",
      badgeText: "Más de 15 años construyendo confianza",
      title: "Construimos tus sueños con excelencia y profesionalismo",
      titleAccent: "sueños",
      subtitle:
        "Somos líderes en construcción y servicios en el NOA. Ofrecemos soluciones integrales en construcción, remodelación, electricidad, plomería y más. Cobertura en Salta, Jujuy, Tucumán y Formosa.",
      primaryCtaLabel: "Solicitar Cotización",
      primaryCtaHref: "/contacto",
      secondaryCtaLabel: "Ver Proyectos",
      secondaryCtaHref: "/proyectos",
    },
    {
      id: "home-default-2",
      image: "/industrial-plant-construction.jpg",
      alt: "Obra industrial EMPRENOR",
      badgeText: "Obras de gran envergadura",
      title: "Infraestructura industrial con estándares de excelencia",
      titleAccent: "excelencia",
      subtitle:
        "Plantas, depósitos y naves con planificación integral, seguridad y cumplimiento de normativa en todo el NOA.",
      primaryCtaLabel: "Solicitar Cotización",
      primaryCtaHref: "/contacto",
      secondaryCtaLabel: "Ver servicios",
      secondaryCtaHref: "/servicios",
    },
  ],
  nosotros: [
    {
      id: "nosotros-default-1",
      image: "",
      alt: "",
      title: "Sobre Nosotros",
      subtitle:
        "Más de 15 años construyendo sueños y superando expectativas con compromiso, calidad y profesionalismo.",
    },
  ],
  contacto: [
    {
      id: "contacto-default-1",
      image: "",
      alt: "",
      title: "Contáctenos",
      subtitle:
        "Estamos aquí para ayudarle a hacer realidad su proyecto. Contáctenos hoy para una consulta gratuita.",
    },
  ],
}
