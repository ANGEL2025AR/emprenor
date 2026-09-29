import companyConstants from "../../shared/company.constants.json"
import servicesCatalog from "../../shared/services.catalog.json"
import {
  EMPRENOR_BRAND,
  EMPRENOR_HOME_STATS,
  EMPRENOR_LEGAL,
  EMPRENOR_PROVINCIAS,
  EMPRENOR_TITULAR,
} from "@/lib/company/constants"

export const BROCHURE_CERTIFICATIONS = [
  "Norma aplicable al contrato, cuando la instalación o la estructura la exigen",
  "IVA Responsable Inscripto",
  "Documentación de obra según lo pactado",
]

export const BROCHURE_META = {
  year: 2026,
  tagline: "Construcciones & Servicios",
  website: "www.emprenor.com",
  founded: EMPRENOR_TITULAR.operacionDesde,
  foundedLabel: companyConstants.titular.foundedLabel,
  experienceYears: new Date().getFullYear() - EMPRENOR_TITULAR.operacionDesde,
}

export const BROCHURE_STATS = EMPRENOR_HOME_STATS.map((s) => ({ value: s.number, label: s.label }))

export const BROCHURE_COVER = {
  since: companyConstants.titular.operacionDesdeLabel,
  headline: ["Ingeniería,", "construcción", "e", "instalaciones."],
  description: `${EMPRENOR_BRAND.nombreExtendido}. Marca comercial de ${EMPRENOR_TITULAR.nombreCompleto}. Presencia en ${EMPRENOR_PROVINCIAS.join(", ")}.`,
  cta: "Solicitar cotización",
  image: "/servicios/construccion.jpg",
  provinces: EMPRENOR_PROVINCIAS,
}

export const BROCHURE_PRESENTATION = {
  title: "Carta de presentación",
  salutation: "Estimado cliente:",
  paragraphs: [
    `Por medio de la presente, ${EMPRENOR_BRAND.siglas} — marca comercial de ${EMPRENOR_TITULAR.nombreCompleto} — tiene el agrado de presentarle nuestra propuesta integral de construcción e instalaciones para el Noroeste Argentino.`,
    `Desde ${EMPRENOR_TITULAR.operacionDesde} acompañamos a empresas, instituciones y familias en ${EMPRENOR_PROVINCIAS.join(", ")} con un modelo de gestión único: un solo interlocutor para obra civil, instalaciones eléctricas, sanitarias, de gas, climatización, mantenimiento y viviendas llave en mano.`,
    "El diferencial es un solo interlocutor y un alcance escrito: presupuesto, cronograma y documentación de entrega se definen en cada contrato.",
    "Este folleto corporativo detalla el alcance de cada especialidad. El presupuesto se arma después de definir la obra.",
  ],
  closing: "Atentamente,",
  signatory: "Equipo Comercial · EMPRENOR C&S",
  signatoryRole: `${EMPRENOR_TITULAR.nombreCompleto} · CUIT ${EMPRENOR_TITULAR.cuit}`,
}

export const BROCHURE_HISTORY = {
  title: "Nuestra Historia y Propósito",
  paragraphs: [
    `${EMPRENOR_BRAND.siglas} inició operaciones en ${companyConstants.titular.operacionDesdeLabel} como marca comercial de ${EMPRENOR_TITULAR.nombreCompleto}, con foco en construcción e instalaciones para el sector público, privado e industrial del NOA.`,
    `Operamos en ${EMPRENOR_PROVINCIAS.length} provincias del NOA con ${servicesCatalog.services.length} especialidades integradas bajo un solo interlocutor comercial.`,
    "Nuestro equipo multidisciplinario aplica gestión documental, cumplimiento normativo y control de calidad en cada proyecto.",
  ],
}

export const BROCHURE_MISSION = {
  mission:
    "Proporcionar servicios de construcción e instalaciones de la más alta calidad, cumpliendo plazos y presupuestos acordados, superando las expectativas mediante un trabajo profesional, ético y comprometido.",
  vision:
    "Acompañar obras del norte argentino con un interlocutor, alcance escrito y la documentación que pida cada contrato.",
}

export const BROCHURE_VALUES = [
  { title: "Calidad", desc: "Materiales y técnicas constructivas de excelencia en cada proyecto, con control documentado en obra." },
  { title: "Compromiso", desc: "Dedicación total a cada obra, tratándola como propia y asegurando satisfacción en cada etapa." },
  { title: "Profesionalismo", desc: "Un interlocutor comercial y técnico, con el alcance escrito antes de la obra." },
  { title: "Puntualidad", desc: "Respeto de plazos acordados, comunicación constante y gestión eficiente de recursos." },
  { title: "Innovación", desc: "Tecnologías y métodos constructivos modernos para soluciones eficientes y sostenibles." },
  { title: "Seguridad", desc: "Prioridad en SST y cumplimiento riguroso de normativas vigentes en obra." },
]

export { BROCHURE_PROCESS, BROCHURE_COVERAGE, BROCHURE_OFFICES, BROCHURE_QUALITY_DOCS, BROCHURE_GUARANTEES } from "./brochure-content"

export const BROCHURE_SERVICES = servicesCatalog.services.map((entry, index) => ({
  num: String(index + 1).padStart(2, "0"),
  title: entry.title,
  desc: entry.shortDescription,
  featured: entry.slug === "construccion" || entry.slug === "viviendas-prefabricadas",
}))

export const BROCHURE_CONTACT = {
  phones: [
    { label: "Línea principal", value: EMPRENOR_LEGAL.telefonoPrincipal },
    { label: "Salta / NOA", value: EMPRENOR_LEGAL.telefonoSecundario },
  ],
  email: EMPRENOR_LEGAL.emailGeneral,
  emailNote: "Horario comercial de lunes a sábado",
  website: "www.emprenor.com",
  websiteNote: "Solicite una cotización gratuita en línea",
}

export const BROCHURE_FEATURED_PROJECTS_FALLBACK: Array<{
  num: string
  title: string
  location: string
  badge: string
  plazo?: string
  highlight?: boolean
}> = []
