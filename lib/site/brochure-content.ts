import { EMPRENOR_LEGAL, EMPRENOR_PROVINCIAS, EMPRENOR_TITULAR } from "@/lib/company/constants"

export const BROCHURE_PROCESS = [
  { step: 1, title: "Consulta", desc: "Evaluamos necesidades y objetivos del proyecto" },
  { step: 2, title: "Cotización", desc: "Presupuesto detallado y transparente, sin costos ocultos" },
  { step: 3, title: "Planificación", desc: "Diseño y cronograma de obra con plazos claros" },
  { step: 4, title: "Ejecución", desc: "Construcción con supervisión continua y control de calidad" },
  { step: 5, title: "Entrega", desc: "Finalización en tiempo y forma con garantía de obra" },
]

export const BROCHURE_COVERAGE = EMPRENOR_PROVINCIAS.map((name) => ({
  name,
  sub: name === "Salta" ? "Cobertura completa" : "Servicio integral",
}))

export const BROCHURE_OFFICES = [
  {
    name: "Sede fiscal y comercial",
    address: EMPRENOR_TITULAR.domicilioComercial,
    primary: true,
  },
]

export const BROCHURE_QUALITY_DOCS = [
  { title: "Libro de obra", desc: "Registro cronológico con firmas de dirección técnica, hitos y conformidades parciales." },
  { title: "Control de calidad", desc: "Listas de verificación de recepción de materiales, ejecución y entrega conforme normativa." },
  { title: "Documentación conforme a obra", desc: "Planos conforme a obra ejecutada, memorias técnicas y certificados de instalaciones habilitadas." },
  { title: "Trazabilidad", desc: "Certificados de materiales, ensayos y fichas técnicas archivadas por proyecto." },
]

export const BROCHURE_GUARANTEES = [
  { title: "Calidad garantizada", desc: "Materiales y técnicas de primera línea en cada proyecto." },
  { title: "Plazos cumplidos", desc: "Compromiso real con los tiempos de entrega acordados." },
  { title: "Presupuesto transparente", desc: "Claridad total desde el primer día, sin sorpresas." },
  { title: "Equipo certificado", desc: "Profesionales habilitados con amplia trayectoria en el NOA." },
]
