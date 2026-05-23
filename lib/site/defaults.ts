import type { SitePageHeroSlide } from "@/lib/db/models"
import type { SitePageSlug } from "./constants"

export const SITE_DEFAULT_HERO: Record<SitePageSlug, SitePageHeroSlide[]> = {
  home: [
    {
      id: "home-default-1",
      image: "",
      alt: "EMPRENOR C&S — construcción y servicios en el NOA",
      badgeText: "Desde 2018 en el NOA",
      title: "Construimos con planificación, calidad y cumplimiento",
      titleAccent: "calidad",
      subtitle:
        "EMPRENOR C&S (Construcciones y Servicios). Presencia en Salta, Jujuy, Tucumán y Formosa. Nueve especialidades integradas con presupuesto y alcance por escrito.",
      primaryCtaLabel: "Solicitar Cotización",
      primaryCtaHref: "/contacto",
      secondaryCtaLabel: "Ver Proyectos",
      secondaryCtaHref: "/proyectos",
    },
    {
      id: "home-default-2",
      image: "",
      alt: "Obra industrial EMPRENOR C&S",
      badgeText: "Obras industriales y sector público",
      title: "Infraestructura con gestión documentada",
      titleAccent: "Infraestructura",
      subtitle:
        "Naves, plantas y obra institucional con cronograma, SST y entregables según contrato.",
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
        "EMPRENOR C&S — Construcciones y Servicios. Marca de RM International Group S.A.S. en el NOA.",
    },
  ],
  contacto: [
    {
      id: "contacto-default-1",
      image: "",
      alt: "",
      title: "Contáctenos",
      subtitle:
        "Estamos aquí para ayudarle con su proyecto. Consulta comercial sin compromiso.",
    },
  ],
}
