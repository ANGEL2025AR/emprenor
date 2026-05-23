import { Shield, Award, Leaf, FileCheck, MapPin, HardHat } from "lucide-react"
import { EMPRENOR_TRUST_PILLARS } from "@/lib/company/constants"

const ICONS = {
  shield: Shield,
  award: Award,
  leaf: Leaf,
  file: FileCheck,
  map: MapPin,
  hardhat: HardHat,
} as const

export function TrustBar() {
  return (
    <section className="border-y border-slate-200 bg-white py-8">
      <div className="container px-4">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-500 mb-6">
          Estándares de gestión en obra — ver políticas publicadas
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {EMPRENOR_TRUST_PILLARS.map((item) => {
            const Icon = ICONS[item.icon]
            return (
              <div key={item.title} className="flex flex-col items-center text-center gap-2 px-2">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-semibold text-slate-900 leading-tight">{item.title}</span>
                <span className="text-xs text-slate-500 leading-snug">{item.subtitle}</span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
