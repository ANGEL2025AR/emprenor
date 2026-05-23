import type { Metadata } from "next"
import Link from "next/link"
import { InstitutionalPage } from "@/components/public/institutional-page"
import { EMPRENOR_LEGAL } from "@/lib/company/constants"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Trabajá con nosotros | EMPRENOR",
  description: "Sumate al equipo EMPRENOR en el NOA. Obras, seguridad y desarrollo profesional.",
}

export default function TrabajaConNosotrosPage() {
  return (
    <InstitutionalPage
      slug="trabaja-con-nosotros"
      title="Trabajá con nosotros"
      subtitle="Construí tu carrera en una empresa del NOA con portal digital, ART y cultura de seguridad."
      sections={[
        {
          title: "Perfiles que buscamos",
          content: (
            <ul className="list-disc pl-5 space-y-2">
              <li>Maestros mayores, capataces y supervisores de obra.</li>
              <li>Oficiales y ayudantes: albañilería, hierro, electricidad, gas, pintura.</li>
              <li>Ingeniería, arquitectura, HSE y administración de obra.</li>
            </ul>
          ),
        },
        {
          title: "Beneficios EMPRENOR",
          content: (
            <ul className="list-disc pl-5 space-y-2">
              <li>Portal del empleado: recibos, solicitudes, ART y comunicaciones.</li>
              <li>Capacitación en seguridad y cumplimiento en obras exigentes.</li>
              <li>Presencia en Salta, Jujuy, Tucumán y Formosa.</li>
            </ul>
          ),
        },
        {
          title: "Cómo postularse",
          content: (
            <p>
              Enviá tu CV a{" "}
              <a href={`mailto:${EMPRENOR_LEGAL.emailRrhh}`} className="text-emerald-700 underline font-medium">
                {EMPRENOR_LEGAL.emailRrhh}
              </a>{" "}
              o acercate a nuestras oficinas en Salta Capital. Si ya sos empleado, ingresá al{" "}
              <Link href="/login" className="text-emerald-700 underline">
                portal
              </Link>
              .
            </p>
          ),
        },
      ]}
      cta={{ label: "Enviar CV por email", href: `mailto:${EMPRENOR_LEGAL.emailRrhh}` }}
    />
  )
}
