import type { Metadata } from "next"
import Link from "next/link"
import { InstitutionalPage } from "@/components/public/institutional-page"
import { EMPRENOR_LEGAL, RM_LEGAL, EMPRENOR_BRAND } from "@/lib/company/constants"
import { Card, CardContent } from "@/components/ui/card"
import { FileCheck, Shield, Users, ClipboardList } from "lucide-react"

export const metadata: Metadata = {
  title: "Licitaciones y sector público | EMPRENOR",
  description: "Documentación para licitadores: cumplimiento, SST, referencias y portales de obra en el NOA.",
}

export default function LicitacionesPage() {
  return (
    <>
      <InstitutionalPage
        slug="licitaciones"
        title="Licitaciones y sector público"
        subtitle="Acompañamos a municipios y organismos provinciales con obra ejecutada y cumplimiento documentado según pliego."
        sections={[
          {
            title: "Datos fiscales del titular",
            content: (
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Razón social:</strong> {RM_LEGAL.razonSocial}
                </li>
                <li>
                  <strong>Marca comercial:</strong> {EMPRENOR_BRAND.siglas} ({EMPRENOR_BRAND.nombreExtendido})
                </li>
                <li>
                  <strong>CUIT:</strong> {EMPRENOR_LEGAL.cuit}
                </li>
                <li>
                  <strong>IVA:</strong> {RM_LEGAL.ivaCondicion}
                </li>
                <li>
                  <strong>IIBB:</strong> {RM_LEGAL.iibb.regimen} (N.º {RM_LEGAL.iibb.numeroInscripcion})
                </li>
                <li>
                  <strong>Domicilio fiscal:</strong> {RM_LEGAL.domicilioFiscal}
                </li>
                <li>
                  <strong>Actividad construcción:</strong> {RM_LEGAL.actividades.construccion.codigo} —{" "}
                  {RM_LEGAL.actividades.construccion.descripcion}
                </li>
              </ul>
            ),
          },
          {
            title: "Capacidades",
            content: (
              <ul className="list-disc pl-5 space-y-2">
                <li>Obras educativas, sanitarias, administrativas e industriales en Salta, Jujuy, Tucumán y Formosa.</li>
                <li>Portal de cumplimiento por obra: nómina, ART, documentos, quejas e incidentes.</li>
                <li>Exportación de paquetes de auditoría para perióodos mensuales.</li>
              </ul>
            ),
          },
          {
            title: "Documentación habitual",
            content: (
              <p>
                Ante solicitud enviamos constancias de ART, pólizas, referencias de obra, equipo técnico y políticas de
                ética, privacidad y SST publicadas en este sitio.
              </p>
            ),
          },
          {
            title: "Contacto licitaciones",
            content: (
              <p>
                Escríbanos a{" "}
                <a href={`mailto:${EMPRENOR_LEGAL.emailLicitaciones}`} className="text-emerald-700 font-medium underline">
                  {EMPRENOR_LEGAL.emailLicitaciones}
                </a>{" "}
                indicando pliego, organismo y plazos. También puede usar el{" "}
                <Link href="/contacto" className="text-emerald-700 underline">
                  formulario de contacto
                </Link>
                .
              </p>
            ),
          },
        ]}
      />

      <section className="pb-16">
        <div className="container px-4 md:px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            {[
              { icon: FileCheck, title: "Cumplimiento contractual", text: "Checklists según pliego del contratante" },
              { icon: Shield, title: "SST y ART", text: "Política pública y registro en obra" },
              { icon: Users, title: "Empleo local", text: "Nómina y compras regionales" },
              { icon: ClipboardList, title: "Referencias", text: "Portafolio publicado y bajo solicitud" },
            ].map((item) => (
              <Card key={item.title}>
                <CardContent className="p-5 space-y-2">
                  <item.icon className="h-8 w-8 text-emerald-600" />
                  <p className="font-semibold text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
