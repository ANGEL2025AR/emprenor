import type { Metadata } from "next"
import Link from "next/link"
import { InstitutionalPage } from "@/components/public/institutional-page"
import { EMPRENOR_BRAND, EMPRENOR_LEGAL, EMPRENOR_TITULAR } from "@/lib/company/constants"
import { buildPageMetadata } from "@/lib/site/page-metadata"
import { contactFormUrl } from "@/lib/site/urls"
import { GESTION_EMPRENOR } from "@/lib/site/gestion-emprenor-portal"

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
                <strong>Marca:</strong> {EMPRENOR_BRAND.nombreExtendido} ({EMPRENOR_BRAND.siglas})
              </li>
              <li>
                <strong>Titular:</strong> {EMPRENOR_TITULAR.nombreCompleto} — CUIT {EMPRENOR_LEGAL.cuit}
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
          title: "Portal digital en obra",
          content: (
            <div className="space-y-3">
              <p>
                <strong>{GESTION_EMPRENOR.product}</strong> es la plataforma online de las marcas EMPRENOR, operada por{" "}
                {EMPRENOR_TITULAR.nombreCompleto} (CUIT {EMPRENOR_LEGAL.cuit}). Clientes y equipos acceden a documentos,
                consultas, cuenta corriente y aprobaciones por obra.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <a
                    href={GESTION_EMPRENOR.homeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 underline"
                  >
                    Conocer {GESTION_EMPRENOR.product}
                  </a>
                </li>
                <li>
                  <a href={GESTION_EMPRENOR.loginUrl} className="text-emerald-700 underline">
                    Iniciar sesión
                  </a>
                </li>
                <li>
                  <a href={GESTION_EMPRENOR.registerUrl} className="text-emerald-700 underline">
                    Crear cuenta gratis
                  </a>
                </li>
              </ul>
            </div>
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
      cta={{ label: "Contactar para licitaciones", href: contactFormUrl() }}
    />
  )
}
