import type { Metadata } from "next"
import { InstitutionalPage } from "@/components/public/institutional-page"

export const metadata: Metadata = {
  title: "Sostenibilidad | EMPRENOR",
  description: "Compromiso ambiental y social en obras del NOA — compras locales, comunidades y buenas prácticas.",
}

export default function SostenibilidadPage() {
  return (
    <InstitutionalPage
      slug="sostenibilidad"
      title="Sostenibilidad y comunidad"
      subtitle="Obras que generan empleo local, respetan el entorno y cumplen salvaguardas de donantes y Estado."
      sections={[
        {
          title: "Enfoque",
          content: (
            <p>
              Integramos criterios ambientales y sociales en la planificación de obra, especialmente en proyectos con
              organismos internacionales, municipios y empresas con políticas ESG.
            </p>
          ),
        },
        {
          title: "Compras locales",
          content: (
            <p>
              Registramos y reportamos compras a proveedores de la región cuando el contrato lo exige, favoreciendo la
              economía del NOA y la trazabilidad para auditorías.
            </p>
          ),
        },
        {
          title: "Comunidades y patrimonio",
          content: (
            <p>
              Capacitación en patrimonio cultural, género y pueblos originarios según perfil del cliente contratante, con
              documentación verificable en el portal de cumplimiento.
            </p>
          ),
        },
        {
          title: "Gestión ambiental de obra",
          content: (
            <ul className="list-disc pl-5 space-y-2">
              <li>Plan de residuos y segregación en obra.</li>
              <li>Control de polvo, ruido y derrames según matriz del proyecto.</li>
              <li>Mejora continua con indicadores por obra.</li>
            </ul>
          ),
        },
      ]}
      cta={{ label: "Ver proyectos destacados", href: "/proyectos" }}
    />
  )
}
