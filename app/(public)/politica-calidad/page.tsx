import type { Metadata } from "next"
import Link from "next/link"
import { InstitutionalPage } from "@/components/public/institutional-page"
import { EMPRENOR_BRAND } from "@/lib/company/constants"
import { buildPageMetadata } from "@/lib/site/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "Política de calidad",
  description: `Compromisos de calidad en obra — ${EMPRENOR_BRAND.siglas}, NOA.`,
  path: "/politica-calidad",
})

export default function PoliticaCalidadPage() {
  return (
    <InstitutionalPage
      slug="politica-calidad"
      title="Política de calidad"
      subtitle="Compromisos verificables en planificación, ejecución y entrega de obra. No implica certificación ISO salvo acreditación expresa por escrito."
      sections={[
        {
          title: "Alcance",
          content: (
            <p>
              Esta política aplica a los servicios de construcción, remodelación e instalaciones que{" "}
              {EMPRENOR_BRAND.siglas} presta servicios en Salta, Jujuy, Tucumán y Formosa.
              Los requisitos específicos de cada contrato — pliegos, normas técnicas, ensayos — prevalecen sobre este
              documento general.
            </p>
          ),
        },
        {
          title: "Compromisos",
          content: (
            <ul className="list-disc pl-5 space-y-2">
              <li>Ejecutar la obra conforme a planos, especificaciones y presupuesto acordados por escrito.</li>
              <li>Utilizar materiales acordados con el cliente y, cuando corresponda, con respaldo de fichas técnicas del fabricante.</li>
              <li>Realizar controles de calidad en hitos definidos (replanteo, estructura, instalaciones, terminaciones).</li>
              <li>Registrar desvíos y no conformidades con acciones correctivas antes del cierre de etapa.</li>
              <li>Entregar documentación de obra acordada en contrato (actas, certificados de especialidades reguladas, manuales de uso).</li>
            </ul>
          ),
        },
        {
          title: "Lo que no afirmamos",
          content: (
            <p>
              {EMPRENOR_BRAND.siglas} no publica certificaciones ISO, IRAM o INTI de sistema de gestión salvo que exista certificado vigente
              y el cliente lo solicite. Las garantías, plazos y alcances se establecen en cada contrato; no hay garantía
              universal publicada fuera de ese marco.
            </p>
          ),
        },
        {
          title: "Inspecciones y conformidad del cliente",
          content: (
            <p>
              El cliente o el organismo contratante puede inspeccionar frentes de obra en los términos del contrato. Para
              obra con portal de cumplimiento habilitado, el estado documental y de SST puede consultarse según permisos
              otorgados.
            </p>
          ),
        },
        {
          title: "Documentos relacionados",
          content: (
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <Link href="/gestion-documental" className="text-emerald-700 underline">
                  Gestión documental
                </Link>
              </li>
              <li>
                <Link href="/seguridad-y-salud" className="text-emerald-700 underline">
                  Seguridad y salud en el trabajo
                </Link>
              </li>
              <li>
                <Link href="/codigo-etica" className="text-emerald-700 underline">
                  Código de ética
                </Link>
              </li>
            </ul>
          ),
        },
      ]}
      cta={{ label: "Consultar sobre un proyecto", href: "/contacto" }}
    />
  )
}
