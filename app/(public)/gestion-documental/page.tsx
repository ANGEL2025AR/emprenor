import type { Metadata } from "next"
import Link from "next/link"
import { InstitutionalPage } from "@/components/public/institutional-page"
import { EMPRENOR_BRAND, EMPRENOR_LEGAL } from "@/lib/company/constants"
import { buildPageMetadata } from "@/lib/site/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "Gestión documental",
  description: `Documentación de obra y trazabilidad — ${EMPRENOR_BRAND.siglas}.`,
  path: "/gestion-documental",
})

export default function GestionDocumentalPage() {
  return (
    <InstitutionalPage
      title="Gestión documental"
      subtitle="Trazabilidad de documentos de obra, legajo de personal y entregables al cliente — según alcance contractual."
      sections={[
        {
          title: "Identificación",
          content: (
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Marca:</strong> {EMPRENOR_BRAND.nombreExtendido}
              </li>
              <li>
                <strong>Contacto comercial:</strong>{" "}
                <a href={`mailto:${EMPRENOR_LEGAL.emailGeneral}`} className="text-emerald-700 underline">
                  {EMPRENOR_LEGAL.emailGeneral}
                </a>
              </li>
              <li>
                <strong>Licitaciones:</strong>{" "}
                <a href={`mailto:${EMPRENOR_LEGAL.emailLicitaciones}`} className="text-emerald-700 underline">
                  {EMPRENOR_LEGAL.emailLicitaciones}
                </a>
              </li>
            </ul>
          ),
        },
        {
          title: "Alcance documental",
          content: (
            <p>
              Según el contrato, EMPRENOR puede registrar y entregar planos de obra, actas de reunión, avances de
              cronograma, certificados de materiales, registros de SST y documentación exigida por el pliego o el
              comitente.
            </p>
          ),
        },
        {
          title: "Obra pública",
          content: (
            <p>
              Para organismos estatales, la documentación se ajusta al pliego y al manual de procedimientos del
              contratante. Consulte también{" "}
              <Link href="/licitaciones" className="text-emerald-700 underline">
                Licitaciones
              </Link>{" "}
              y{" "}
              <Link href="/seguridad-y-salud" className="text-emerald-700 underline">
                Seguridad y salud
              </Link>
              .
            </p>
          ),
        },
        {
          title: "Solicitud de legajo",
          content: (
            <p>
              Empresas y organismos pueden solicitar documentación de respaldo para precalificación o auditoría
              escribiendo a{" "}
              <a href={`mailto:${EMPRENOR_LEGAL.emailLicitaciones}`} className="text-emerald-700 underline">
                {EMPRENOR_LEGAL.emailLicitaciones}
              </a>
              , indicando obra, pliego o proceso de contratación.
            </p>
          ),
        },
      ]}
      cta={{ label: "Contactar para licitaciones", href: "/contacto" }}
    />
  )
}
