/**
 * Datos corporativos verificados — marca EMPRENOR C&S.
 * Titular: Guerrero, Silvio Carlos Fabian (CUIT 20-40154622-8, IVA Responsable Inscripto).
 * Fuente única para sitio público, legales, SEO y schema.org.
 */

export const EMPRENOR_BRAND = {
  siglas: "EMPRENOR C&S",
  nombreExtendido: "EMPRENOR Construcciones y Servicios",
  significadoSiglas: "Construcciones y Servicios",
  nombre: "EMPRENOR C&S",
  nombreCompleto: "EMPRENOR Construcciones y Servicios",
  descripcion: "Construcción y servicios integrados en el NOA",
} as const

/** Titular legal de la marca comercial (persona humana). */
export const EMPRENOR_TITULAR = {
  apellidoNombre: "Guerrero, Silvio Carlos Fabian",
  nombreCompleto: "Silvio Carlos Fabian Guerrero",
  cuit: "20-40154622-8",
  formaJuridica: "Persona humana",
  condicionIva: "IVA Responsable Inscripto",
  domicilioFiscal:
    "Av. Casiano Casas 3080, Barrio Policial, Campamento Vespucio, Dpto. Gral. San Martín, CP 4563, Provincia de Salta, Argentina",
  domicilioComercial:
    "Av. Casiano Casas 3080, Barrio Policial, Campamento Vespucio, Dpto. Gral. San Martín, CP 4563, Provincia de Salta, Argentina",
  telefono: "+54 9 387 352-2920",
  telHref: "+543873522920",
  operacionDesde: 2018,
} as const

export const EMPRENOR_SLOGAN = "Construcción y servicios en el NOA"

export const EMPRENOR_PROVINCIAS = ["Salta", "Jujuy", "Tucumán", "Formosa"] as const

export const EMPRENOR_TIPOS_OBRA = [
  "Obras privadas",
  "Obras comerciales",
  "Obras industriales",
  "Obras corporativas",
  "Obras públicas",
] as const

export const EMPRENOR_MARKETING = {
  homeTrustImage:
    "https://fvm8nkdmuld8gjsy.public.blob.vercel-storage.com/hero/1780546744964-IMG_20250820_232324.jpg",
  homeTrustImageAlt: "Equipo EMPRENOR en obra — Salta, NOA",
  operacionDesdeLabel: "Desde 2018",
} as const

/** Indicadores publicados verificables (no métricas inventadas). */
export const EMPRENOR_HOME_STATS = [
  { number: "9", label: "Especialidades integradas", icon: "CheckCircle" as const },
  { number: "4", label: "Provincias del NOA", icon: "Users" as const },
  { number: "2018", label: "Operación documentada", icon: "Clock" as const },
  { number: "5", label: "Tipos de obra", icon: "Award" as const },
] as const

export const EMPRENOR_FOOTER_TAGLINE = `${EMPRENOR_PROVINCIAS.join(", ")} · ${EMPRENOR_TITULAR.domicilioComercial.split(",").slice(0, 1).join("")}`

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
    mapsQuery: "Av. Casiano Casas 3080, Barrio Policial, Campamento Vespucio, Salta, Argentina",
  },
] as const

export const EMPRENOR_CONTACTOS = [
  {
    nombre: EMPRENOR_TITULAR.nombreCompleto,
    rol: `Titular · ${EMPRENOR_BRAND.siglas}`,
    telefono: EMPRENOR_TITULAR.telefono,
    telHref: EMPRENOR_TITULAR.telHref,
  },
  {
    nombre: "Sebastian Romero",
    rol: "Atención comercial",
    telefono: "+54 9 11 2758-6521",
    telHref: "+5491127586521",
  },
] as const

export const EMPRENOR_WHATSAPP = [
  {
    name: EMPRENOR_TITULAR.nombreCompleto,
    role: `Titular · ${EMPRENOR_BRAND.siglas}`,
    number: "543873522920",
    message: "Hola, consulto por servicios de construcción EMPRENOR C&S.",
  },
  {
    name: "Sebastian Romero",
    role: "Atención comercial",
    number: "5491127586521",
    message: "Hola Sebastian, consulto por servicios de construcción EMPRENOR.",
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
  emailGeneral: "info@emprenor.com.ar",
  emailEtica: "etica@emprenor.com.ar",
  emailLicitaciones: "licitaciones@emprenor.com.ar",
  emailRrhh: "rrhh@emprenor.com.ar",
  telefonoPrincipal: EMPRENOR_TITULAR.telefono,
  telefonoSecundario: EMPRENOR_CONTACTOS[1].telefono,
  provincias: EMPRENOR_PROVINCIAS,
  tiposObra: EMPRENOR_TIPOS_OBRA,
  operacionDesde: EMPRENOR_TITULAR.operacionDesde,
  notaImpositiva:
    "Los datos fiscales publicados corresponden a la constancia vigente del titular ante ARCA (ex AFIP). Para contrataciones se entrega constancia de inscripción actualizada.",
} as const

export const EMPRENOR_SOCIAL = {
  facebook: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || "https://www.facebook.com/emprenor",
  instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || "https://www.instagram.com/emprenor",
  linkedin: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN || "https://www.linkedin.com/company/emprenor",
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

export const FOOTER_LEGAL_LINKS = [
  { href: "/aviso-legal", label: "Aviso legal" },
  { href: "/politica-calidad", label: "Política de calidad" },
  { href: "/gestion-documental", label: "Gestión documental" },
  { href: "/privacidad", label: "Política de privacidad" },
  { href: "/cookies", label: "Política de cookies" },
  { href: "/codigo-etica", label: "Código de ética" },
  { href: "/seguridad-y-salud", label: "Seguridad y salud" },
  { href: "/sostenibilidad", label: "Sostenibilidad" },
  { href: "/linea-etica", label: "Línea de ética" },
  { href: "/licitaciones", label: "Licitaciones" },
  { href: "/trabaja-con-nosotros", label: "Trabajá con nosotros" },
] as const

export function getMarcaLegalNotice() {
  return `${EMPRENOR_BRAND.nombreExtendido} es marca comercial de ${EMPRENOR_TITULAR.nombreCompleto} (CUIT ${EMPRENOR_LEGAL.cuit}, ${EMPRENOR_LEGAL.condicionIva}). ${EMPRENOR_LEGAL.notaImpositiva}`
}

export function getCopyrightNotice(year = new Date().getFullYear()) {
  return `© ${year} ${EMPRENOR_BRAND.nombreExtendido} — ${EMPRENOR_TITULAR.nombreCompleto} (CUIT ${EMPRENOR_LEGAL.cuit}). Todos los derechos reservados.`
}
