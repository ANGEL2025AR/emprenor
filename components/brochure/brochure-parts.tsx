import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { EMPRENOR_BRAND, EMPRENOR_TITULAR } from "@/lib/company/constants"
import { BROCHURE_CERTIFICATIONS, BROCHURE_META } from "@/lib/site/brochure-full-content"
import type { BrochureLegalEntity, BrochureManifestoItem } from "@/lib/db/models"
import type { ResolvedBrochureDirectoryMember } from "@/lib/site/brochure-types"
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

export function CertBadges({ compact = false, light = false, items }: { compact?: boolean; light?: boolean; items?: string[] }) {
  const list = items?.length ? items : BROCHURE_CERTIFICATIONS
  return (
    <div className={`flex flex-wrap gap-1.5 ${compact ? "" : "mt-3"}`}>
      {list.map((c) => (
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

export function BrochureFooterLine({ brand, website, founded }: { brand?: string; website?: string; founded?: number | string }) {
  const brandLabel = brand || EMPRENOR_BRAND.siglas
  const site = website || BROCHURE_META.website
  const year = founded ?? BROCHURE_META.founded
  return (
    <div className="brochure-page-footer mt-auto shrink-0 px-8 py-3 border-t border-slate-100 flex justify-between items-center text-[8px] text-slate-400 tracking-wider print:px-6">
      <span>{brandLabel} · {EMPRENOR_TITULAR.nombreCompleto}</span>
      <span>Fundación {year} · {site}</span>
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

export function BrochureManifestoPage({
  title,
  subtitle,
  items,
  brand,
  page,
  totalPages,
}: {
  title: string
  subtitle: string
  items: BrochureManifestoItem[]
  brand: string
  page: number
  totalPages: number
}) {
  const sorted = [...items].sort((a, b) => a.order - b.order)
  return (
    <>
      <BrochureSectionBar title={title} page={page} totalPages={totalPages} />
      <BrochurePageBody>
        <p className="text-[10px] tracking-[0.3em] uppercase text-green-600 font-semibold mb-2">{brand}</p>
        <h2 className="text-3xl font-black text-slate-900 mb-2 leading-tight">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500 mb-6 max-w-xl">{subtitle}</p>}
        <div className="columns-2 gap-6 space-y-3">
          {sorted.map((item) => (
            <p key={item.id} className="text-[11px] text-slate-700 leading-relaxed break-inside-avoid">
              {item.text}
            </p>
          ))}
        </div>
        <BrochureFooterLine brand={brand} />
      </BrochurePageBody>
    </>
  )
}

export function BrochureLegalEntityPage({
  legal,
  page,
  totalPages,
}: {
  legal: BrochureLegalEntity
  page: number
  totalPages: number
}) {
  return (
    <>
      <BrochureSectionBar title="Nuestra Empresa" page={page} totalPages={totalPages} />
      <BrochurePageBody padded={false}>
        <div className="grid grid-cols-2 flex-1 min-h-0">
          <div className="p-8 flex flex-col justify-center bg-slate-900 text-white">
            <p className="text-[9px] tracking-[0.25em] uppercase text-green-400 mb-3">Razón social</p>
            <h2 className="text-xl font-black leading-snug mb-4">{legal.legalName}</h2>
            <p className="text-sm text-white/70 mb-4">{legal.legalNameShort}</p>
            <div className="space-y-2 text-[11px] text-white/60">
              <p><strong className="text-white/90">Marca comercial:</strong> {legal.commercialBrand}</p>
              <p><strong className="text-white/90">CUIT:</strong> {legal.cuit}</p>
              <p><strong className="text-white/90">Forma jurídica:</strong> {legal.formaJuridica}</p>
              <p><strong className="text-white/90">Domicilio:</strong> {legal.domicilioFiscal}</p>
            </div>
          </div>
          <div className="relative min-h-[200px] bg-slate-100">
            {legal.companyImage ? (
              <Image src={legal.companyImage} alt={legal.commercialBrand} fill className="object-cover" unoptimized={legal.companyImage.startsWith("http")} />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm p-6 text-center">
                Imagen institucional · editable desde dashboard
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-0 p-6 text-white">
              <p className="text-2xl font-black">{legal.commercialBrand}</p>
              <p className="text-xs text-white/80 mt-1">{legal.commercialTagline}</p>
            </div>
          </div>
        </div>
        <div className="px-8 py-4 bg-green-50 border-t border-green-100">
          <p className="text-[10px] uppercase tracking-widest text-green-700 font-semibold mb-2">Transición societaria</p>
          <p className="text-xs text-slate-600 leading-relaxed">{legal.transitionNote}</p>
        </div>
        <BrochureFooterLine brand={legal.commercialBrand} founded={legal.operacionDesde} />
      </BrochurePageBody>
    </>
  )
}

export function BrochureDirectoryOverviewPage({
  members,
  departments,
  brand,
  page,
  totalPages,
}: {
  members: ResolvedBrochureDirectoryMember[]
  departments: string[]
  brand: string
  page: number
  totalPages: number
}) {
  const featured = members.filter((m) => m.featured)
  return (
    <>
      <BrochureSectionBar title="Directorio y Equipo" page={page} totalPages={totalPages} />
      <BrochurePageBody>
        <h2 className="text-2xl font-black text-slate-900 mb-2">
          Desarrollamos <span className="text-green-600">talentos</span>
        </h2>
        <p className="text-sm text-slate-500 mb-6 max-w-lg">
          Equipo directivo y profesional que respalda cada proyecto de {brand}.
        </p>
        <div className="grid grid-cols-2 gap-4 mb-8">
          {(featured.length ? featured : members.slice(0, 4)).map((m) => (
            <div key={m._id || m.name} className="border border-slate-200 p-3 flex gap-3">
              <div className="w-14 h-14 rounded-full bg-slate-200 overflow-hidden shrink-0 relative">
                {m.photo ? (
                  <Image src={m.photo} alt={m.name} fill className="object-cover" unoptimized={m.photo.startsWith("http")} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-lg font-bold">
                    {m.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm text-slate-900 truncate">{m.name}</p>
                <p className="text-[10px] uppercase tracking-wide text-green-600">{m.role}</p>
                <p className="text-[9px] text-slate-500 mt-0.5">{m.department}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] tracking-widest uppercase text-green-600 font-semibold mb-3">Organigrama</p>
        <div className="grid grid-cols-2 gap-2">
          {departments.map((d) => (
            <div key={d} className="bg-slate-50 border border-slate-100 px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-slate-700">
              {d}
            </div>
          ))}
        </div>
        <BrochureFooterLine brand={brand} />
      </BrochurePageBody>
    </>
  )
}

export function BrochureDirectoryDepartmentPage({
  department,
  members,
  brand,
  page,
  totalPages,
}: {
  department: string
  members: ResolvedBrochureDirectoryMember[]
  brand: string
  page: number
  totalPages: number
}) {
  return (
    <>
      <BrochureSectionBar title={department} page={page} totalPages={totalPages} />
      <BrochurePageBody>
        <p className="text-[10px] tracking-[0.3em] uppercase text-green-600 font-semibold mb-4">{brand}</p>
        <div className="grid grid-cols-2 gap-4">
          {members.map((m) => (
            <div key={m._id || m.name} className="border border-slate-100 p-4 bg-white">
              <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden relative mb-3">
                {m.photo ? (
                  <Image src={m.photo} alt={m.name} fill className="object-cover" unoptimized={m.photo.startsWith("http")} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl font-black text-slate-300">
                    {m.name.charAt(0)}
                  </div>
                )}
              </div>
              <p className="font-bold text-sm uppercase text-slate-900 leading-snug">{m.name}</p>
              <p className="text-[10px] text-green-600 font-semibold uppercase tracking-wide mt-1">{m.role}</p>
              {m.bio && <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">{m.bio}</p>}
              {m.phone && <p className="text-[9px] text-slate-400 mt-2">{m.phone}</p>}
            </div>
          ))}
        </div>
        <BrochureFooterLine brand={brand} />
      </BrochurePageBody>
    </>
  )
}
