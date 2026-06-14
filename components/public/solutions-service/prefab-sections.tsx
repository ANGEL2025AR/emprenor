"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { CheckCircle, ArrowRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  PREFAB_AUTHORITY,
  PREFAB_FAQ,
  PREFAB_FINANCING,
  PREFAB_LINES,
  PREFAB_MODELS,
  PREFAB_PROCESS,
  PREFAB_SPECS,
  PREFAB_SYSTEMS_INTRO,
  enrichModelForSystem,
  type PrefabModel,
} from "@/lib/site/prefab-catalog"
import { PREFAB_SYSTEMS, pricingFootnote, type PrefabSystemId } from "@/lib/site/prefab-pricing"

function ModelDetailModal({ model, systemId, onClose }: { model: PrefabModel | null; systemId: PrefabSystemId; onClose: () => void }) {
  if (!model) return null
  const enriched = enrichModelForSystem(model, systemId)
  const line = PREFAB_LINES.find((l) => l.id === enriched.line)
  const system = PREFAB_SYSTEMS.find((s) => s.id === systemId)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-background rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-border" onClick={(e) => e.stopPropagation()}>
        <div className="relative h-56 sm:h-64">
          <Image src={enriched.img} alt={enriched.name} fill className="object-cover" unoptimized />
          <button type="button" onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70">
            <X className="w-5 h-5" />
          </button>
          {system && <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${system.color}`}>{system.name}</span>}
          {line && <span className="absolute bottom-4 left-4 px-3 py-1 rounded-full text-xs font-semibold text-white bg-black/50">{line.name}</span>}
        </div>
        <div className="p-6 sm:p-8 space-y-4">
          <h3 className="text-2xl font-bold">{enriched.name}</h3>
          <p className="text-green-600 font-bold text-xl">{enriched.sup}</p>
          <p className="text-muted-foreground text-sm">Sistema: {system?.name} · Plazo est.: {enriched.time}</p>
          <p className="text-muted-foreground">{enriched.desc}</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-muted border border-border">
              <p className="text-xs text-muted-foreground uppercase">Precio de lista</p>
              <p className="text-2xl font-bold mt-1">{enriched.priceList}</p>
              <p className="text-xs text-muted-foreground mt-1">{pricingFootnote(systemId)}</p>
            </div>
            <div className="p-4 rounded-xl bg-green-50 border border-green-100">
              <p className="text-xs text-green-700 uppercase">Anticipo estimado</p>
              <p className="text-xl font-bold text-green-800 mt-1">{enriched.anticipo}</p>
              <p className="text-sm text-green-700 mt-1">Cuotas desde {enriched.cuotaDesde}</p>
            </div>
          </div>
          <Button className="w-full bg-green-600 hover:bg-green-700" asChild>
            <Link href="/contacto">Solicitar presupuesto de este modelo</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export function PrefabSystemsSection() {
  const data = PREFAB_SYSTEMS_INTRO
  return (
    <section className="py-20 bg-slate-900 text-white">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <span className="text-green-400 font-semibold text-sm tracking-wider uppercase">{data.eyebrow}</span>
          <h2 className="text-3xl lg:text-4xl font-bold mt-3">{data.title}</h2>
          <p className="text-slate-400 mt-3 leading-relaxed">{data.subtitle}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {data.systems.map((sys) => (
            <div key={sys.id} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-green-400/50 transition-all">
              <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold text-white bg-gradient-to-r ${sys.color} mb-3`}>{sys.badge}</span>
              <h3 className="font-bold text-lg">{sys.name}</h3>
              <p className="text-green-400 text-xs font-semibold mt-1">{sys.tagline}</p>
              <p className="text-slate-400 text-sm mt-3 leading-relaxed">{sys.desc}</p>
              <p className="text-white font-bold text-sm mt-2">Plazo: {sys.plazo}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function PrefabAuthoritySection() {
  const { eyebrow, title, subtitle, pillars } = PREFAB_AUTHORITY
  return (
    <section className="py-20 bg-white border-y border-border">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <span className="text-green-600 font-semibold text-sm tracking-wider uppercase">{eyebrow}</span>
          <h2 className="text-3xl lg:text-4xl font-bold mt-3">{title}</h2>
          <p className="text-muted-foreground mt-3 leading-relaxed">{subtitle}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {pillars.map((p) => (
            <div key={p.title} className="p-6 rounded-2xl bg-muted/50 border border-border hover:border-green-200 hover:shadow-md transition-all">
              <h3 className="font-bold">{p.title}</h3>
              <p className="text-muted-foreground text-sm mt-2 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function PrefabCatalogSection({ eyebrow, title, subtitle }: { eyebrow?: string; title?: string; subtitle?: string }) {
  const [systemFilter, setSystemFilter] = useState<PrefabSystemId>("steel-frame")
  const [lineFilter, setLineFilter] = useState("all")
  const [detail, setDetail] = useState<PrefabModel | null>(null)
  const filtered = (lineFilter === "all" ? PREFAB_MODELS : PREFAB_MODELS.filter((m) => m.line === lineFilter)).map((m) => enrichModelForSystem(m, systemFilter))

  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-10">
          {eyebrow && <span className="text-green-600 font-semibold text-sm tracking-wider uppercase">{eyebrow}</span>}
          {title && <h2 className="text-3xl lg:text-4xl font-bold mt-3">{title}</h2>}
          {subtitle && <p className="text-muted-foreground mt-2 max-w-3xl mx-auto">{subtitle}</p>}
        </div>
        <p className="text-center text-sm font-semibold mb-4">1 · Elegí el sistema constructivo</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {PREFAB_SYSTEMS.map((sys) => (
            <button key={sys.id} type="button" onClick={() => setSystemFilter(sys.id)} className={`text-left p-4 rounded-xl border-2 transition-all ${systemFilter === sys.id ? `${sys.borderActive} bg-background shadow-lg` : "border-border bg-background hover:border-muted-foreground/30"}`}>
              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold text-white bg-gradient-to-r ${sys.color}`}>{sys.badge}</span>
              <h3 className="font-bold mt-2 text-sm">{sys.name}</h3>
              <p className="text-muted-foreground text-xs mt-1">{sys.plazo}</p>
            </button>
          ))}
        </div>
        <p className="text-center text-sm font-semibold mb-4">2 · Filtrá por línea</p>
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <button type="button" onClick={() => setLineFilter("all")} className={`px-4 py-2 rounded-full text-sm font-semibold ${lineFilter === "all" ? "bg-green-600 text-white" : "bg-background border border-border"}`}>Todas</button>
          {PREFAB_LINES.map((l) => (
            <button key={l.id} type="button" onClick={() => setLineFilter(l.id)} className={`px-4 py-2 rounded-full text-sm font-semibold ${lineFilter === l.id ? "bg-green-600 text-white" : "bg-background border border-border"}`}>{l.name}</button>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((m) => (
            <div key={m.id} className="group bg-background rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all">
              <div className="relative h-44">
                <Image src={m.img} alt={m.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
              </div>
              <div className="p-5 space-y-2">
                <h3 className="font-bold">{m.name}</h3>
                <p className="text-green-600 font-bold">{m.priceList}</p>
                <p className="text-muted-foreground text-xs">{m.sup} · {m.time}</p>
                <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => setDetail(m)}>Ver detalle</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ModelDetailModal model={detail} systemId={systemFilter} onClose={() => setDetail(null)} />
    </section>
  )
}

export function PrefabFinancingSection() {
  const { eyebrow, title, subtitle, highlights, plans } = PREFAB_FINANCING
  return (
    <section className="py-20 bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <span className="text-green-600 font-semibold text-sm tracking-wider uppercase">{eyebrow}</span>
          <h2 className="text-3xl font-bold mt-3">{title}</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">{subtitle}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {highlights.map((h) => (
            <div key={h.title} className="p-5 rounded-2xl bg-muted border border-border text-center">
              <h3 className="font-bold text-sm">{h.title}</h3>
              <p className="text-muted-foreground text-xs mt-2">{h.desc}</p>
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {plans.map((plan) => (
            <div key={plan.name} className={`relative p-8 rounded-2xl bg-background border-2 ${plan.color}`}>
              {"badge" in plan && plan.badge && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs font-bold px-4 py-1.5 rounded-full">{plan.badge}</span>}
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <p className="text-2xl font-bold text-green-600 mt-3">{plan.price}</p>
              <p className="text-xs text-muted-foreground mb-5">{plan.period}</p>
              <ul className="space-y-2 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2 text-sm text-muted-foreground"><CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />{f}</li>
                ))}
              </ul>
              <Button className="w-full bg-green-600 hover:bg-green-700" asChild><Link href="/contacto">Consultar plan</Link></Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function PrefabProcessSection() {
  const { eyebrow, title, steps } = PREFAB_PROCESS
  return (
    <section className="py-20 bg-slate-900 text-white">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-14">
          <span className="text-green-400 font-semibold text-sm tracking-wider uppercase">{eyebrow}</span>
          <h2 className="text-3xl font-bold mt-3">{title}</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <div key={s.title} className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-green-400 font-black text-3xl">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="font-bold text-lg mt-2">{s.title}</h3>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function PrefabSpecsSection() {
  const [tab, setTab] = useState<PrefabSystemId>("steel-frame")
  const { eyebrow, title, systems, shared } = PREFAB_SPECS
  const active = systems.find((s) => s.id === tab) ?? systems[0]
  return (
    <section className="py-20">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-10">
          <span className="text-green-600 font-semibold text-sm tracking-wider uppercase">{eyebrow}</span>
          <h2 className="text-3xl font-bold mt-3">{title}</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {systems.map((s) => (
            <button key={s.id} type="button" onClick={() => setTab(s.id as PrefabSystemId)} className={`px-4 py-2 rounded-full text-sm font-semibold ${tab === s.id ? "bg-green-600 text-white" : "bg-muted text-muted-foreground"}`}>{s.name}</button>
          ))}
        </div>
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {active.items.map((item) => (
            <div key={item.category} className="p-5 rounded-xl border border-border bg-background">
              <h3 className="font-bold text-green-700 text-sm uppercase">{item.category}</h3>
              <p className="text-muted-foreground text-sm mt-2">{item.details}</p>
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {shared.map((item) => (
            <div key={item.category} className="p-5 rounded-xl border border-border bg-muted/50">
              <h3 className="font-bold text-sm uppercase">{item.category}</h3>
              <p className="text-muted-foreground text-sm mt-2">{item.details}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function PrefabFAQSection() {
  const [open, setOpen] = useState(0)
  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4 md:px-6 max-w-3xl">
        <h2 className="text-2xl font-bold text-center mb-10">Preguntas frecuentes</h2>
        <div className="space-y-3">
          {PREFAB_FAQ.map((item, i) => (
            <div key={item.q} className="bg-background rounded-xl border border-border overflow-hidden">
              <button type="button" className="w-full flex items-center justify-between p-5 text-left font-semibold hover:bg-muted/50" onClick={() => setOpen(open === i ? -1 : i)}>
                {item.q}
                <ArrowRight className={`w-4 h-4 shrink-0 transition-transform ${open === i ? "rotate-90" : ""}`} />
              </button>
              {open === i && <div className="px-5 pb-5 text-muted-foreground text-sm leading-relaxed border-t border-border pt-3">{item.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
