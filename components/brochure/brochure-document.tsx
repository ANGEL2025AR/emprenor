"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Phone, Mail, Globe, MapPin, Printer, ArrowRight, Download, FileCheck, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  BROCHURE_CONTACT,
  BROCHURE_FEATURED_PROJECTS_FALLBACK,
  BROCHURE_GUARANTEES,
  BROCHURE_META,
  BROCHURE_OFFICES,
  BROCHURE_PROCESS,
  BROCHURE_QUALITY_DOCS,
  BROCHURE_SERVICES,
  BROCHURE_COVERAGE,
} from "@/lib/site/brochure-full-content"
import { buildDefaultBrochureContent } from "@/lib/site/brochure-defaults"
import { groupDirectoryByDepartment, type ResolvedBrochureContent, type ResolvedBrochureDirectoryMember } from "@/lib/site/brochure-types"
import { BROCHURE_SERVICES_DETAIL, getServicePageChunks } from "@/lib/site/build-brochure-services"
import { SERVICES_CATALOG } from "@/lib/site/services-catalog"
import { contactFormUrl } from "@/lib/site/urls"
import {
  BrochureFooterLine,
  BrochureLogo,
  BrochurePageBlock,
  BrochurePageBody,
  BrochureSectionBar,
  BrochureManifestoPage,
  BrochureLegalEntityPage,
  BrochureDirectoryOverviewPage,
  BrochureDirectoryDepartmentPage,
  CertBadges,
  ServiceDetailPage,
} from "./brochure-parts"

const SERVICE_PAGES = BROCHURE_SERVICES_DETAIL.flatMap((service) =>
  getServicePageChunks(service).map((chunk) => ({ service, ...chunk })),
)

const STATIC_PAGES_BEFORE_SERVICES = 6
const SERVICE_PAGE_START = STATIC_PAGES_BEFORE_SERVICES + 1

type FeaturedProject = { num: string; title: string; location: string; badge: string; plazo?: string; highlight?: boolean }

export function BrochureDocument() {
  const [content, setContent] = useState<ResolvedBrochureContent>(() => buildDefaultBrochureContent())
  const [directory, setDirectory] = useState<ResolvedBrochureDirectoryMember[]>([])
  const [loading, setLoading] = useState(true)
  const [featuredProjects, setFeaturedProjects] = useState<FeaturedProject[]>(BROCHURE_FEATURED_PROJECTS_FALLBACK)

  useEffect(() => {
    Promise.all([
      fetch("/api/brochure").then((r) => r.json()),
      fetch("/api/brochure/directory").then((r) => r.json()),
      fetch("/api/public-projects?published=true").then((r) => r.json()),
    ])
      .then(([brochureData, dirData, projectsData]) => {
        if (brochureData.content) setContent(brochureData.content)
        if (dirData.members) setDirectory(dirData.members)
        const list = (projectsData.projects || []).slice(0, 5)
        if (list.length) {
          setFeaturedProjects(
            list.map((p: { title: string; location?: string; category?: string; duration?: string }, i: number) => ({
              num: String(i + 1).padStart(2, "0"),
              title: p.title,
              location: p.location || "NOA",
              badge: p.category || "Obra",
              plazo: p.duration,
              highlight: i === 0,
            })),
          )
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const departmentGroups = useMemo(() => groupDirectoryByDepartment(directory), [directory])
  const directoryOverviewPage = SERVICE_PAGE_START + SERVICE_PAGES.length
  const projectsPage = directoryOverviewPage + 1 + departmentGroups.length
  const coveragePage = projectsPage + 1
  const TOTAL_PAGES = coveragePage + 1

  const brand = content.legalEntity.commercialBrand
  const pageNum = (n: number) => String(n).padStart(2, "0")

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        Cargando brochure corporativo...
      </div>
    )
  }

  return (
    <div className="brochure-root bg-slate-100 min-h-screen print:bg-white pt-4 print:pt-0">
      <div className="py-8 px-4 print:py-0 print:px-0 max-w-[210mm] mx-auto print:max-w-none">
        {/* P1 — PORTADA */}
        <BrochurePageBlock>
          <div className="relative h-full bg-[#0a0a0a] text-white overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 w-[55%] h-full bg-green-950 opacity-90" style={{ clipPath: "polygon(18% 0, 100% 0, 100% 100%, 0% 100%)" }}>
              <Image src={content.cover.image} alt="" fill className="object-cover opacity-30 mix-blend-luminosity" unoptimized />
              <div className="absolute inset-0 bg-gradient-to-br from-green-900/80 via-green-950/90 to-black/95" />
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-green-500 via-emerald-600 to-transparent" />
            <div className="relative z-10 p-8 flex justify-between items-start">
              <BrochureLogo variant="light" size="lg" />
              <div className="text-right">
                <p className="text-[10px] tracking-[0.25em] uppercase text-green-400">Brochure · {BROCHURE_META.year}</p>
                <p className="text-[9px] text-white/35 mt-1">{content.legalEntity.legalNameShort}</p>
              </div>
            </div>
            <div className="relative z-10 flex-1 flex flex-col justify-center px-8 pb-8">
              <p className="text-[10px] tracking-[0.35em] uppercase text-green-400 mb-5 flex items-center gap-3">
                <span className="w-8 h-px bg-green-400" /> {content.cover.since}
              </p>
              <h1 className="text-5xl lg:text-6xl font-black leading-[1.05] max-w-md mb-6">
                {content.cover.headline.map((line, i) => (
                  <span key={`${line}-${i}`} className={i === 1 ? "text-green-500" : undefined}>
                    {line}
                    {i < content.cover.headline.length - 1 && <br />}
                  </span>
                ))}
              </h1>
              <p className="text-white/65 text-sm leading-relaxed max-w-md mb-6">{content.cover.description}</p>
              <CertBadges light items={content.certifications} />
              <div className="flex flex-wrap gap-6 mt-8 mb-10">
                {content.stats.map((s) => (
                  <div key={s.label} className="border-l-2 border-green-500 pl-3">
                    <p className="text-2xl font-black">{s.value}</p>
                    <p className="text-[9px] uppercase tracking-widest text-white/45">{s.label}</p>
                  </div>
                ))}
              </div>
              <Button className="bg-green-600 hover:bg-green-700 text-white w-fit print:hidden" asChild>
                <Link href={contactFormUrl()}>{content.cover.cta} <ArrowRight className="w-3 h-3 ml-2" /></Link>
              </Button>
            </div>
            <div className="relative z-10 mt-auto shrink-0 px-8 py-5 border-t border-white/10 flex justify-between items-center text-[10px] tracking-wider">
              <span className="text-white/40">www.<strong className="text-green-400 font-medium">emprenor.com</strong></span>
              <div className="flex gap-2 flex-wrap justify-end">
                {content.cover.provinces.map((p) => (
                  <span key={p} className="border border-white/15 px-2 py-0.5 text-white/40 uppercase text-[9px]">{p}</span>
                ))}
              </div>
            </div>
          </div>
        </BrochurePageBlock>

        {/* P2 — MANIFIESTO */}
        <BrochurePageBlock>
          <BrochureManifestoPage
            title={content.manifesto.title}
            subtitle={content.manifesto.subtitle}
            items={content.manifesto.items}
            brand={brand}
            page={2}
            totalPages={TOTAL_PAGES}
          />
        </BrochurePageBlock>

        {/* P3 — EMPRESA */}
        <BrochurePageBlock>
          <BrochureLegalEntityPage legal={content.legalEntity} page={3} totalPages={TOTAL_PAGES} />
        </BrochurePageBlock>

        {/* P4 — CARTA */}
        <BrochurePageBlock>
          <BrochureSectionBar title={content.presentation.title} page={4} totalPages={TOTAL_PAGES} />
          <BrochurePageBody>
            <div className="flex justify-between items-start mb-8 pb-6 border-b border-slate-100">
              <BrochureLogo size="md" />
              <div className="text-right text-[10px] text-slate-500 leading-relaxed">
                <p className="font-bold text-slate-900 uppercase tracking-wide">{content.legalEntity.legalName}</p>
                <p className="text-green-700 font-semibold">{brand}</p>
                <p>CUIT {content.legalEntity.cuit}</p>
                <p>{content.legalEntity.domicilioFiscal}</p>
                <p>Fundación: {content.legalEntity.foundedLabel}</p>
              </div>
            </div>
            <p className="text-sm font-semibold text-slate-900 mb-4">{content.presentation.salutation}</p>
            <div className="space-y-4">
              {content.presentation.paragraphs.map((p) => (
                <p key={p.slice(0, 50)} className="text-sm text-slate-600 leading-relaxed text-justify">{p}</p>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-slate-100">
              <p className="text-sm text-slate-600 mb-1">{content.presentation.closing}</p>
              <p className="text-base font-bold text-slate-900">{content.presentation.signatory}</p>
              <p className="text-xs text-slate-500 mt-0.5">{content.presentation.signatoryRole}</p>
            </div>
            <div className="mt-6">
              <p className="text-[9px] uppercase tracking-widest text-green-600 font-semibold mb-2">Certificaciones y habilitaciones</p>
              <CertBadges items={content.certifications} />
            </div>
            <BrochureFooterLine brand={brand} founded={content.legalEntity.operacionDesde} />
          </BrochurePageBody>
        </BrochurePageBlock>

        {/* P5 — QUIÉNES SOMOS */}
        <BrochurePageBlock>
          <BrochureSectionBar title="Quiénes Somos" page={5} totalPages={TOTAL_PAGES} />
          <BrochurePageBody>
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <div className="w-10 h-1 bg-green-600 mb-4" />
                <h2 className="text-3xl font-black text-slate-900 mb-4 leading-tight">
                  Nuestra <span className="text-green-600">Historia</span> y Propósito
                </h2>
                {content.history.paragraphs.map((p) => (
                  <p key={p.slice(0, 40)} className="text-slate-600 text-sm leading-relaxed mb-3">{p}</p>
                ))}
              </div>
              <div className="bg-slate-900 text-white p-6 flex flex-col justify-between">
                <div>
                  <p className="text-[9px] tracking-widest uppercase text-green-400 mb-2">Misión</p>
                  <p className="text-sm text-white/75 leading-relaxed mb-5">{content.mission.mission}</p>
                  <p className="text-[9px] tracking-widest uppercase text-green-400 mb-2">Visión</p>
                  <p className="text-sm text-white/75 leading-relaxed">{content.mission.vision}</p>
                </div>
                <div className="mt-6 inline-flex items-center gap-3 bg-green-600 px-4 py-3 w-fit">
                  <span className="text-2xl font-black">{content.legalEntity.operacionDesde}</span>
                  <span className="text-[9px] uppercase tracking-wider text-white/80 leading-snug">Año de<br />fundación</span>
                </div>
              </div>
            </div>
            <p className="text-[10px] tracking-widest uppercase text-green-600 font-semibold mb-4">Nuestros Valores</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {content.values.map((v) => (
                <div key={v.title} className="border border-slate-200 p-4 border-l-[3px] border-l-green-600">
                  <p className="font-bold text-sm uppercase tracking-wide text-slate-900 mb-1">{v.title}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
            <BrochureFooterLine brand={brand} founded={content.legalEntity.operacionDesde} />
          </BrochurePageBody>
        </BrochurePageBlock>

        {/* P6 — ÍNDICE */}
        <BrochurePageBlock>
          <BrochureSectionBar title="Servicios Integrales — Índice" page={6} totalPages={TOTAL_PAGES} />
          <BrochurePageBody>
            <h2 className="text-2xl font-black text-slate-900 mb-2">
              {SERVICES_CATALOG.length} especialidades, <span className="text-green-600">un solo interlocutor</span>
            </h2>
            <p className="text-sm text-slate-500 mb-6 max-w-lg">
              Páginas {pageNum(SERVICE_PAGE_START)} a {pageNum(SERVICE_PAGE_START + SERVICE_PAGES.length - 1)}: alcance técnico de cada especialidad.
            </p>
            <div className="grid grid-cols-3 gap-px bg-slate-200 mb-8">
              {BROCHURE_SERVICES.map((s) => (
                <div key={s.num} className={`p-4 ${s.featured ? "bg-slate-900 text-white" : "bg-white"}`}>
                  <p className={`text-2xl font-serif mb-1 ${s.featured ? "text-white/15" : "text-slate-200"}`}>{s.num}</p>
                  <div className="w-5 h-0.5 bg-green-600 mb-2" />
                  <p className={`font-bold text-xs uppercase tracking-wide mb-1 ${s.featured ? "text-white" : "text-slate-900"}`}>{s.title}</p>
                  <p className={`text-[10px] leading-relaxed ${s.featured ? "text-white/60" : "text-slate-500"}`}>{s.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-[10px] tracking-widest uppercase text-green-600 font-semibold mb-4">Proceso de trabajo</p>
            <div className="grid grid-cols-5 gap-2 mb-8">
              {BROCHURE_PROCESS.map((s) => (
                <div key={s.step} className="text-center">
                  <div className="w-9 h-9 rounded-full bg-green-600 text-white text-sm font-bold flex items-center justify-center mx-auto mb-2">{s.step}</div>
                  <p className="text-[10px] font-bold uppercase text-slate-900">{s.title}</p>
                  <p className="text-[9px] text-slate-500 mt-1">{s.desc}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-3 mb-2">
              {BROCHURE_GUARANTEES.map((g) => (
                <div key={g.title} className="bg-slate-50 p-4 text-center">
                  <p className="text-xs font-bold uppercase text-slate-900 mb-1">{g.title}</p>
                  <p className="text-[10px] text-slate-500">{g.desc}</p>
                </div>
              ))}
            </div>
            <BrochureFooterLine brand={brand} founded={content.legalEntity.operacionDesde} />
          </BrochurePageBody>
        </BrochurePageBlock>

        {SERVICE_PAGES.map((chunk, i) => (
          <BrochurePageBlock key={`${chunk.service.id}-${chunk.suffix || "full"}`}>
            <ServiceDetailPage
              service={chunk.service}
              categories={chunk.categories}
              titleSuffix={chunk.suffix}
              continued={chunk.continued}
              page={SERVICE_PAGE_START + i}
              totalPages={TOTAL_PAGES}
            />
          </BrochurePageBlock>
        ))}

        <BrochurePageBlock>
          <BrochureDirectoryOverviewPage
            members={directory}
            departments={departmentGroups.map((g) => g.department)}
            brand={brand}
            page={directoryOverviewPage}
            totalPages={TOTAL_PAGES}
          />
        </BrochurePageBlock>

        {departmentGroups.map((group, i) => (
          <BrochurePageBlock key={group.department}>
            <BrochureDirectoryDepartmentPage
              department={group.department}
              members={group.members}
              brand={brand}
              page={directoryOverviewPage + 1 + i}
              totalPages={TOTAL_PAGES}
            />
          </BrochurePageBlock>
        ))}

        <BrochurePageBlock>
          <BrochureSectionBar title="Proyectos destacados" page={projectsPage} totalPages={TOTAL_PAGES} />
          <BrochurePageBody>
            <h2 className="text-2xl font-black text-slate-900 mb-6">
              Obras que <span className="text-green-600">respaldan nuestra experiencia</span>
            </h2>
            <p className="text-sm text-slate-500 mb-5 max-w-2xl">
              Referencias publicadas en <strong className="text-slate-700">{BROCHURE_META.website}/proyectos</strong>.
            </p>
            <div className="space-y-1 mb-6">
              {featuredProjects.map((p) => (
                <div
                  key={p.num}
                  className={`grid grid-cols-[40px_1fr_auto] gap-3 items-center p-3.5 ${
                    p.highlight ? "border-l-[3px] border-l-green-600 bg-green-50/50" : "bg-white border border-slate-100"
                  }`}
                >
                  <span className="text-xs font-bold text-green-600">{p.num}</span>
                  <div>
                    <p className="font-bold text-sm uppercase text-slate-900 leading-snug">{p.title}</p>
                    <p className="text-xs text-slate-500">{p.location}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] uppercase tracking-wide px-2 py-1 border border-slate-200 text-slate-500 whitespace-nowrap block">{p.badge}</span>
                    {p.plazo && <span className="text-[8px] text-slate-400 mt-1 block">Plazo: {p.plazo}</span>}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] tracking-widest uppercase text-green-600 font-semibold mb-3 flex items-center gap-2">
              <FileCheck className="w-3.5 h-3.5" />
              Gestión de calidad y trazabilidad documental
            </p>
            <div className="grid grid-cols-2 gap-3">
              {BROCHURE_QUALITY_DOCS.map((doc) => (
                <div key={doc.title} className="bg-slate-50 border border-slate-100 p-3.5 rounded-r-md border-l-[3px] border-l-green-600">
                  <p className="text-[10px] font-bold uppercase text-slate-900 mb-1">{doc.title}</p>
                  <p className="text-[9px] text-slate-600 leading-snug">{doc.desc}</p>
                </div>
              ))}
            </div>
            <BrochureFooterLine brand={brand} founded={content.legalEntity.operacionDesde} />
          </BrochurePageBody>
        </BrochurePageBlock>

        <BrochurePageBlock>
          <BrochureSectionBar title="Cobertura regional" page={coveragePage} totalPages={TOTAL_PAGES} />
          <BrochurePageBody padded={false}>
            <div className="grid grid-cols-4 bg-green-600 text-white shrink-0">
              {content.stats.map((s) => (
                <div key={s.label} className="text-center py-5 border-r border-white/20 last:border-r-0">
                  <p className="text-3xl font-black">{s.value}</p>
                  <p className="text-[9px] uppercase tracking-widest text-white/70 mt-1 px-1">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-8 bg-slate-900 text-white p-8 flex-1 min-h-0">
              <div>
                <h3 className="text-xl font-black mb-3">Cobertura en <span className="text-green-500">4 provincias</span></h3>
                <p className="text-sm text-white/55 mb-5">Sede estratégica en el NOA para brindarle el mejor servicio de construcción del norte argentino.</p>
                {BROCHURE_OFFICES.map((o) => (
                  <div key={o.name} className="flex gap-2 mb-3 text-sm">
                    <MapPin className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold uppercase text-xs tracking-wide">{o.name}{o.primary ? " · Sede principal" : ""}</p>
                      <p className="text-white/45 text-xs">{o.address}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {BROCHURE_COVERAGE.map((p) => (
                  <div key={p.name} className="border border-white/10 bg-white/5 p-4">
                    <p className="font-bold uppercase">{p.name}</p>
                    <p className="text-green-400 text-[10px] uppercase tracking-wider mt-1">{p.sub}</p>
                  </div>
                ))}
              </div>
            </div>
            <BrochureFooterLine brand={brand} founded={content.legalEntity.operacionDesde} />
          </BrochurePageBody>
        </BrochurePageBlock>

        <BrochurePageBlock breakAfter={false}>
          <div className="relative h-full bg-[#0a0a0a] text-white flex flex-col overflow-hidden">
            <div className="absolute top-0 left-0 w-[45%] h-full bg-gradient-to-br from-green-700 to-green-950" style={{ clipPath: "polygon(0 0, 82% 0, 100% 100%, 0 100%)" }} />
            <div className="relative z-10 p-8 flex justify-between items-start">
              <BrochureLogo variant="light" />
              <span className="text-green-400 text-[10px] tracking-widest uppercase tabular-nums">{pageNum(TOTAL_PAGES)} / {pageNum(TOTAL_PAGES)}</span>
            </div>
            <div className="relative z-10 flex-1 flex flex-col justify-center pl-[min(200px,20%)] pr-8">
              <p className="text-[10px] tracking-widest uppercase text-white/45 mb-4 flex items-center gap-3">
                <span className="w-8 h-px bg-white/25" /> {content.closing.headline}
              </p>
              <h2 className="text-4xl font-black mb-4 leading-tight">
                Hablemos<br />de tu<br /><span className="text-green-500">proyecto</span>
              </h2>
              {content.closing.subline && (
                <p className="text-sm text-white/50 mb-8 max-w-sm">{content.closing.subline}</p>
              )}
              <div className="space-y-5 max-w-sm">
                <div className="flex gap-4">
                  <Phone className="w-5 h-5 text-green-500 shrink-0" />
                  <div>
                    {BROCHURE_CONTACT.phones.map((ph) => (
                      <p key={ph.value} className="text-sm font-semibold">
                        {ph.value} <span className="text-white/40 font-normal text-xs">· {ph.label}</span>
                      </p>
                    ))}
                  </div>
                </div>
                <div className="flex gap-4">
                  <Mail className="w-5 h-5 text-green-500 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">{BROCHURE_CONTACT.email}</p>
                    <p className="text-xs text-white/40">{BROCHURE_CONTACT.emailNote}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Globe className="w-5 h-5 text-green-500 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">{BROCHURE_CONTACT.website}</p>
                    <p className="text-xs text-white/40">{BROCHURE_CONTACT.websiteNote}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <MapPin className="w-5 h-5 text-green-500 shrink-0" />
                  <p className="text-sm font-semibold">{content.legalEntity.domicilioFiscal}</p>
                </div>
              </div>
              <div className="mt-8"><CertBadges light compact items={content.certifications} /></div>
            </div>
            <div className="relative z-10 mt-auto p-8 border-t border-white/10 flex justify-between items-end shrink-0">
              <div>
                <p className="text-[9px] text-white/25 uppercase tracking-wider">{content.legalEntity.legalName}</p>
                <p className="text-[9px] text-white/35 mt-0.5">{brand}</p>
                <p className="text-[9px] text-white/20 mt-1">Fundación {content.legalEntity.foundedLabel} · CUIT {content.legalEntity.cuit}</p>
              </div>
              <p className="text-[9px] text-white/20">© {BROCHURE_META.year} {brand}</p>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-600 via-emerald-500 to-transparent" />
          </div>
        </BrochurePageBlock>
      </div>

      <div className="max-w-7xl mx-auto px-5 pb-12 print:hidden">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <Download className="w-8 h-8 text-green-600 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">Descargar brochure en PDF</h3>
          <p className="text-slate-500 text-sm mb-5">
            {TOTAL_PAGES} páginas A4 · Manifiesto · Directorio · {SERVICES_CATALOG.length} servicios detallados.
            <br />
            En el navegador: Imprimir → Guardar como PDF.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={() => window.print()} className="bg-green-600 hover:bg-green-700 text-white">
              <Printer className="w-4 h-4 mr-2" /> Generar PDF
            </Button>
            <Button variant="outline" className="border-slate-300" asChild>
              <Link href={contactFormUrl()}>Solicitar cotización <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          @page { size: A4 portrait; margin: 0; }
          html, body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          header, footer, nav, .print\\:hidden { display: none !important; }
          main { padding: 0 !important; margin: 0 !important; }
          .brochure-root {
            padding-top: 0 !important;
            background: white !important;
            min-height: auto !important;
          }
          .brochure-page {
            box-shadow: none !important;
            width: 210mm !important;
            max-width: 210mm !important;
            height: 297mm !important;
            max-height: 297mm !important;
            margin: 0 !important;
            page-break-after: always;
            break-after: page;
          }
          .brochure-page:last-child {
            page-break-after: auto;
            break-after: auto;
          }
        }
      `}</style>
    </div>
  )
}
