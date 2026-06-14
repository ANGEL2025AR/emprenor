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
  "AEA 90364 — Instalaciones eléctricas",
  "NAG / ENARGAS — Instalaciones de gas",
  "CIRSOC — Estructuras y obra civil",
  "IRAM / IEC — Materiales eléctricos",
  "IVA Responsable Inscripto",
  "Matrículas profesionales vigentes",
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
  image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=85",
  provinces: EMPRENOR_PROVINCIAS,
}

export const BROCHURE_PRESENTATION = {
  title: "Carta de presentación",
  salutation: "Estimado cliente:",
  paragraphs: [
    `Por medio de la presente, ${EMPRENOR_BRAND.siglas} — marca comercial de ${EMPRENOR_TITULAR.nombreCompleto} — tiene el agrado de presentarle nuestra propuesta integral de construcción e instalaciones para el Noroeste Argentino.`,
    `Desde ${EMPRENOR_TITULAR.operacionDesde} acompañamos a empresas, instituciones y familias en ${EMPRENOR_PROVINCIAS.join(", ")} con un modelo de gestión único: un solo interlocutor para obra civil, instalaciones eléctricas, sanitarias, de gas, climatización, mantenimiento y viviendas llave en mano.`,
    "Nuestro diferencial es la ejecución con documentación técnica completa, personal matriculado y control de calidad conforme a normativa AEA 90364, NAG/ENARGAS y CIRSOC. Cada proyecto se desarrolla con presupuesto transparente, cronograma acordado y garantía de obra.",
    "Este folleto corporativo detalla, especialidad por especialidad, el alcance técnico de nuestros servicios. Invitamos a contactarnos para una visita técnica sin cargo y una cotización adaptada a su necesidad.",
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
    "Ser la empresa constructora líder del norte argentino, reconocida por innovación, calidad y cumplimiento, expandiendo servicios integrados y manteniéndonos a la vanguardia de la industria.",
}

export const BROCHURE_VALUES = [
  { title: "Calidad", desc: "Materiales y técnicas constructivas de excelencia en cada proyecto, con control documentado en obra." },
  { title: "Compromiso", desc: "Dedicación total a cada obra, tratándola como propia y asegurando satisfacción en cada etapa." },
  { title: "Profesionalismo", desc: "Equipo capacitado y matriculado que actúa con ética, respeto y transparencia." },
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
  emailNote: "Respuesta en menos de 24 horas",
  website: "www.emprenor.com",
  websiteNote: "Solicite una cotización gratuita en línea",
}

export const BROCHURE_FEATURED_PROJECTS_FALLBACK = [
  { num: "01", title: "Obra educativa — NOA", location: "Salta", badge: "Sector público", plazo: "Documentado", highlight: true },
  { num: "02", title: "Infraestructura sanitaria", location: "Jujuy", badge: "Salud", plazo: "Entregado", highlight: false },
  { num: "03", title: "Nave industrial", location: "Tucumán", badge: "Industrial", plazo: "En garantía", highlight: false },
]
