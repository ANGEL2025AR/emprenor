/**
 * Datos corporativos verificados — marca EMPRENOR C&S.
 * Fuente única: shared/company.constants.json (también usada por emprenorsolutions).
 */

import company from "../../shared/company.constants.json"

export const EMPRENOR_BRAND = company.brand

/** Titular legal de la marca comercial (persona humana). */
export const EMPRENOR_TITULAR = {
  apellidoNombre: company.titular.apellidoNombre,
  nombreCompleto: company.titular.nombreCompleto,
  cuit: company.titular.cuit,
  formaJuridica: company.titular.formaJuridica,
  condicionIva: company.titular.condicionIva,
  domicilioFiscal: company.titular.domicilioFiscal,
  domicilioComercial: company.titular.domicilioComercial,
  operacionDesde: company.titular.operacionDesde,
} as const

/** Teléfono principal de atención comercial (sitio, CTAs, schema.org). */
export const EMPRENOR_TELEFONO_PRINCIPAL = company.telefonoPrincipal

/** Contacto secundario del titular (NOA). */
export const EMPRENOR_TELEFONO_SECUNDARIO = {
  ...company.telefonoSecundario,
  nombre: EMPRENOR_TITULAR.nombreCompleto,
  rol: `Titular · ${EMPRENOR_BRAND.siglas}`,
} as const

export const EMPRENOR_SLOGAN = company.slogan

export const EMPRENOR_PROVINCIAS = company.provincias

export const EMPRENOR_TIPOS_OBRA = company.tiposObra

export const EMPRENOR_MARKETING = {
  homeTrustImage:
    "https://fvm8nkdmuld8gjsy.public.blob.vercel-storage.com/hero/1780546744964-IMG_20250820_232324.jpg",
  homeTrustImageAlt: "Equipo EMPRENOR en obra — Salta, NOA",
  operacionDesdeLabel: company.titular.operacionDesdeLabel,
} as const

/** Indicadores publicados verificables (no métricas inventadas). */
export const EMPRENOR_HOME_STATS = company.homeStats as readonly {
  number: string
  label: string
  icon: "CheckCircle" | "Users" | "Clock" | "Award"
}[]

export const EMPRENOR_FOOTER_TAGLINE = `${EMPRENOR_PROVINCIAS.join(", ")} · ${company.titular.domicilioCalle}`

export const EMPRENOR_SITE = {
  siteName: EMPRENOR_BRAND.siglas,
  titleTemplate: `%s | ${EMPRENOR_BRAND.siglas}`,
  defaultTitle: `${EMPRENOR_BRAND.siglas} — ${EMPRENOR_SLOGAN}`,
  defaultDescription: `${EMPRENOR_BRAND.siglas}, marca comercial de ${EMPRENOR_TITULAR.nombreCompleto}. Construcción, remodelación e instalaciones en ${EMPRENOR_PROVINCIAS.join(", ")}. Obras privadas, comerciales, industriales, corporativas y públicas.`,
  manifestDescription: `${EMPRENOR_BRAND.siglas}. ${EMPRENOR_SLOGAN}. Titular: ${EMPRENOR_TITULAR.nombreCompleto}.`,
  manifestShortName: EMPRENOR_BRAND.siglas,
} as const

export const EMPRENOR_OFICINAS = [
  {
    nombre: "Sede fiscal y comercial",
    direccion: EMPRENOR_TITULAR.domicilioComercial,
    mapsQuery: company.titular.domicilioMapsQuery,
  },
] as const

export const EMPRENOR_CONTACTOS = [
  {
    nombre: EMPRENOR_TELEFONO_PRINCIPAL.nombre,
    rol: EMPRENOR_TELEFONO_PRINCIPAL.rol,
    telefono: EMPRENOR_TELEFONO_PRINCIPAL.telefono,
    telHref: EMPRENOR_TELEFONO_PRINCIPAL.telHref,
  },
  {
    nombre: EMPRENOR_TELEFONO_SECUNDARIO.nombre,
    rol: EMPRENOR_TELEFONO_SECUNDARIO.rol,
    telefono: EMPRENOR_TELEFONO_SECUNDARIO.telefono,
    telHref: EMPRENOR_TELEFONO_SECUNDARIO.telHref,
  },
] as const

export const EMPRENOR_WHATSAPP = [
  {
    name: EMPRENOR_TELEFONO_PRINCIPAL.nombre,
    role: EMPRENOR_TELEFONO_PRINCIPAL.rol,
    number: EMPRENOR_TELEFONO_PRINCIPAL.whatsapp,
    message: "Hola Sebastian, consulto por servicios de construcción EMPRENOR.",
  },
  {
    name: EMPRENOR_TELEFONO_SECUNDARIO.nombre,
    role: EMPRENOR_TELEFONO_SECUNDARIO.rol,
    number: EMPRENOR_TELEFONO_SECUNDARIO.whatsapp,
    message: "Hola, consulto por servicios de construcción EMPRENOR C&S.",
  },
] as const

export const EMPRENOR_LEGAL = {
  titular: EMPRENOR_TITULAR.nombreCompleto,
  titularApellidoNombre: EMPRENOR_TITULAR.apellidoNombre,
  razonSocial: EMPRENOR_TITULAR.apellidoNombre,
  marcaComercial: EMPRENOR_BRAND.siglas,
  marcaNombreCompleto: EMPRENOR_BRAND.nombreExtendido,
  cuit: process.env.NEXT_PUBLIC_EMPRENOR_CUIT?.trim() || EMPRENOR_TITULAR.cuit,
  condicionIva: EMPRENOR_TITULAR.condicionIva,
  formaJuridica: EMPRENOR_TITULAR.formaJuridica,
  domicilioLegal: EMPRENOR_TITULAR.domicilioFiscal,
  domicilioFiscal: EMPRENOR_TITULAR.domicilioFiscal,
  domicilioComercial: EMPRENOR_TITULAR.domicilioComercial,
  oficinasOperativas: EMPRENOR_OFICINAS,
  emailGeneral: company.legal.emailGeneral,
  emailEtica: company.legal.emailEtica,
  emailLicitaciones: company.legal.emailLicitaciones,
  emailRrhh: company.legal.emailRrhh,
  telefonoPrincipal: EMPRENOR_TELEFONO_PRINCIPAL.telefono,
  telefonoPrincipalHref: EMPRENOR_TELEFONO_PRINCIPAL.telHref,
  telefonoSecundario: EMPRENOR_TELEFONO_SECUNDARIO.telefono,
  telefonoSecundarioHref: EMPRENOR_TELEFONO_SECUNDARIO.telHref,
  provincias: EMPRENOR_PROVINCIAS,
  tiposObra: EMPRENOR_TIPOS_OBRA,
  operacionDesde: EMPRENOR_TITULAR.operacionDesde,
  notaImpositiva: company.legal.notaImpositiva,
} as const

export const EMPRENOR_SOCIAL = {
  facebook: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || company.social.facebook,
  instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || company.social.instagram,
  linkedin: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN || company.social.linkedin,
} as const

export const EMPRENOR_SECTORS = [
  {
    title: "Obras privadas",
    description: "Viviendas, ampliaciones y reformas con presupuesto detallado.",
    href: "/servicios/viviendas-prefabricadas",
  },
  {
    title: "Obras comerciales",
    description: "Locales, showrooms y espacios comerciales.",
    href: "/servicios/construccion",
  },
  {
    title: "Obras industriales",
    description: "Naves, galpones e infraestructura industrial.",
    href: "/servicios/obras-industriales",
  },
  {
    title: "Obras corporativas",
    description: "Sedes, oficinas e infraestructura para empresas.",
    href: "/servicios/construccion",
  },
  {
    title: "Obras públicas",
    description: "Instituciones, edificios estatales y obra pública provincial.",
    href: "/licitaciones",
  },
] as const

export const FOOTER_LEGAL_LINKS = company.footerLegalLinks

export const FOOTER_PORTAL_LINKS = company.footerPortalLinks as readonly {
  href: string
  label: string
  external?: boolean
}[]

export function getMarcaLegalNotice() {
  return `${EMPRENOR_BRAND.nombreExtendido} es marca comercial de ${EMPRENOR_TITULAR.nombreCompleto} (CUIT ${EMPRENOR_LEGAL.cuit}, ${EMPRENOR_LEGAL.condicionIva}). ${EMPRENOR_LEGAL.notaImpositiva}`
}

export function getCopyrightNotice(year = new Date().getFullYear()) {
  return `© ${year} ${EMPRENOR_BRAND.nombreExtendido} — ${EMPRENOR_TITULAR.nombreCompleto} (CUIT ${EMPRENOR_LEGAL.cuit}). Todos los derechos reservados.`
}
