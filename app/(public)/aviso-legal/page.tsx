import type { Metadata } from "next"
import { InstitutionalPage } from "@/components/public/institutional-page"
import { EMPRENOR_BRAND, EMPRENOR_LEGAL, EMPRENOR_OFICINAS } from "@/lib/company/constants"
import { buildPageMetadata } from "@/lib/site/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "Aviso legal",
  description: `Aviso legal y datos de contacto de ${EMPRENOR_BRAND.siglas} — construcción y servicios en el NOA.`,
  path: "/aviso-legal",
})

export default function AvisoLegalPage() {
  return (
    <InstitutionalPage
      title="Aviso legal"
      subtitle="Datos de la marca, contacto y condiciones de uso del sitio web."
      sections={[
        {
          title: "Marca y operación",
          content: (
            <ul className="list-none space-y-1">
              <li>
                <strong>Marca comercial:</strong> {EMPRENOR_BRAND.nombreExtendido} ({EMPRENOR_BRAND.siglas})
              </li>
              <li>
                <strong>Actividad:</strong> Construcción, remodelación e instalaciones en el NOA
              </li>
              <li>
                <strong>Operación documentada desde:</strong> {EMPRENOR_LEGAL.operacionDesde}
              </li>
              <li>
                <strong>Contacto:</strong>{" "}
                <a href={`mailto:${EMPRENOR_LEGAL.emailGeneral}`} className="text-emerald-700 underline">
                  {EMPRENOR_LEGAL.emailGeneral}
                </a>
              </li>
            </ul>
          ),
        },
        {
          title: "Oficinas operativas",
          content: (
            <ul className="list-disc pl-5 space-y-2">
              {EMPRENOR_OFICINAS.map((of) => (
                <li key={of.nombre}>
                  <strong>{of.nombre}:</strong> {of.direccion}
                </li>
              ))}
            </ul>
          ),
        },
        {
          title: "Datos impositivos",
          content: (
            <p>
              {EMPRENOR_LEGAL.notaImpositiva}
              {EMPRENOR_LEGAL.cuit ? (
                <>
                  {" "}
                  CUIT publicado: <strong>{EMPRENOR_LEGAL.cuit}</strong>.
                </>
              ) : null}
            </p>
          ),
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
              La marca EMPRENOR, logotipos y contenidos de este sitio están protegidos. Queda prohibida su reproducción
              sin consentimiento escrito, salvo citas breves con enlace a la fuente.
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
