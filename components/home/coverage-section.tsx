import { MapPin } from "lucide-react"
import { BROCHURE_COVERAGE, BROCHURE_OFFICES } from "@/lib/site/brochure-content"

export function CoverageSection() {
  return (
    <section className="py-20 bg-slate-900 text-white">
      <div className="container px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <span className="text-green-500 font-semibold text-sm tracking-wider uppercase">Presencia regional</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-3 mb-4">
              Cobertura en <span className="text-green-500">4 provincias</span>
            </h2>
            <p className="text-white/55 leading-relaxed mb-8">
              Con sede estratégica en el NOA, EMPRENOR C&S está cerca suyo para brindarle el mejor servicio de construcción e instalaciones del norte argentino.
            </p>
            <div className="space-y-4">
              {BROCHURE_OFFICES.map((o) => (
                <div key={o.name} className="flex gap-3">
                  <MapPin className="w-4 h-4 text-green-500 mt-1 shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">{o.name}{o.primary ? " · Sede principal" : ""}</p>
                    <p className="text-white/45 text-sm">{o.address}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {BROCHURE_COVERAGE.map((p) => (
              <div key={p.name} className="rounded-xl border border-white/10 bg-white/5 p-5">
                <p className="font-bold text-lg uppercase tracking-wide">{p.name}</p>
                <p className="text-green-400 text-xs uppercase tracking-widest mt-1">{p.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
