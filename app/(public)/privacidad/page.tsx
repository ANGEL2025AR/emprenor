import type { Metadata } from "next"
import { InstitutionalPage } from "@/components/public/institutional-page"
import { EMPRENOR_LEGAL } from "@/lib/company/constants"
import { buildPageMetadata } from "@/lib/site/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "Política de privacidad",
  description: "Tratamiento de datos personales conforme a la Ley 25.326 de Protección de Datos Personales de Argentina.",
  path: "/privacidad",
})

export default function PrivacidadPage() {
  return (
    <InstitutionalPage
      slug="privacidad"
      title="Política de privacidad"
      subtitle={`${EMPRENOR_LEGAL.razonSocial} respeta su privacidad y protege los datos personales que nos confía.`}
      sections={[
        {
          title: "Responsable del tratamiento",
          content: (
            <>
              <p>
                El responsable es <strong>{EMPRENOR_LEGAL.razonSocial}</strong>, con domicilio en{" "}
                {EMPRENOR_LEGAL.domicilioLegal}. Contacto:{" "}
                <a href={`mailto:${EMPRENOR_LEGAL.emailGeneral}`} className="text-emerald-700 underline">
                  {EMPRENOR_LEGAL.emailGeneral}
                </a>
                .
              </p>
            </>
          ),
        },
        {
          title: "Marco legal",
          content: (
            <p>
              Esta política se rige por la Ley N.º 25.326 de Protección de Datos Personales, su normativa complementaria y
              las buenas prácticas internacionales aplicables a contratistas de obras públicas y organismos de cooperación.
            </p>
          ),
        },
        {
          title: "Datos que recopilamos",
          content: (
            <ul className="list-disc pl-5 space-y-2">
              <li>Datos de identificación y contacto (formularios web, registro de clientes, portales).</li>
              <li>Datos laborales en nóminas de obra (CUIL, rol, capacitaciones) cuando el contrato lo exija.</li>
              <li>Datos técnicos de navegación (cookies, logs de seguridad).</li>
            </ul>
          ),
        },
        {
          title: "Finalidades",
          content: (
            <ul className="list-disc pl-5 space-y-2">
              <li>Gestión comercial, contractual y de obras.</li>
              <li>Cumplimiento legal, SST, auditorías de donantes y sector público.</li>
              <li>Comunicaciones operativas con clientes y empleados.</li>
            </ul>
          ),
        },
        {
          title: "Sus derechos",
          content: (
            <p>
              Puede acceder, rectificar, actualizar o suprimir sus datos escribiendo a {EMPRENOR_LEGAL.emailGeneral}. La
              Agencia de Acceso a la Información Pública es el órgano de control de la Ley 25.326.
            </p>
          ),
        },
        {
          title: "Conservación y seguridad",
          content: (
            <p>
              Conservamos los datos el tiempo necesario para la obra y obligaciones legales. Aplicamos controles de acceso
              por roles, cifrado en tránsito (HTTPS) y registros de auditoría en el sistema de gestión.
            </p>
          ),
        },
      ]}
      cta={{ label: "Consultar sobre mis datos", href: "/contacto" }}
    />
  )
}
