import type { SitePageHeroSlide } from "@/lib/db/models"
import type { SitePageSlug } from "./constants"

export const SITE_DEFAULT_HERO: Record<SitePageSlug, SitePageHeroSlide[]> = {
  home: [
    {
      id: "home-default-1",
      image: "/construction-site-workers-blueprint.jpg",
      alt: "Equipo de construcción EMPRENOR trabajando",
      badgeText: "Desde 2018 en el NOA",
      title: "Construimos con planificación, calidad y cumplimiento",
      titleAccent: "calidad",
      subtitle:
        "EMPRENOR C&S — construcción e instalaciones integradas en el NOA. Doce especialidades, un solo interlocutor. Cobertura en Salta, Jujuy, Tucumán y Formosa.",
      primaryCtaLabel: "Solicitar Cotización",
      primaryCtaHref: "/contacto#formulario",
      secondaryCtaLabel: "Ver Proyectos",
      secondaryCtaHref: "/proyectos",
    },
    {
      id: "home-default-2",
      image: "/industrial-plant-construction.jpg",
      alt: "Obra industrial EMPRENOR",
      badgeText: "Obras de gran envergadura",
      title: "Infraestructura industrial con gestión documentada",
      titleAccent: "documentada",
      subtitle:
        "Naves, plantas y obra institucional con cronograma, SST y entregables según contrato — NOA.",
      primaryCtaLabel: "Solicitar Cotización",
      primaryCtaHref: "/contacto#formulario",
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
        "Desde 2018 acompañamos proyectos en el NOA con planificación, calidad y cumplimiento.",
    },
  ],
  contacto: [
    {
      id: "contacto-default-1",
      image: "",
      alt: "",
      title: "Contacto",
      subtitle:
        "Estamos para ayudarte a concretar tu proyecto. Escribinos hoy para una consulta gratuita.",
    },
  ],
}
