import type { Metadata } from "next"
import Link from "next/link"
import { InstitutionalPage } from "@/components/public/institutional-page"
import { EMPRENOR_LEGAL } from "@/lib/company/constants"

export const metadata: Metadata = {
  title: "Código de ética | EMPRENOR",
  description: "Compromisos de integridad, anticorrupción y conducta profesional de EMPRENOR.",
}

export default function CodigoEticaPage() {
  return (
    <InstitutionalPage
      slug="codigo-etica"
      title="Código de ética e integridad"
      subtitle="Nuestro compromiso con la transparencia, la seguridad y el respeto — alineado a estándares internacionales de contratistas."
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
              Exigimos a proveedores y subcontratistas el cumplimiento de este código, ART vigente y normativa laboral
              argentina. Las compras locales se registran con transparencia en obras con cumplimiento institucional.
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
              En proyectos con organismos internacionales, Estado o grandes empresas, aplicamos checklists de
              cumplimiento (nómina, capacitaciones, libro de quejas, incidentes) auditables desde el portal del cliente.
            </p>
          ),
        },
      ]}
      cta={{ label: "Acceder a la línea de ética", href: "/linea-etica" }}
    />
  )
}
