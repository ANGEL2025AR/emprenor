import type { Metadata } from "next"
import Link from "next/link"
import { InstitutionalPage } from "@/components/public/institutional-page"
import { EMPRENOR_LEGAL } from "@/lib/company/constants"
import { buildPageMetadata } from "@/lib/site/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "Código de ética",
  description: "Compromisos de integridad, anticorrupción y conducta profesional de EMPRENOR.",
  path: "/codigo-etica",
})

export default function CodigoEticaPage() {
  return (
    <InstitutionalPage
      slug="codigo-etica"
      title="Código de ética e integridad"
      subtitle="Compromisos de integridad en contratos, obra pública y relaciones con clientes, personal y proveedores."
      sections={[
        {
          title: "Principios",
          content: (
            <ul className="list-disc pl-5 space-y-2">
              <li>Integridad en licitaciones, contratos y relaciones con el sector público.</li>
              <li>Cero tolerancia a sobornos, cohecho y conflictos de interés no declarados.</li>
              <li>Respeto a derechos humanos, diversidad y comunidades locales del NOA.</li>
              <li>Seguridad y salud ocupacional como prioridad en toda obra.</li>
            </ul>
          ),
        },
        {
          title: "Proveedores y subcontratos",
          content: (
            <p>
              Quienes participan en una obra se rigen por este código, por la normativa laboral argentina y por lo que
              pida el contrato. La ART se revisa cuando esa normativa o el contrato lo exigen.
            </p>
          ),
        },
        {
          title: "Reporte de conducta",
          content: (
            <p>
              Cualquier persona puede reportar de forma confidencial o anónima conductas contrarias a este código a
              través de nuestra{" "}
              <Link href="/linea-etica" className="text-emerald-700 font-medium underline">
                línea de ética
              </Link>{" "}
              o por email a{" "}
              <a href={`mailto:${EMPRENOR_LEGAL.emailEtica}`} className="text-emerald-700 underline">
                {EMPRENOR_LEGAL.emailEtica}
              </a>
              . No se admitirán represalias contra quien reporte de buena fe.
            </p>
          ),
        },
        {
          title: "Cumplimiento en obra",
          content: (
            <p>
              Si el contrato prevé un control de nómina, capacitaciones o incidentes, esos registros se llevan para esa
              obra y se comparten con quien el contrato indique.
            </p>
          ),
        },
      ]}
      cta={{ label: "Acceder a la línea de ética", href: "/linea-etica" }}
    />
  )
}
