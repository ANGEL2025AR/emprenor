/**
 * Datos corporativos — alineados con www.emprenor.com (marca, contacto NOA).
 * Datos fiscales completos se entregan bajo solicitud para contrataciones.
 */

export const EMPRENOR_BRAND = {
  siglas: "EMPRENOR C&S",
  nombreExtendido: "EMPRENOR Construcciones y Servicios",
  significadoSiglas: "Construcciones y Servicios",
  nombre: "EMPRENOR C&S",
  nombreCompleto: "EMPRENOR Construcciones y Servicios",
  descripcion: "Construcción y servicios integrados en el NOA",
} as const

export const EMPRENOR_SLOGAN = "Construcción y servicios en el NOA"

/** Imagen de confianza en home (misma fuente que heroes CMS en producción). */
export const EMPRENOR_MARKETING = {
  homeTrustImage:
    "https://fvm8nkdmuld8gjsy.public.blob.vercel-storage.com/hero/1780546744964-IMG_20250820_232324.jpg",
  homeTrustImageAlt: "Equipo EMPRENOR en obra — Salta, NOA",
  operacionDesdeLabel: "Desde 2018",
} as const

export const EMPRENOR_FOOTER_TAGLINE =
  "Salta, Jujuy, Tucumán y Formosa · Oficinas en Salta Capital, Tartagal y Campamento Vespucio."

export const EMPRENOR_SITE = {
  siteName: EMPRENOR_BRAND.siglas,
  titleTemplate: `%s | ${EMPRENOR_BRAND.siglas}`,
  defaultTitle: `${EMPRENOR_BRAND.siglas} — ${EMPRENOR_SLOGAN}`,
  manifestDescription: `${EMPRENOR_BRAND.siglas}. ${EMPRENOR_SLOGAN}. Obra en Salta, Jujuy, Tucumán y Formosa.`,
  manifestShortName: EMPRENOR_BRAND.siglas,
} as const

/** Presencia comercial publicada en el sitio. */
export const EMPRENOR_OFICINAS = [
  {
    nombre: "Salta Capital",
    direccion: "Ituzaingó 920, Salta Capital, Provincia de Salta, Argentina",
    mapsQuery: "Ituzaingó 920, Salta Capital, Argentina",
  },
  {
    nombre: "Tartagal",
    direccion: "Ituzaingó 1279, Tartagal, Provincia de Salta, Argentina",
    mapsQuery: "Ituzaingó 1279, Tartagal, Salta, Argentina",
  },
  {
    nombre: "Campamento Vespucio",
    direccion: "Av. Casiano Casas S/N, Barrio Policial, Campamento Vespucio, Salta, Argentina",
    mapsQuery: "Av. Casiano Casas, Campamento Vespucio, Salta, Argentina",
  },
] as const

export const EMPRENOR_CONTACTOS = [
  {
    nombre: "Sebastian Romero",
    rol: "Gerente General",
    telefono: "+54 9 11 2758-6521",
    telHref: "+5491127586521",
  },
  {
    nombre: "Carlos Guerrero",
    rol: "Coordinador de Proyectos",
    telefono: "+54 9 387 352-2920",
    telHref: "+543873522920",
  },
] as const

export const EMPRENOR_WHATSAPP = [
  {
    name: "Sebastian Romero",
    role: "Gerente General",
    number: "5491127586521",
    message: "Hola Sebastian! Me gustaría obtener más información sobre sus servicios de construcción.",
  },
  {
    name: "Carlos Guerrero",
    role: "Coordinador de Proyectos",
    number: "543873522920",
    message: "Hola Carlos! Necesito información sobre servicios de construcción EMPRENOR.",
  },
] as const

export const EMPRENOR_LEGAL = {
  razonSocial: EMPRENOR_BRAND.nombreExtendido,
  marcaComercial: EMPRENOR_BRAND.siglas,
  marcaNombreCompleto: EMPRENOR_BRAND.nombreExtendido,
  cuit: process.env.NEXT_PUBLIC_EMPRENOR_CUIT || "",
  domicilioLegal: EMPRENOR_OFICINAS[0].direccion,
  domicilioFiscal: EMPRENOR_OFICINAS[0].direccion,
  domicilioComercial: EMPRENOR_OFICINAS[0].direccion,
  oficinasOperativas: EMPRENOR_OFICINAS,
  emailGeneral: "info@emprenor.com.ar",
  emailEtica: "etica@emprenor.com.ar",
  emailLicitaciones: "licitaciones@emprenor.com.ar",
  emailRrhh: "rrhh@emprenor.com.ar",
  telefonoPrincipal: EMPRENOR_CONTACTOS[0].telefono,
  telefonoSecundario: EMPRENOR_CONTACTOS[1].telefono,
  provincias: ["Salta", "Jujuy", "Tucumán", "Formosa"] as const,
  operacionDesde: 2018,
  notaImpositiva:
    "Condición impositiva según constancia ARCA (AFIP) e inscripción provincial vigentes. Se entregan bajo solicitud para contrataciones.",
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
  const cuit = EMPRENOR_LEGAL.cuit ? ` (CUIT ${EMPRENOR_LEGAL.cuit})` : ""
  return `${EMPRENOR_BRAND.nombreExtendido}${cuit}. ${EMPRENOR_LEGAL.notaImpositiva}`
}
