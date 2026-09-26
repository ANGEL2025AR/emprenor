import Link from "next/link"
import { Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EMPRENOR_LEGAL } from "@/lib/company/constants"
import { contactFormUrl } from "@/lib/site/urls"

export function EmergencyBanner() {
  return (
    <section className="py-14 bg-slate-900 text-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <p className="text-green-400 text-sm font-semibold uppercase tracking-wider mb-2">Atención comercial</p>
            <h2 className="text-2xl lg:text-3xl font-bold mb-2">Coordiná una consulta técnica</h2>
            <p className="text-white/70">
              Lunes a viernes {EMPRENOR_LEGAL.horarioSemana}. Sábados {EMPRENOR_LEGAL.horarioSabado}. Escribinos y
              coordinamos el relevamiento de la obra.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white" asChild>
              <Link href={contactFormUrl()}>Solicitar presupuesto</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 bg-transparent" asChild>
              <a href={`tel:${EMPRENOR_LEGAL.telefonoPrincipalHref}`}>
                <Phone className="w-5 h-5 mr-2" />
                {EMPRENOR_LEGAL.telefonoPrincipal}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
