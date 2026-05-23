/**
 * Datos corporativos verificados con documentación AFIP / IIBB (sept. 2024).
 * EMPRENOR C&S es marca comercial; titular legal: RM INTERNATIONAL GROUP S.A.S.
 */

/** Titular legal — constancia AFIP, F960, inscripciones IIBB Convenio Multilateral. */
export const RM_LEGAL = {
  razonSocial: "RM INTERNATIONAL GROUP S.A.S.",
  cuit: "30-71603601-0",
  formaJuridica: "Sociedad por Acciones Simplificada",
  fechaConstitucion: "2018-05-21",
  domicilioFiscal:
    "Maipú 566, Piso 4 D, C1006 Ciudad Autónoma de Buenos Aires, Argentina",
  ivaCondicion: "IVA Responsable Inscripto",
  iibb: {
    regimen: "Convenio Multilateral",
    numeroInscripcion: "901-30716036010",
    numeroPadron: "30716036010",
    fechaInscripcion: "2018-07-01",
    /** Jurisdicciones con constancia documentada en archivo corporativo. */
    jurisdiccionesDocumentadas: ["CABA", "Córdoba", "Neuquén", "Santa Cruz", "Misiones"] as const,
  },
  actividades: {
    construccion: {
      codigo: "439990",
      descripcion: "Actividades especializadas de construcción n.c.p.",
      fechaInicio: "2018-06-01",
    },
    principalAfip: {
      codigo: "661991",
      descripcion: "Servicios de envío y recepción de fondos desde y hacia el exterior",
    },
  },
} as const

export const EMPRENOR_BRAND = {
  /** Marca corta de uso general: Construcciones y Servicios. */
  siglas: "EMPRENOR C&S",
  nombreExtendido: "EMPRENOR Construcciones y Servicios",
  significadoSiglas: "Construcciones y Servicios",
  /** Alias principal en UI y metadatos. */
  nombre: "EMPRENOR C&S",
  nombreCompleto: "EMPRENOR Construcciones y Servicios",
  descripcion: "Marca comercial de construcción y servicios en el NOA",
  titularLegal: RM_LEGAL.razonSocial,
} as const

/** Slogan visible en pie de página, heroes y metadatos cortos. */
export const EMPRENOR_SLOGAN = "Construcción y servicios en el NOA"

/** Texto breve bajo el logo del footer (sin titular legal). */
export const EMPRENOR_FOOTER_TAGLINE =
  "Salta, Jujuy, Tucumán y Formosa · Oficinas en Salta Capital, Tartagal y Campamento Vespucio."

/** Metadatos SEO / PWA — una sola fuente. */
export const EMPRENOR_SITE = {
  siteName: EMPRENOR_BRAND.siglas,
  titleTemplate: `%s | ${EMPRENOR_BRAND.siglas}`,
  defaultTitle: `${EMPRENOR_BRAND.siglas} — ${EMPRENOR_SLOGAN}`,
  manifestDescription: `${EMPRENOR_BRAND.siglas}. ${EMPRENOR_SLOGAN}. Obra en Salta, Jujuy, Tucumán y Formosa.`,
  manifestShortName: EMPRENOR_BRAND.siglas,
} as const

/** Oficinas operativas NOA (presencia comercial; domicilio fiscal en CABA). */
export const EMPRENOR_OFICINAS = [
  {
    nombre: "Salta Capital",
    direccion: "Ituzaingó 920, Salta Capital, Provincia de Salta",
  },
  {
    nombre: "Tartagal",
    direccion: "Ituzaingó 1279, Tartagal, Provincia de Salta",
  },
  {
    nombre: "Campamento Vespucio",
    direccion: "Av. Casiano Casas S/N, Barrio Policial, Campamento Vespucio, Salta",
  },
] as const

/** Fuente única para páginas públicas, legales y metadatos. */
export const EMPRENOR_LEGAL = {
  razonSocial: RM_LEGAL.razonSocial,
  marcaComercial: EMPRENOR_BRAND.siglas,
  marcaNombreCompleto: EMPRENOR_BRAND.nombreExtendido,
  cuit: process.env.NEXT_PUBLIC_EMPRENOR_CUIT || RM_LEGAL.cuit,
  domicilioLegal: RM_LEGAL.domicilioFiscal,
  domicilioFiscal: RM_LEGAL.domicilioFiscal,
  oficinasOperativas: EMPRENOR_OFICINAS,
  emailGeneral: "info@emprenor.com.ar",
  emailEtica: "etica@emprenor.com.ar",
  emailLicitaciones: "licitaciones@emprenor.com.ar",
  emailRrhh: "rrhh@emprenor.com.ar",
  telefonoPrincipal: "+54 9 11 2758-6521",
  telefonoSecundario: "+54 9 387 352-2920",
  provincias: ["Salta", "Jujuy", "Tucumán", "Formosa"],
  /** Constitución de RM INTERNATIONAL GROUP S.A.S. (contrato social). */
  fundacion: 2018,
  ivaCondicion: RM_LEGAL.ivaCondicion,
  iibbRegimen: RM_LEGAL.iibb.regimen,
  iibbNumero: RM_LEGAL.iibb.numeroInscripcion,
} as const

export const EMPRENOR_SOCIAL = {
  facebook: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || "https://www.facebook.com/emprenor",
  instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || "https://www.instagram.com/emprenor",
  linkedin: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN || "https://www.linkedin.com/company/emprenor",
} as const

/** Pilares de confianza — formulación verificable. */
export const EMPRENOR_TRUST_PILLARS = [
  { icon: "map" as const, title: "4 provincias NOA", subtitle: "Salta, Jujuy, Tucumán, Formosa" },
  { icon: "hardhat" as const, title: "9 especialidades", subtitle: "Obra coordinada llave en mano" },
  { icon: "shield" as const, title: "SST y ART", subtitle: "Cultura de prevención en obra" },
  { icon: "file" as const, title: "Obra pública", subtitle: "Documentación bajo solicitud" },
  { icon: "leaf" as const, title: "Compromiso ESG", subtitle: "Según contrato y pliego" },
  { icon: "award" as const, title: "Desde 2018", subtitle: "RM International Group S.A.S." },
] as const

/** Sectores atendidos bajo marca EMPRENOR. */
export const EMPRENOR_SECTORS = [
  {
    title: "Sector público",
    description: "Municipios y organismos provinciales/nacionales. Documentación y SST según pliego, bajo solicitud.",
    href: "/licitaciones",
  },
  {
    title: "Industria",
    description: "Naves, galpones e infraestructura con planificación, cronograma y controles acordados en contrato.",
    href: "/servicios/obras-industriales",
  },
  {
    title: "Comercial y corporativo",
    description: "Locales, oficinas y edificios con coordinación de gremios y terminaciones según especificación.",
    href: "/servicios/construccion",
  },
  {
    title: "Residencial",
    description: "Viviendas, ampliaciones y prefabricadas con presupuesto detallado y garantías definidas en contrato.",
    href: "/servicios/viviendas-prefabricadas",
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

/** Párrafo completo marca/titular — solo en aviso legal y documentos formales. */
export function getMarcaLegalNotice() {
  return `${EMPRENOR_BRAND.siglas} es marca comercial de ${RM_LEGAL.razonSocial} (CUIT ${RM_LEGAL.cuit}). El significado de «C&S» es ${EMPRENOR_BRAND.significadoSiglas}.`
}

/** Sufijo para textos alt de imágenes de servicio. */
export function getServiceImageAlt(title: string) {
  return `${title} — ${EMPRENOR_BRAND.siglas}`
}
