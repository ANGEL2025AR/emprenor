import type { Metadata } from "next"
import { InstitutionalPage } from "@/components/public/institutional-page"

export const metadata: Metadata = {
  title: "Seguridad y salud ocupacional | EMPRENOR",
  description: "Política SST, ART y cultura de prevención en obra — EMPRENOR NOA.",
}

export default function SeguridadSaludPage() {
  return (
    <InstitutionalPage
      slug="seguridad-y-salud"
      title="Seguridad y salud en el trabajo"
      subtitle="Construimos con cultura de prevención, alineada a buenas prácticas ISO 45001 y normativa argentina."
      sections={[
        {
          title: "Política de SST",
          content: (
            <p>
              EMPRENOR prioriza la vida y la integridad física por sobre plazos y costos. Toda obra cuenta con planificación
              de riesgos, inducción de personal, EPP obligatorio y registro de incidentes con investigación y acciones
              correctivas.
            </p>
          ),
        },
        {
          title: "ART y habilitaciones",
          content: (
            <p>
              Verificamos cobertura de ART y seguros antes del ingreso a obra. Los trabajadores acceden a credencial digital
              desde el portal del empleado cuando RRHH valida el legajo.
            </p>
          ),
        },
        {
          title: "Capacitación e inducción",
          content: (
            <ul className="list-disc pl-5 space-y-2">
              <li>Inducción general y específica por frente de obra.</li>
              <li>Capacitación en trabajo en altura, espacios confinados y energías peligrosas según el proyecto.</li>
              <li>Registro de firmas en nómina de cumplimiento cuando el contrato lo requiere.</li>
            </ul>
          ),
        },
        {
          title: "Incidentes y mejora continua",
          content: (
            <p>
              Todo incidente o cuasi-incidente se registra, clasifica y cierra con medidas verificables. Los clientes con
              portal de cumplimiento pueden auditar el estado en tiempo real.
            </p>
          ),
        },
      ]}
      cta={{ label: "Solicitar información de obra", href: "/contacto" }}
    />
  )
}
