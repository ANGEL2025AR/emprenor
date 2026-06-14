import { Award, Shield, FileCheck, Users } from "lucide-react"
import { BROCHURE_GUARANTEES } from "@/lib/site/brochure-content"
import { EMPRENOR_MARKETING } from "@/lib/company/constants"

const icons = [Award, Shield, FileCheck, Users]

export function TrustSection() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Compromiso corporativo verificable</h2>
          <p className="text-lg text-slate-600">
            {EMPRENOR_MARKETING.operacionDesdeLabel} acompañamos proyectos en el NOA con planificación, calidad documentada y cumplimiento de plazos acordados.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {BROCHURE_GUARANTEES.map((item, i) => {
            const Icon = icons[i] || Award
            return (
              <div key={item.title} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
