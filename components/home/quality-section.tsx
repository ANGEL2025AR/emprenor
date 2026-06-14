import { FileCheck, ShieldCheck } from "lucide-react"
import { BROCHURE_QUALITY_DOCS } from "@/lib/site/brochure-content"

export function QualitySection() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <span className="text-green-600 font-semibold text-sm tracking-wider uppercase flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            Gestión de calidad
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mt-3">Trazabilidad documental en cada obra</h2>
          <p className="text-slate-500 mt-3 max-w-2xl mx-auto text-sm">
            Sistema integrado de gestión documental alineado con estándares AEA 90364, normativa ENARGAS y CIRSOC.
            Cada proyecto cuenta con registro verificable de materiales, controles y entregables técnicos.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {BROCHURE_QUALITY_DOCS.map((doc) => (
            <div key={doc.title} className="rounded-2xl p-6 bg-white border border-slate-100 border-l-4 border-l-green-600">
              <FileCheck className="w-6 h-6 text-green-600 mb-4" />
              <p className="font-bold text-sm text-slate-900 mb-2">{doc.title}</p>
              <p className="text-xs text-slate-600 leading-relaxed">{doc.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
