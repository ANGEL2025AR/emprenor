import companyConstants from "../../shared/company.constants.json"
import servicesCatalog from "../../shared/services.catalog.json"
import {
  EMPRENOR_BRAND,
  EMPRENOR_HOME_STATS,
  EMPRENOR_LEGAL,
  EMPRENOR_MARKETING,
  EMPRENOR_PROVINCIAS,
  EMPRENOR_TITULAR,
} from "@/lib/company/constants"
import type { BrochureContentDocument, BrochureDirectoryMember } from "@/lib/db/models"

const LEGAL_ENTITY = companyConstants.legalEntity as {
  legalName: string
  legalNameShort: string
  commercialBrand: string
  commercialTagline: string
  formaJuridica: string
  transitionNote: string
  cuit?: string
}

export const DEFAULT_BROCHURE_CERTIFICATIONS = [
  "Norma aplicable al contrato, cuando la instalación o la estructura la exigen",
  "IVA Responsable Inscripto",
  "Documentación de obra según lo pactado",
]

export const DEFAULT_BROCHURE_MANIFESTO_ITEMS = [
  { id: "m1", order: 1, text: `PORQUE integramos ${servicesCatalog.services.length} especialidades bajo un solo interlocutor comercial y técnico en el NOA.` },
  { id: "m2", order: 2, text: "PORQUE cada obra se ejecuta con el alcance, la documentación y la garantía que figuran en el contrato." },
  { id: "m3", order: 3, text: "PORQUE la norma de la instalación o de la estructura se indica en el contrato, cuando el trámite la exige." },
  { id: "m4", order: 4, text: "PORQUE el presupuesto y el cronograma se acuerdan por escrito antes de empezar." },
  { id: "m5", order: 5, text: "PORQUE acompañamos al cliente antes, durante y después de la obra con atención comercial dedicada." },
  { id: "m6", order: 6, text: "PORQUE operamos en Salta, Jujuy, Tucumán y Formosa con sede estratégica en Campamento Vespucio." },
  { id: "m7", order: 7, text: "PORQUE construimos para el sector público, privado, industrial, comercial y agropecuario." },
  { id: "m8", order: 8, text: "PORQUE priorizamos la seguridad y salud en obra como parte de nuestra cultura operativa." },
  { id: "m9", order: 9, text: "PORQUE queremos que nuestros clientes vuelvan y recomienden nuestro trabajo." },
  { id: "m10", order: 10, text: "PORQUE estamos en proceso de consolidación como sociedad, con la misma exigencia de siempre." },
]

export function buildDefaultBrochureContent(): Omit<BrochureContentDocument, "_id" | "createdAt" | "updatedAt"> {
  const cuit = LEGAL_ENTITY.cuit || EMPRENOR_TITULAR.cuit

  return {
    key: "main",
    published: true,
    legalEntity: {
      legalName: LEGAL_ENTITY.legalName,
      legalNameShort: LEGAL_ENTITY.legalNameShort,
      commercialBrand: LEGAL_ENTITY.commercialBrand,
      commercialTagline: LEGAL_ENTITY.commercialTagline,
      cuit,
      formaJuridica: LEGAL_ENTITY.formaJuridica,
      transitionNote: LEGAL_ENTITY.transitionNote,
      domicilioFiscal: EMPRENOR_TITULAR.domicilioFiscal,
      operacionDesde: EMPRENOR_TITULAR.operacionDesde,
      foundedLabel: companyConstants.titular.foundedLabel,
      companyImage: EMPRENOR_MARKETING.homeTrustImage,
    },
    cover: {
      since: companyConstants.titular.operacionDesdeLabel,
      headline: ["Construimos", "con respaldo.", "Entregamos", "con garantía."],
      description: `${LEGAL_ENTITY.commercialBrand} es la marca comercial de ${LEGAL_ENTITY.legalNameShort}. Construcción e instalaciones integradas en ${EMPRENOR_PROVINCIAS.join(", ")}.`,
      cta: "Solicitar cotización",
      image: EMPRENOR_MARKETING.homeTrustImage,
      imageAlt: EMPRENOR_MARKETING.homeTrustImageAlt,
      provinces: [...EMPRENOR_PROVINCIAS],
    },
    manifesto: {
      title: "¿Por qué EMPRENOR?",
      subtitle: "Nuestro compromiso con cada proyecto del Noroeste Argentino",
      items: DEFAULT_BROCHURE_MANIFESTO_ITEMS,
    },
    presentation: {
      title: "Carta de presentación",
      salutation: "Estimado cliente:",
      paragraphs: [
        `Por medio de la presente, ${LEGAL_ENTITY.commercialBrand} — marca comercial de ${LEGAL_ENTITY.legalNameShort} — tiene el agrado de presentarle nuestra propuesta integral de construcción e instalaciones para el Noroeste Argentino.`,
        `Desde ${EMPRENOR_TITULAR.operacionDesde} acompañamos a empresas, instituciones y familias en ${EMPRENOR_PROVINCIAS.join(", ")} con un modelo de gestión único: un solo interlocutor para obra civil, instalaciones eléctricas, sanitarias, de gas, climatización, mantenimiento y viviendas llave en mano.`,
        "El diferencial es un solo interlocutor y un alcance escrito: presupuesto, cronograma y documentación de entrega se definen en cada contrato.",
        `Este folleto corporativo detalla el alcance de nuestras ${servicesCatalog.services.length} especialidades. El presupuesto se arma después de definir la obra.`,
      ],
      closing: "Atentamente,",
      signatory: `Dirección Comercial · ${LEGAL_ENTITY.commercialBrand}`,
      signatoryRole: `${EMPRENOR_TITULAR.nombreCompleto} · Titular · CUIT ${cuit}`,
    },
    history: {
      title: "Nuestra Historia y Propósito",
      paragraphs: [
        `${LEGAL_ENTITY.commercialBrand} inició operaciones en ${companyConstants.titular.operacionDesdeLabel} bajo la conducción de ${EMPRENOR_TITULAR.nombreCompleto}, con foco en construcción e instalaciones para el sector público, privado e industrial del NOA.`,
        `La empresa evoluciona hacia ${LEGAL_ENTITY.legalName}, manteniendo ${LEGAL_ENTITY.commercialBrand} como marca comercial ante el mercado.`,
        `Operamos en ${EMPRENOR_PROVINCIAS.length} provincias con ${servicesCatalog.services.length} especialidades integradas y un equipo directivo en expansión.`,
        "El propósito es acompañar obras de construcción e instalaciones en el norte argentino, con el alcance escrito en cada contrato.",
      ],
    },
    mission: {
      mission:
        "Proporcionar servicios de construcción e instalaciones de la más alta calidad, cumpliendo plazos y presupuestos acordados, con trabajo profesional, ético y comprometido.",
      vision:
        "Acompañar obras del NOA con un interlocutor, alcance escrito y la documentación que pida cada contrato.",
    },
    values: [
      { title: "Calidad", desc: "Materiales y técnicas de excelencia con control documentado en obra." },
      { title: "Compromiso", desc: "Dedicación total a cada proyecto como si fuera propio." },
      { title: "Profesionalismo", desc: "Un interlocutor comercial y técnico, con el alcance escrito antes de la obra." },
      { title: "Puntualidad", desc: "Respeto de plazos acordados y comunicación constante." },
      { title: "Integración", desc: "Un solo interlocutor para civil, instalaciones y mantenimiento." },
      { title: "Seguridad", desc: "Prioridad en SST y cumplimiento riguroso en obra." },
    ],
    stats: EMPRENOR_HOME_STATS.map((s) => ({ value: s.number, label: s.label })),
    certifications: DEFAULT_BROCHURE_CERTIFICATIONS,
    closing: {
      headline: "Inspirando desarrollo en el NOA",
      subline: `${LEGAL_ENTITY.commercialBrand} · ${LEGAL_ENTITY.legalNameShort}`,
    },
  }
}

export const DEFAULT_BROCHURE_DIRECTORY: Omit<
  BrochureDirectoryMember,
  "_id" | "createdAt" | "updatedAt" | "updatedBy"
>[] = [
  {
    name: EMPRENOR_TITULAR.nombreCompleto,
    role: "Titular · Director",
    department: "DIRECTORIO",
    bio: "Fundador y titular de la marca comercial EMPRENOR C&S. Conduce la estrategia corporativa y la transición a persona jurídica.",
    photo: "",
    email: EMPRENOR_LEGAL.emailGeneral,
    phone: companyConstants.telefonoSecundario.telefono,
    order: 1,
    published: true,
    featured: true,
  },
  {
    name: companyConstants.telefonoPrincipal.nombre,
    role: "Atención comercial",
    department: "COMERCIAL",
    bio: "Primer punto de contacto para consultas, cotizaciones y seguimiento comercial.",
    photo: "",
    email: EMPRENOR_LEGAL.emailGeneral,
    phone: companyConstants.telefonoPrincipal.telefono,
    order: 2,
    published: true,
    featured: true,
  },
  {
    name: "Equipo de Obra",
    role: "Coordinación técnica",
    department: "GESTIÓN DE PROYECTOS",
    bio: "Profesionales y capataces a cargo de la ejecución, documentación y control de calidad en sitio.",
    photo: "",
    order: 3,
    published: true,
    featured: false,
  },
  {
    name: "Administración",
    role: "Gestión administrativa",
    department: "ADMINISTRACIÓN Y FINANZAS",
    bio: "Soporte contable, contractual y documental de la operación.",
    photo: "",
    order: 4,
    published: true,
    featured: false,
  },
]

export const BROCHURE_DIRECTORY_DEPARTMENTS = [
  "DIRECTORIO",
  "ADMINISTRACIÓN Y FINANZAS",
  "COMERCIAL",
  "GESTIÓN DE PROYECTOS",
  "COMPRAS Y LOGÍSTICA",
  "DISEÑO Y PROYECTO",
  "CALIDAD Y SEGURIDAD",
] as const
