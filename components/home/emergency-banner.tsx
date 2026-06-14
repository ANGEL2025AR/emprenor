import Link from "next/link"
import { Phone, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EMPRENOR_LEGAL } from "@/lib/company/constants"

export function EmergencyBanner() {
  return (
    <section className="relative py-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-700 to-orange-600" />
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
      <div className="relative container px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 animate-pulse">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                <span className="text-white/80 text-sm font-semibold uppercase tracking-wider">Guardia 24/7</span>
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-1">¿Emergencia eléctrica o de instalaciones?</h3>
              <p className="text-white/80">Guardia técnica 24/7 en el NOA — respuesta en menos de 2 horas</p>
            </div>
          </div>
          <Button size="lg" className="bg-white text-orange-600 hover:bg-white/90 px-8 h-14 text-base font-bold shadow-xl" asChild>
            <Link href={`tel:${EMPRENOR_LEGAL.telefonoPrincipalHref}`}>
              <Phone className="w-5 h-5 mr-2" />
              {EMPRENOR_LEGAL.telefonoPrincipal}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
