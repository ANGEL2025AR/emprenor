import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { EMPRENOR_BRAND, EMPRENOR_TITULAR } from "@/lib/company/constants"
import { BROCHURE_CERTIFICATIONS, BROCHURE_META } from "@/lib/site/brochure-full-content"
import type { BrochureServiceDetail } from "@/lib/site/build-brochure-services"

const SIZE_CLASS = { lg: "h-14", md: "h-11", sm: "h-8" } as const

export function BrochureLogo({ variant = "dark", size = "md" as keyof typeof SIZE_CLASS, showTagline = true }) {
  const isLight = variant === "light"
  return (
    <div className="flex flex-col items-start gap-1.5">
      <Image
        src="/images/logo-emprenor-large.png"
        alt={EMPRENOR_BRAND.siglas}
        width={180}
        height={48}
        className={`${SIZE_CLASS[size]} w-auto object-contain ${isLight ? "brightness-0 invert" : ""}`}
      />
      {showTagline && (
        <p className={`text-[9px] tracking-[0.22em] uppercase leading-tight ${isLight ? "text-white/50" : "text-slate-500"}`}>
          {BROCHURE_META.tagline}
        </p>
      )}
    </div>
  )
}

export function CertBadges({ compact = false, light = false }: { compact?: boolean; light?: boolean }) {
  return (
    <div className={`flex flex-wrap gap-1.5 ${compact ? "" : "mt-3"}`}>
      {BROCHURE_CERTIFICATIONS.map((c) => (
        <span
          key={c}
          className={`text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-full border font-semibold ${
            light ? "border-white/15 text-white/50 bg-white/5" : "border-green-200 text-green-700 bg-green-50"
          }`}
        >
          {c}
        </span>
      ))}
    </div>
  )
}

export function BrochurePageBlock({ children, className = "", breakAfter = true }: { children: ReactNode; className?: string; breakAfter?: boolean }) {
  return (
    <div
      className={`brochure-page bg-white shadow-xl shadow-slate-300/30 mb-8 mx-auto w-full max-w-[210mm] h-[297mm] max-h-[297mm] flex flex-col overflow-hidden print:shadow-none print:mb-0 ${
        breakAfter ? "print:break-after-page" : "print:break-after-auto"
      } ${className}`}
    >
      {children}
    </div>
  )
}

export function BrochurePageBody({ children, className = "", padded = true }: { children: ReactNode; className?: string; padded?: boolean }) {
  return (
    <div className={`brochure-page-body flex-1 flex flex-col min-h-0 ${padded ? "px-8 py-5 print:px-6 print:py-4" : ""} ${className}`}>
      {children}
    </div>
  )
}

function formatPageNum(value: number | string | null | undefined, fallback = "—") {
  if (value === null || value === undefined || value === "") return fallback
  const n = Number(value)
  if (Number.isFinite(n)) return String(n).padStart(2, "0")
  return String(value)
}

export function BrochureSectionBar({ title, page, totalPages }: { title: string; page: number; totalPages: number }) {
  return (
    <div className="bg-slate-900 px-8 py-3 flex justify-between items-center gap-4 print:px-6 border-b-2 border-green-600">
      <span className="text-[10px] tracking-[0.22em] uppercase text-green-400 font-semibold leading-snug">{title}</span>
      <span className="text-[10px] text-white/25 font-serif tabular-nums shrink-0">
        {formatPageNum(page)} / {formatPageNum(totalPages)}
      </span>
    </div>
  )
}

export function BrochureFooterLine() {
  return (
    <div className="brochure-page-footer mt-auto shrink-0 px-8 py-3 border-t border-slate-100 flex justify-between items-center text-[8px] text-slate-400 tracking-wider print:px-6">
      <span>{EMPRENOR_BRAND.siglas} · {EMPRENOR_TITULAR.nombreCompleto}</span>
      <span>Fundación {BROCHURE_META.founded} · {BROCHURE_META.website}</span>
    </div>
  )
}

function categoryGridClass(count: number) {
  if (count >= 6) return "grid-cols-3"
  if (count === 5) return "grid-cols-6"
  return "grid-cols-2"
}

function categorySpanClass(index: number, count: number) {
  if (count === 5) return index < 3 ? "col-span-2" : "col-span-3"
  return ""
}

export function ServiceDetailPage({
  service,
  page,
  totalPages,
  categories,
  titleSuffix = "",
  continued = false,
}: {
  service: BrochureServiceDetail
  page: number
  totalPages: number
  categories: BrochureServiceDetail["categories"]
  titleSuffix?: string
  continued?: boolean
}) {
  const catCount = categories.length
  const gridClass = categoryGridClass(catCount)

  return (
    <>
      <BrochureSectionBar title={`Servicio ${service.num} — ${service.title}${titleSuffix}`} page={page} totalPages={totalPages} />
      <BrochurePageBody>
        {!continued && (
          <div className="grid grid-cols-[1fr_150px] gap-5 mb-4 pb-3 border-b border-slate-100 print:grid-cols-[1fr_130px] print:mb-3">
            <div>
              <p className="text-[10px] font-bold text-green-600 tracking-widest uppercase mb-2">{service.tagline}</p>
              <p className="text-[11px] text-slate-600 leading-relaxed mb-3">{service.intro}</p>
              <div className="flex flex-wrap gap-1.5">
                {service.norms.map((n) => (
                  <span key={n} className="text-[8px] uppercase tracking-wide bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{n}</span>
                ))}
              </div>
              <Link href={`/servicios/${service.slug}`} className="inline-block mt-3 text-[9px] font-semibold text-green-600 hover:underline print:hidden">
                Ver página completa del servicio →
              </Link>
            </div>
            <div className="relative rounded-lg overflow-hidden h-28 border border-slate-200 shadow-sm print:h-24">
              <Image src={service.image} alt={service.title} fill className="object-cover" unoptimized={service.image.startsWith("http")} />
            </div>
          </div>
        )}
        {continued && (
          <p className="text-[10px] text-slate-500 mb-4 pb-3 border-b border-slate-100 italic">
            Continúa el detalle técnico de {service.title.toLowerCase()}.
          </p>
        )}
        <div className={`grid ${gridClass} gap-x-4 gap-y-3 mb-2 print:gap-y-2`}>
          {categories.map((cat, index) => (
            <div
              key={cat.title}
              className={`self-start bg-slate-50/80 rounded-r-md border-l-[3px] border-green-600 px-3 py-2.5 print:break-inside-avoid ${categorySpanClass(index, catCount)}`}
            >
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-900 mb-1.5 leading-tight">{cat.title}</p>
              <ul className="space-y-1">
                {cat.items.map((item) => (
                  <li key={item} className="text-[9px] text-slate-600 leading-snug flex gap-1.5">
                    <span className="text-green-500 shrink-0 mt-px">▸</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <BrochureFooterLine />
      </BrochurePageBody>
    </>
  )
}
