import Link from "next/link"
import { ArrowRight, Building2, FileCheck, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EMPRENOR_LEGAL } from "@/lib/company/constants"

export function PublicSectorBand() {
  return (
    <section className="py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white">
      <div className="container px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-emerald-400 text-sm font-semibold uppercase tracking-wider mb-3">
              Obra pública y sector institucional
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Documentación y cumplimiento para licitaciones
            </h2>
            <p className="text-slate-300 text-lg mb-6 leading-relaxed">
              Acompañamos a municipios y organismos provinciales con obra ejecutada, políticas publicadas de calidad,
              SST y gestión documental, y entrega de acreditaciones bajo solicitud formal según pliego.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-white">
                <Link href="/licitaciones">
                  Información para licitadores
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 bg-transparent"
              >
                <Link href="/gestion-documental">Gestión documental</Link>
              </Button>
            </div>
          </div>
          <ul className="grid sm:grid-cols-3 lg:grid-cols-1 gap-4">
            {[
              {
                icon: FileCheck,
                title: "Legajo bajo solicitud",
                text: "Referencias, pólizas y políticas publicadas en este sitio.",
              },
              {
                icon: Shield,
                title: "SST y ART",
                text: "Política de seguridad e inducción según contrato.",
              },
              {
                icon: Building2,
                title: "Gestión de obra",
                text: "Cronograma, controles y entregables acordados por escrito.",
              },
            ].map((item) => (
              <li key={item.title} className="flex gap-4 rounded-xl border border-white/10 bg-white/5 p-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-600/20">
                  <item.icon className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-slate-400">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
