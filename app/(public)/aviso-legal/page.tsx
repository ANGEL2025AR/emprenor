import type { Metadata } from "next"
import { InstitutionalPage } from "@/components/public/institutional-page"
import {
  EMPRENOR_BRAND,
  EMPRENOR_LEGAL,
  EMPRENOR_OFICINAS,
  EMPRENOR_PROVINCIAS,
  EMPRENOR_TITULAR,
  EMPRENOR_TIPOS_OBRA,
  getMarcaLegalNotice,
} from "@/lib/company/constants"
import { buildPageMetadata } from "@/lib/site/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "Aviso legal",
  description: `Aviso legal de ${EMPRENOR_BRAND.siglas} — marca comercial de ${EMPRENOR_TITULAR.nombreCompleto}.`,
  path: "/aviso-legal",
})

export default function AvisoLegalPage() {
  return (
    <InstitutionalPage
      title="Aviso legal"
      subtitle={getMarcaLegalNotice()}
      sections={[
        {
          title: "Titular y marca",
          content: (
            <ul className="list-none space-y-2">
              <li>
                <strong>Marca comercial:</strong> {EMPRENOR_BRAND.nombreExtendido} ({EMPRENOR_BRAND.siglas})
              </li>
              <li>
                <strong>Titular:</strong> {EMPRENOR_TITULAR.nombreCompleto} ({EMPRENOR_TITULAR.formaJuridica})
              </li>
              <li>
                <strong>CUIT:</strong> {EMPRENOR_LEGAL.cuit}
              </li>
              <li>
                <strong>Condición IVA:</strong> {EMPRENOR_LEGAL.condicionIva}
              </li>
              <li>
                <strong>Actividad:</strong> Construcción, remodelación e instalaciones en el NOA
              </li>
              <li>
                <strong>Operación documentada desde:</strong> {EMPRENOR_LEGAL.operacionDesde}
              </li>
            </ul>
          ),
        },
        {
          title: "Domicilios",
          content: (
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Domicilio fiscal y comercial:</strong> {EMPRENOR_LEGAL.domicilioFiscal}
              </li>
              {EMPRENOR_OFICINAS.map((of) => (
                <li key={of.nombre}>
                  <strong>{of.nombre}:</strong> {of.direccion}
                </li>
              ))}
            </ul>
          ),
        },
        {
          title: "Cobertura y tipos de obra",
          content: (
            <>
              <p className="mb-3">
                Prestamos servicios en {EMPRENOR_PROVINCIAS.join(", ")} para los siguientes segmentos:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                {EMPRENOR_TIPOS_OBRA.map((tipo) => (
                  <li key={tipo}>{tipo}</li>
                ))}
              </ul>
            </>
          ),
        },
        {
          title: "Contacto",
          content: (
            <ul className="list-none space-y-1">
              <li>
                <strong>Teléfono:</strong>{" "}
                <a href={`tel:${EMPRENOR_LEGAL.telefonoPrincipalHref}`} className="text-emerald-700 underline">
                  {EMPRENOR_LEGAL.telefonoPrincipal}
                </a>
              </li>
              <li>
                <strong>Email:</strong>{" "}
                <a href={`mailto:${EMPRENOR_LEGAL.emailGeneral}`} className="text-emerald-700 underline">
                  {EMPRENOR_LEGAL.emailGeneral}
                </a>
              </li>
            </ul>
          ),
        },
        {
          title: "Datos impositivos",
          content: <p>{EMPRENOR_LEGAL.notaImpositiva}</p>,
        },
        {
          title: "Naturaleza de la información",
          content: (
            <p>
              Los textos, imágenes y datos de este sitio tienen carácter informativo y comercial general. No constituyen
              oferta contractual ni garantía de resultados. Presupuestos, plazos y alcances se definen en propuestas y
              contratos firmados.
            </p>
          ),
        },
        {
          title: "Propiedad intelectual",
          content: (
            <p>
              La marca EMPRENOR, logotipos y contenidos de este sitio pertenecen al titular o se usan con autorización.
              Queda prohibida su reproducción sin consentimiento escrito, salvo citas breves con enlace a la fuente.
            </p>
          ),
        },
        {
          title: "Legislación aplicable",
          content: (
            <p>
              Este aviso se rige por las leyes de la República Argentina. Para datos personales, consulte la{" "}
              <a href="/privacidad" className="text-emerald-700 underline">
                política de privacidad
              </a>
              .
            </p>
          ),
        },
      ]}
    />
  )
}
