import type { Metadata } from "next"
import Link from "next/link"
import { InstitutionalPage } from "@/components/public/institutional-page"
import { EMPRENOR_LEGAL, RM_LEGAL, EMPRENOR_BRAND } from "@/lib/company/constants"
import { buildPageMetadata } from "@/lib/site/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: `Gestión documental | ${EMPRENOR_BRAND.siglas}`,
  description:
    `Documentación de obra y trazabilidad — ${EMPRENOR_BRAND.siglas}.`,
  path: "/gestion-documental",
})

export default function GestionDocumentalPage() {
  return (
    <InstitutionalPage
      slug="gestion-documental"
      title="Gestión documental"
      subtitle="Trazabilidad de documentos de obra, legajo de personal y entregables al cliente — según alcance contractual."
      sections={[
        {
          title: "Identificación del titular",
          content: (
            <ul className="list-disc pl-5 space-y-2">
              <li>
                {EMPRENOR_BRAND.siglas} · Titular {RM_LEGAL.razonSocial}
              </li>
              <li>CUIT {EMPRENOR_LEGAL.cuit}</li>
              <li>Constancias AFIP (F960 / inscripción) e IIBB Convenio Multilateral bajo solicitud</li>
            </ul>
          ),
        },
        {
          title: "Principios",
          content: (
            <ul className="list-disc pl-5 space-y-2">
              <li>Cada documento tiene responsable, fecha y versión cuando el contrato lo exige.</li>
              <li>Los archivos sensibles (legajo, ART, datos personales) se tratan según la{" "}
                <Link href="/privacidad" className="text-emerald-700 underline">política de privacidad</Link>.
              </li>
              <li>La documentación para licitaciones se entrega bajo solicitud formal al área correspondiente.</li>
            </ul>
          ),
        },
        {
          title: "Documentación habitual en obra",
          content: (
            <ul className="list-disc pl-5 space-y-2">
              <li>Contrato, presupuesto y cronograma acordados.</li>
              <li>Planos de obra y modificaciones aprobadas por escrito.</li>
              <li>Actas de reunión, inspecciones y conformidades parciales o finales.</li>
              <li>Registros de SST: inducciones, EPP, incidentes (cuando aplique al contrato).</li>
              <li>Certificados de especialidades reguladas (gas, electricidad, etc.) cuando la normativa y el contrato lo requieran.</li>
              <li>Comprobantes de compras o materiales cuando el pliego lo solicite.</li>
            </ul>
          ),
        },
        {
          title: "Solicitudes para licitaciones y sector público",
          content: (
            <p>
              Ante requerimiento del organismo contratante, podemos acreditar — en la medida de lo vigente — constancias de
              ART, pólizas, referencias de obra, equipo técnico y las políticas publicadas en este sitio. Escríbanos a{" "}
              <a href={`mailto:${EMPRENOR_LEGAL.emailLicitaciones}`} className="text-emerald-700 underline">
                {EMPRENOR_LEGAL.emailLicitaciones}
              </a>{" "}
              indicando pliego, organismo y plazos. Consulte también{" "}
              <Link href="/licitaciones" className="text-emerald-700 underline">Licitaciones</Link>.
            </p>
          ),
        },
        {
          title: "Plazos y formato",
          content: (
            <p>
              Los plazos de entrega documental se acuerdan por contrato. Por defecto, copias digitales en formatos estándar
              (PDF). Originales o legalizaciones solo cuando el pliego lo exija expresamente.
            </p>
          ),
        },
        {
          title: "Conservación",
          content: (
            <p>
              Los plazos de conservación de documentación de obra y legajo se rigen por contrato, normativa laboral y
              obligaciones fiscales aplicables. Al finalizar la relación contractual, se define con el cliente qué copias
              se entregan, archivan o destruyen conforme a la ley.
            </p>
          ),
        },
      ]}
      cta={{ label: "Solicitar documentación", href: "/contacto" }}
    />
  )
}
