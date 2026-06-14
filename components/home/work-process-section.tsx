import { BROCHURE_PROCESS } from "@/lib/site/brochure-content"

export function WorkProcessSection({ compact = false }: { compact?: boolean }) {
  return (
    <section className={compact ? "py-16" : "py-20 bg-slate-50/50"}>
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <span className="text-green-600 font-semibold text-sm tracking-wider uppercase">Metodología</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mt-3">Nuestro proceso de trabajo</h2>
        </div>
        <div className="relative">
          <div className="hidden lg:block absolute top-5 left-[10%] right-[10%] h-0.5 bg-slate-200" />
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
            {BROCHURE_PROCESS.map((step) => (
              <div key={step.step} className="text-center relative">
                <div className="w-10 h-10 rounded-full bg-green-600 text-white font-bold flex items-center justify-center mx-auto mb-3 relative z-10">
                  {step.step}
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">{step.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
