import { EMPRENOR_LEGAL, EMPRENOR_PROVINCIAS, EMPRENOR_TITULAR } from "@/lib/company/constants"

export const BROCHURE_PROCESS = [
  { step: 1, title: "Consulta", desc: "Evaluamos necesidades y objetivos del proyecto" },
  { step: 2, title: "Cotización", desc: "Presupuesto con alcance y precio por escrito" },
  { step: 3, title: "Planificación", desc: "Diseño y cronograma de obra con plazos claros" },
  { step: 4, title: "Ejecución", desc: "Construcción con supervisión continua y control de calidad" },
  { step: 5, title: "Entrega", desc: "Cierre según el contrato, con la documentación y la garantía que se hayan pactado" },
]

export const BROCHURE_COVERAGE = EMPRENOR_PROVINCIAS.map((name) => ({
  name,
  sub: "Obras en la provincia",
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
  { title: "Control de calidad", desc: "Controles en los hitos que define el contrato: replanteo, estructura, instalaciones y terminaciones." },
  { title: "Documentación conforme a obra", desc: "Planos, actas y memorias cuando el contrato los pide. Las habilitaciones se tramitan si la instalación las exige." },
  { title: "Trazabilidad", desc: "Fichas técnicas y registros de materiales que correspondan al alcance contratado." },
]

export const BROCHURE_GUARANTEES = [
  { title: "Alcance por escrito", desc: "Materiales y controles quedan definidos en el presupuesto de cada obra." },
  { title: "Plazos acordados", desc: "El cronograma se pacta por escrito y se informa el avance." },
  { title: "Presupuesto claro", desc: "El precio y lo que incluye se detallan antes de empezar." },
  { title: "Un interlocutor", desc: "La consulta y el seguimiento se coordinan con el mismo equipo." },
]
