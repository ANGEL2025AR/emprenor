import { getDb } from "@/lib/db/connection"
import { EMPRENOR_LEGAL } from "@/lib/company/constants"
import { contactFormUrl } from "@/lib/site/urls"

export const INSTITUTIONAL_SLUGS = ["licitaciones", "seguridad-y-salud", "sostenibilidad", "linea-etica"] as const

export type InstitutionalSlug = (typeof INSTITUTIONAL_SLUGS)[number]

export type InstitutionalSection = {
  title: string
  body: string
}

export type InstitutionalHighlight = {
  title: string
  text: string
}

export type InstitutionalPageContent = {
  slug: InstitutionalSlug
  title: string
  subtitle: string
  description: string
  sections: InstitutionalSection[]
  highlights: InstitutionalHighlight[]
  ctaLabel: string
  ctaHref: string
  formTitle: string
  formIntro: string
  heroImage: string
}

const LICITACIONES_CONTACTO = "/contacto?servicio=licitaciones#formulario"

export const INSTITUTIONAL_LABELS: Record<InstitutionalSlug, string> = {
  licitaciones: "Licitaciones",
  "seguridad-y-salud": "Seguridad y salud",
  sostenibilidad: "Sostenibilidad",
  "linea-etica": "Línea de ética",
}

export function isInstitutionalSlug(slug: string): slug is InstitutionalSlug {
  return (INSTITUTIONAL_SLUGS as readonly string[]).includes(slug)
}

export function getInstitutionalDefaults(slug: InstitutionalSlug): InstitutionalPageContent {
  const pages: Record<InstitutionalSlug, InstitutionalPageContent> = {
    licitaciones: {
      slug,
      title: "Licitaciones y sector público",
      subtitle: "EMPRENOR toma consultas de obra pública en Salta, Jujuy, Tucumán y Formosa. La documentación se arma según el pliego.",
      description: "Consulta de obra pública en el NOA. Documentación según el pliego, a licitaciones@emprenor.com.ar.",
      sections: [
        {
          title: "Qué se puede consultar",
          body: [
            "- Obras institucionales, educativas, sanitarias y de infraestructura en las cuatro provincias.",
            "- Referencias publicadas en [Proyectos](/proyectos).",
            "- Políticas de [seguridad y salud](/seguridad-y-salud), [ética](/codigo-etica) y [gestión documental](/gestion-documental).",
          ].join("\n"),
        },
        {
          title: "Documentación",
          body: "Ante un pliego o una precalificación, se envía la documentación que ese proceso pide: identificación fiscal, referencias de obra y las constancias que correspondan. No hay un legajo único publicado para todas las licitaciones.",
        },
        {
          title: "Cómo escribir",
          body: `Indicá organismo, número de pliego y plazo de presentación a [${EMPRENOR_LEGAL.emailLicitaciones}](mailto:${EMPRENOR_LEGAL.emailLicitaciones}), o usá el [formulario de contacto](${LICITACIONES_CONTACTO}) con el asunto Licitaciones y obra pública.`,
        },
      ],
      highlights: [
        { title: "Pliego", text: "La respuesta se arma con el proceso que nos envíen" },
        { title: "Documentación", text: "Se entrega lo que el pliego pide" },
        { title: "Seguridad", text: "La política de SST está publicada en el sitio" },
        { title: "Contacto", text: EMPRENOR_LEGAL.emailLicitaciones },
      ],
      ctaLabel: "Escribir por una licitación",
      ctaHref: LICITACIONES_CONTACTO,
      formTitle: "",
      formIntro: "",
      heroImage: "",
    },
    "seguridad-y-salud": {
      slug,
      title: "Seguridad y salud en el trabajo",
      subtitle: "Cultura de prevención en obra, según la normativa argentina de higiene y seguridad y lo que pida cada contrato.",
      description: "Política SST, ART y cultura de prevención en obra — EMPRENOR NOA.",
      sections: [
        {
          title: "Política de SST",
          body: "La planificación de riesgos, la inducción, el EPP y el registro de incidentes se definen según la normativa aplicable y lo que pida cada contrato.",
        },
        {
          title: "ART y habilitaciones",
          body: "La cobertura de ART y los seguros se revisan cuando el contrato o la normativa de la obra lo exigen. El portal del empleado muestra el legajo que RRHH haya validado.",
        },
        {
          title: "Capacitación e inducción",
          body: [
            "- Inducción general y específica por frente de obra.",
            "- Capacitación en trabajo en altura, espacios confinados y energías peligrosas según el proyecto.",
            "- Registro de firmas en nómina de cumplimiento cuando el contrato lo requiere.",
          ].join("\n"),
        },
        {
          title: "Incidentes y mejora continua",
          body: "Los incidentes se registran cuando el contrato prevé ese control. El cliente consulta el estado que se haya pactado compartir.",
        },
        {
          title: "Consultas y reportes",
          body: "Un organismo puede pedir la política y los registros de una obra por [licitaciones](/licitaciones) o por [gestión documental](/gestion-documental). Una condición insegura se reporta por la [línea de ética](/linea-etica).",
        },
      ],
      highlights: [],
      ctaLabel: "Solicitar información de obra",
      ctaHref: contactFormUrl(),
      formTitle: "",
      formIntro: "",
      heroImage: "",
    },
    sostenibilidad: {
      slug,
      title: "Sostenibilidad y comunidad",
      subtitle: "Las medidas ambientales y sociales de cada obra se escriben en el contrato. No publicamos una certificación ambiental.",
      description: "Criterios de obra en el NOA: residuos, entorno y compras, según lo que pida cada contrato.",
      sections: [
        {
          title: "En la obra",
          body: [
            "- Orden de residuos, polvo y derrames cuando el proyecto lo define.",
            "- Compras y proveedores de la zona si el contrato pide ese registro.",
            "- La sede está en Campamento Vespucio y las obras publicadas están en Salta y Jujuy.",
          ].join("\n"),
        },
        {
          title: "Qué no figura como política publicada",
          body: "No hay un programa propio de certificaciones ambientales, ni un compromiso publicado con organismos de cooperación. Si un pliego pide un plan de gestión ambiental, se prepara para esa obra.",
        },
        {
          title: "Consultas",
          body: `Las obras publicadas están en [Proyectos](/proyectos). Un requisito ambiental de un pliego se consulta por [contacto](${contactFormUrl()}) o por la [línea de ética](/linea-etica) si se trata de una conducta.`,
        },
      ],
      highlights: [],
      ctaLabel: "Ver obras publicadas",
      ctaHref: "/proyectos",
      formTitle: "",
      formIntro: "",
      heroImage: "",
    },
    "linea-etica": {
      slug,
      title: "Línea de ética",
      subtitle: "Canal confidencial para empleados, proveedores, clientes y comunidad.",
      description: "Canal confidencial para reportar conductas contrarias al código de ética de EMPRENOR.",
      sections: [],
      highlights: [],
      ctaLabel: "",
      ctaHref: "",
      formTitle: "Enviar un reporte",
      formIntro: `Canal confidencial para empleados, proveedores, clientes y comunidad. No toleramos represalias por reportes de buena fe. También puede escribir a [${EMPRENOR_LEGAL.emailEtica}](mailto:${EMPRENOR_LEGAL.emailEtica}).`,
      heroImage: "",
    },
  }
  return pages[slug]
}

function cleanText(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : ""
}

function safeHref(value: string) {
  if (value.startsWith("/") && !value.startsWith("//")) return value
  if (value.startsWith("mailto:") && !/javascript|data:/i.test(value)) return value
  if (value.startsWith("https://")) return value
  return ""
}

export function parseInstitutionalPage(slug: InstitutionalSlug, body: unknown): InstitutionalPageContent | null {
  if (!body || typeof body !== "object") return null
  const raw = body as Record<string, unknown>
  const defaults = getInstitutionalDefaults(slug)
  const title = cleanText(raw.title, 160)
  const subtitle = cleanText(raw.subtitle, 500)
  if (!title || !subtitle) return null

  const sections = Array.isArray(raw.sections)
    ? raw.sections
        .slice(0, 12)
        .map((section) => {
          if (!section || typeof section !== "object") return null
          const item = section as Record<string, unknown>
          const sectionTitle = cleanText(item.title, 160)
          const sectionBody = cleanText(item.body, 4000)
          if (!sectionTitle || !sectionBody) return null
          return { title: sectionTitle, body: sectionBody }
        })
        .filter((section): section is InstitutionalSection => section !== null)
    : defaults.sections

  const highlights = Array.isArray(raw.highlights)
    ? raw.highlights
        .slice(0, 8)
        .map((item) => {
          if (!item || typeof item !== "object") return null
          const card = item as Record<string, unknown>
          const cardTitle = cleanText(card.title, 80)
          const text = cleanText(card.text, 240)
          if (!cardTitle || !text) return null
          return { title: cardTitle, text }
        })
        .filter((item): item is InstitutionalHighlight => item !== null)
    : defaults.highlights

  return {
    slug,
    title,
    subtitle,
    description: cleanText(raw.description, 300) || defaults.description,
    sections: sections.length ? sections : defaults.sections,
    highlights,
    ctaLabel: cleanText(raw.ctaLabel, 80),
    ctaHref: safeHref(cleanText(raw.ctaHref, 240)),
    formTitle: cleanText(raw.formTitle, 160),
    formIntro: cleanText(raw.formIntro, 2000),
    heroImage: cleanText(raw.heroImage, 500),
  }
}

export async function getInstitutionalPage(slug: InstitutionalSlug): Promise<InstitutionalPageContent> {
  const defaults = getInstitutionalDefaults(slug)
  if (!process.env.MONGODB_URI?.trim()) return defaults
  try {
    const db = await getDb()
    const doc = await db.collection("site_institutional_pages").findOne({ slug })
    if (!doc) return defaults
    return parseInstitutionalPage(slug, doc) ?? defaults
  } catch (error) {
    console.error("[institutional page]", error)
    return defaults
  }
}
