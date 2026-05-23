import type { Metadata } from "next"
import { InstitutionalPage } from "@/components/public/institutional-page"
import {
  EMPRENOR_LEGAL,
  RM_LEGAL,
  EMPRENOR_BRAND,
  getMarcaLegalNotice,
} from "@/lib/company/constants"
import { buildPageMetadata } from "@/lib/site/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "Aviso legal | EMPRENOR",
  description: `Titular legal ${RM_LEGAL.razonSocial}, CUIT ${RM_LEGAL.cuit}. ${EMPRENOR_BRAND.siglas} — ${EMPRENOR_BRAND.significadoSiglas}.`,
  path: "/aviso-legal",
})

export default function AvisoLegalPage() {
  return (
    <InstitutionalPage
      slug="aviso-legal"
      title="Aviso legal"
      subtitle={getMarcaLegalNotice()}
      sections={[
        {
          title: "Titular legal",
          content: (
            <ul className="list-none space-y-1">
              <li>
                <strong>Razón social:</strong> {RM_LEGAL.razonSocial}
              </li>
              <li>
                <strong>Forma jurídica:</strong> {RM_LEGAL.formaJuridica}
              </li>
              <li>
                <strong>CUIT:</strong> {EMPRENOR_LEGAL.cuit}
              </li>
              <li>
                <strong>Constitución:</strong> {RM_LEGAL.fechaConstitucion}
              </li>
              <li>
                <strong>Domicilio fiscal:</strong> {RM_LEGAL.domicilioFiscal}
              </li>
              <li>
                <strong>IVA:</strong> {RM_LEGAL.ivaCondicion}
              </li>
              <li>
                <strong>Ingresos Brutos:</strong> {RM_LEGAL.iibb.regimen} — N.º {RM_LEGAL.iibb.numeroInscripcion}
              </li>
              <li>
                <strong>Contacto web:</strong>{" "}
                <a href={`mailto:${EMPRENOR_LEGAL.emailGeneral}`} className="text-emerald-700 underline">
                  {EMPRENOR_LEGAL.emailGeneral}
                </a>
              </li>
            </ul>
          ),
        },
        {
          title: "Marca comercial EMPRENOR",
          content: (
            <p>
              <strong>{EMPRENOR_BRAND.siglas}</strong> ({EMPRENOR_BRAND.nombreExtendido}) es la marca bajo la cual{" "}
              {RM_LEGAL.razonSocial} comercializa
              servicios de construcción, remodelación e instalaciones en el NOA. Las oficinas operativas en Salta, Tartagal
              y Campamento Vespucio no modifican el domicilio fiscal indicado arriba.
            </p>
          ),
        },
        {
          title: "Actividad registrada (construcción)",
          content: (
            <p>
              Código AFIP {RM_LEGAL.actividades.construccion.codigo}: {RM_LEGAL.actividades.construccion.descripcion}.
              Inicio de actividad: {RM_LEGAL.actividades.construccion.fechaInicio}. Otras actividades del grupo constan en
              constancia de inscripción AFIP.
            </p>
          ),
        },
        {
          title: "Naturaleza de la información",
          content: (
            <p>
              Los textos, imágenes y datos de este sitio tienen carácter informativo y comercial general. No constituyen
              oferta contractual, asesoramiento legal ni garantía de resultados. Presupuestos, plazos, garantías y
              alcances se definen únicamente en propuestas y contratos firmados.
            </p>
          ),
        },
        {
          title: "Publicidad y veracidad",
          content: (
            <p>
              Los datos fiscales publicados provienen de constancias AFIP e IIBB vigentes al momento de carga. No se
              publican testimonios, certificaciones ni estadísticas sin respaldo verificable. Proyectos en{" "}
              <a href="/proyectos" className="text-emerald-700 underline">
                /proyectos
              </a>{" "}
              son los autorizados para difusión.
            </p>
          ),
        },
        {
          title: "Propiedad intelectual",
          content: (
            <p>
              La marca EMPRENOR, logotipos y contenidos de este sitio pertenecen a {RM_LEGAL.razonSocial} o se usan con
              autorización. Queda prohibida su reproducción sin consentimiento escrito, salvo citas breves con enlace a la
              fuente.
            </p>
          ),
        },
        {
          title: "Legislación aplicable",
          content: (
            <p>
              Este aviso se rige por las leyes de la República Argentina. Para tratamiento de datos personales, consulte la{" "}
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
