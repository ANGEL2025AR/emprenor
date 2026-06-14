"use client"

import Image from "next/image"
import Link from "next/link"
import {
  CheckCircle,
  Phone,
  AlertTriangle,
  ArrowRight,
  Building2,
  Factory,
  Home,
  Tractor,
  Zap,
  Wind,
  Wrench,
  Droplets,
  Flame,
  Hammer,
  HardHat,
  FileCheck,
  Shield,
  Clock,
  Percent,
  Calendar,
  Truck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { EMPRENOR_LEGAL } from "@/lib/company/constants"
import { contactFormUrl } from "@/lib/site/urls"
import type { ServicePageConfig, ServiceSectionConfig } from "@/lib/site/service-page-types"
import { ServiceHeroSlider } from "./service-hero-slider"
import {
  PrefabAuthoritySection,
  PrefabCatalogSection,
  PrefabFAQSection,
  PrefabFinancingSection,
  PrefabProcessSection,
  PrefabSpecsSection,
  PrefabSystemsSection,
} from "./prefab-sections"

const SERVICE_ICONS: Record<string, typeof Building2> = {
  Building2,
  Factory,
  Home,
  Tractor,
  Zap,
  Wind,
  Wrench,
  Droplets,
  Flame,
  Hammer,
  CheckCircle,
  HardHat,
  FileCheck,
  Shield,
  Clock,
  Percent,
  Calendar,
  Truck,
}

const GRID_COLS: Record<number, string> = {
  2: "grid sm:grid-cols-2 gap-6",
  3: "grid md:grid-cols-3 gap-5",
  4: "grid sm:grid-cols-2 lg:grid-cols-4 gap-5",
}

function ServiceCTA({ title, subtitle, buttonText, showPhone }: { title?: string; subtitle?: string; buttonText?: string; showPhone?: boolean }) {
  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container px-4 md:px-6 text-center space-y-6">
        {title && <h2 className="text-3xl font-bold">{title}</h2>}
        {subtitle && <p className="text-primary-foreground/80 max-w-2xl mx-auto">{subtitle}</p>}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" asChild>
            <Link href={contactFormUrl()}>{buttonText || "Solicitar cotización"} <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
          {showPhone && (
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent" asChild>
              <a href={`tel:${EMPRENOR_LEGAL.telefonoPrincipalHref}`}><Phone className="mr-2 h-4 w-4" />{EMPRENOR_LEGAL.telefonoPrincipal}</a>
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}

function PageHeader({ title, highlight, subtitle }: { title?: string; highlight?: string; subtitle?: string }) {
  return (
    <section className="relative bg-primary text-primary-foreground py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-3xl space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {title} {highlight && <span className="text-green-400">{highlight}</span>}
          </h1>
          {subtitle && <p className="text-lg text-primary-foreground/90 leading-relaxed">{subtitle}</p>}
        </div>
      </div>
    </section>
  )
}

function IntroSplit(props: Record<string, unknown>) {
  const paragraphs = (props.paragraphs as string[]) || []
  const stats = (props.stats as { v: string; l: string }[]) || []
  const badges = (props.badges as string[]) || []
  const tags = (props.tags as string[]) || []
  const tagBox = props.tagBox as { title: string; tags: string[] } | undefined
  const image = props.image as string | undefined
  return (
    <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
      <div>
        {props.eyebrow ? <span className="text-green-600 font-semibold text-sm tracking-wider uppercase">{String(props.eyebrow)}</span> : null}
        {props.title ? <h2 className="text-3xl font-bold text-foreground mt-3 mb-5">{String(props.title)}</h2> : null}
        {paragraphs.map((p, i) => <p key={i} className="text-muted-foreground text-lg leading-relaxed mb-4 last:mb-0">{p}</p>)}
        {stats.length > 0 && (
          <div className="mt-8 grid grid-cols-3 gap-4">
            {stats.map((s, i) => (
              <div key={i} className="text-center p-4 rounded-2xl bg-muted border border-border">
                <p className="text-2xl font-bold text-green-600">{s.v}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.l}</p>
              </div>
            ))}
          </div>
        )}
        {badges.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {badges.map((b) => <span key={b} className="px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-sm font-semibold border border-green-100">{b}</span>)}
          </div>
        )}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-6">
            {tags.map((t) => <span key={t} className="px-3 py-1.5 rounded-full bg-muted text-foreground text-sm font-semibold">{t}</span>)}
          </div>
        )}
        {tagBox && (
          <div className="p-5 rounded-2xl bg-muted border border-border mt-6">
            <p className="font-bold mb-3">{tagBox.title}</p>
            <div className="flex flex-wrap gap-2">
              {tagBox.tags.map((t) => <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-background border border-border">{t}</span>)}
            </div>
          </div>
        )}
        {props.alert ? (
          <div className="p-5 rounded-2xl bg-orange-50 border border-orange-100 mt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" />
              <p className="text-orange-800 text-sm font-medium">{String(props.alert)}</p>
            </div>
          </div>
        ) : null}
        {props.note ? (
          <div className="p-5 rounded-2xl bg-green-50 border border-green-100 mt-6">
            <p className="text-green-800 text-sm font-medium">{String(props.note)}</p>
          </div>
        ) : null}
      </div>
      {image && (
        <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/5] min-h-[320px]">
          <Image src={image} alt={String(props.imageAlt || props.title || "Servicio")} fill className="object-cover" unoptimized={image.startsWith("http") || image.startsWith("/assets")} />
        </div>
      )}
    </div>
  )
}

function CardsGrid(props: Record<string, unknown>) {
  const items = (props.items as Array<{ title: string; desc?: string; color?: string; items: string[] }>) || []
  const icon = (props.icon as string) || "CheckCircle"
  const iconColor = (props.iconColor as string) || "from-green-500 to-green-600"
  const columns = (props.columns as number) || 2
  const showDesc = Boolean(props.showDesc)
  const Icon = SERVICE_ICONS[icon] || CheckCircle
  return (
    <div className={`${GRID_COLS[columns] || GRID_COLS[2]} ${props.className ? String(props.className) : "mb-16"}`}>
      {items.map((card, i) => (
        <div key={i} className="bg-background rounded-2xl p-7 border border-border hover:shadow-lg transition-shadow">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color || iconColor} flex items-center justify-center mb-4`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold mb-2">{card.title}</h3>
          {showDesc && card.desc && <p className="text-muted-foreground text-sm mb-4">{card.desc}</p>}
          <ul className="space-y-2">
            {card.items.map((item, j) => (
              <li key={j} className="flex items-start gap-2 text-muted-foreground text-sm"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

function TwoColsLists({ columns }: { columns: Array<Record<string, unknown>> }) {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {columns.map((col, i) => {
            const Icon = SERVICE_ICONS[String(col.icon)] || CheckCircle
            const items = (col.items as string[]) || []
            return (
              <div key={i}>
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${col.iconColor || "from-green-500 to-green-600"} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{String(col.title)}</h2>
                    {col.badge ? <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${col.badgeClass || "bg-green-50 text-green-700"}`}>{String(col.badge)}</span> : null}
                  </div>
                </div>
                {col.desc ? <p className="text-muted-foreground mb-6 leading-relaxed">{String(col.desc)}</p> : null}
                <ul className="space-y-2.5">
                  {items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-muted-foreground text-sm">
                      <CheckCircle className={`w-4 h-4 mt-0.5 shrink-0 ${col.checkColor || "text-green-500"}`} />{item}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function SplitContentEmergency(props: Record<string, unknown>) {
  const items = (props.items as string[]) || []
  const emergencyItems = (props.emergencyItems as string[]) || []
  return (
    <section className="py-16">
      <div className="container px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            {props.eyebrow ? <span className="text-green-600 font-semibold text-sm tracking-wider uppercase">{String(props.eyebrow)}</span> : null}
            {props.title ? <h2 className="text-3xl font-bold mt-3 mb-5">{String(props.title)}</h2> : null}
            {props.desc ? <p className="text-muted-foreground mb-6 leading-relaxed">{String(props.desc)}</p> : null}
            <ul className="space-y-2.5">
              {items.map((item, i) => <li key={i} className="flex items-start gap-2.5"><CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />{item}</li>)}
            </ul>
          </div>
          <div className="p-8 rounded-3xl bg-orange-50 border border-orange-100">
            <div className="flex items-center gap-3 mb-5">
              <AlertTriangle className="w-8 h-8 text-orange-500" />
              <h3 className="text-xl font-bold text-orange-900">{String(props.emergencyTitle)}</h3>
            </div>
            {props.emergencyDesc ? <p className="text-orange-700 mb-5">{String(props.emergencyDesc)}</p> : null}
            <h4 className="font-bold text-orange-900 mb-3">¿Cuándo llamarnos?</h4>
            <ul className="space-y-2 mb-6">
              {emergencyItems.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-orange-700 text-sm">
                  <div className="w-2 h-2 rounded-full bg-orange-400 mt-1.5 shrink-0" />{item}
                </li>
              ))}
            </ul>
            <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white h-12" asChild>
              <a href={`tel:${EMPRENOR_LEGAL.telefonoPrincipalHref}`}><Phone className="w-4 h-4 mr-2" />Llamar Ahora — 24/7</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

function FeatureIcons({ items }: { items: Array<{ icon: string; title: string; desc: string }> }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
      {items.map((v, i) => {
        const Icon = SERVICE_ICONS[v.icon] || CheckCircle
        return (
          <div key={i} className="text-center p-6 rounded-2xl bg-background border border-border hover:shadow-lg hover:border-green-200 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-4">
              <Icon className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="font-bold mb-1">{v.title}</h3>
            <p className="text-muted-foreground text-sm">{v.desc}</p>
          </div>
        )
      })}
    </div>
  )
}

function PlansGrid(props: Record<string, unknown>) {
  const plans = (props.plans as Array<{ name: string; price: string; period: string; color: string; badge?: string; features: string[] }>) || []
  return (
    <>
      {(props.eyebrow || props.title) && (
        <div className="text-center mb-12">
          {props.eyebrow ? <span className="text-green-600 font-semibold text-sm tracking-wider uppercase">{String(props.eyebrow)}</span> : null}
          {props.title ? <h2 className="text-3xl font-bold mt-3">{String(props.title)}</h2> : null}
        </div>
      )}
      <div className="grid md:grid-cols-3 gap-5">
        {plans.map((plan, i) => (
          <div key={i} className={`relative p-8 rounded-2xl bg-background border-2 ${plan.color} hover:shadow-xl transition-all`}>
            {plan.badge && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs font-bold px-4 py-1.5 rounded-full">{plan.badge}</span>}
            <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
            <p className="text-2xl font-bold text-green-600 mt-3">{plan.price}</p>
            <p className="text-xs text-muted-foreground mb-5">{plan.period}</p>
            <ul className="space-y-2.5 mb-8">
              {plan.features.map((f, j) => <li key={j} className="flex items-start gap-2 text-sm"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />{f}</li>)}
            </ul>
            <Button className="w-full bg-green-600 hover:bg-green-700" asChild><Link href={contactFormUrl()}>Contratar Plan</Link></Button>
          </div>
        ))}
      </div>
    </>
  )
}

function BannerDark(props: Record<string, unknown>) {
  const Icon = SERVICE_ICONS[String(props.icon)] || CheckCircle
  return (
    <section className="py-16 bg-slate-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <Icon className="w-12 h-12 text-green-400 shrink-0" />
            <div>
              <h3 className="text-xl font-bold text-white">{String(props.title)}</h3>
              {props.subtitle ? <p className="text-slate-400">{String(props.subtitle)}</p> : null}
            </div>
          </div>
          {props.ctaText ? (
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white rounded-full px-8 h-14" asChild>
              <Link href={contactFormUrl()}>{String(props.ctaText)} <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  )
}

function EmergencyBar(props: Record<string, unknown>) {
  const ZapIcon = SERVICE_ICONS.Zap
  return (
    <section className="py-16 bg-orange-600">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <ZapIcon className="w-10 h-10 text-white shrink-0" />
            <div>
              <h3 className="text-xl font-bold text-white">{String(props.title)}</h3>
              {props.subtitle ? <p className="text-orange-100">{String(props.subtitle)}</p> : null}
            </div>
          </div>
          <Button size="lg" className="bg-white text-orange-600 hover:bg-white/90 rounded-full px-8 h-14 font-bold" asChild>
            <a href={`tel:${EMPRENOR_LEGAL.telefonoPrincipalHref}`}><Phone className="w-5 h-5 mr-2" />Llamar ahora</a>
          </Button>
        </div>
      </div>
    </section>
  )
}

function SubtypeGrid({ title, eyebrow, subtypes }: { title?: string; eyebrow?: string; subtypes?: Array<{ icon?: string; title: string; color?: string; items: string[] }> }) {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          {eyebrow && <span className="text-green-600 font-semibold text-sm tracking-wider uppercase">{eyebrow}</span>}
          {title && <h2 className="text-3xl font-bold mt-3">{title}</h2>}
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          {(subtypes || []).map((s, i) => {
            const Icon = SERVICE_ICONS[s.icon || "Building2"] || Building2
            return (
              <div key={i} className="bg-background rounded-2xl p-7 border border-border hover:shadow-lg transition-shadow">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color || "from-green-500 to-green-600"} flex items-center justify-center mb-5`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">{s.title}</h3>
                <ul className="space-y-2">
                  {s.items.map((item, j) => <li key={j} className="flex items-start gap-2 text-muted-foreground text-sm"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />{item}</li>)}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function ProcessGrid({ title, eyebrow, steps, inline }: { title?: string; eyebrow?: string; steps?: Array<{ step: string; title: string; desc: string }>; inline?: boolean }) {
  const content = (
    <>
      {(eyebrow || title) && (
        <div className={`text-center ${inline ? "mb-12" : "mb-14"}`}>
          {eyebrow && <span className="text-green-600 font-semibold text-sm tracking-wider uppercase">{eyebrow}</span>}
          {title && <h2 className="text-3xl font-bold mt-3">{title}</h2>}
        </div>
      )}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {(steps || []).map((p, i) => (
          <div key={i} className="p-6 rounded-2xl border border-border bg-background hover:border-green-200 transition-colors">
            <span className="text-4xl font-black text-green-100">{p.step}</span>
            <h3 className="font-bold mt-2 mb-2">{p.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>
    </>
  )
  if (inline) return content
  return <section className="py-16"><div className="container px-4 md:px-6">{content}</div></section>
}

function AdvantagesDark({ title, items, className = "" }: { title?: string; items?: string[]; className?: string }) {
  return (
    <div className={`bg-slate-900 rounded-3xl p-8 lg:p-10 ${className}`}>
      {title && <h3 className="text-2xl font-bold text-white mb-6 text-center">{title}</h3>}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {(items || []).map((item, i) => (
          <div key={i} className="flex items-start gap-2.5 p-4 rounded-xl bg-white/5 border border-white/10">
            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
            <span className="text-slate-300 text-sm">{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ExtrasDark({ title, items }: { title?: string; items?: string[] }) {
  return (
    <section className="py-16 bg-slate-900 text-white">
      <div className="container px-4 md:px-6">
        {title && <h2 className="text-2xl font-bold text-center mb-10">{title}</h2>}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {(items || []).map((item, i) => (
            <div key={i} className="flex items-center gap-2.5 p-4 rounded-xl bg-white/5 border border-white/10">
              <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
              <span className="text-slate-300 text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function renderChildSection(child: ServiceSectionConfig, i: number) {
  switch (child.type) {
    case "intro":
      return <IntroSplit key={i} {...child} />
    case "cards":
      return <CardsGrid key={i} {...child} />
    case "advantages-dark":
      return <AdvantagesDark key={i} title={child.title as string} items={(child.items as string[]) || []} />
    case "process-inline":
      return <ProcessGrid key={i} inline title={child.title as string} eyebrow={child.eyebrow as string} steps={child.steps as Array<{ step: string; title: string; desc: string }>} />
    case "feature-icons":
      return <FeatureIcons key={i} items={(child.items as Array<{ icon: string; title: string; desc: string }>) || []} />
    case "plans":
      return <PlansGrid key={i} {...child} />
    default:
      return null
  }
}

export function renderServiceSection(section: ServiceSectionConfig, index: number) {
  switch (section.type) {
    case "group":
      return (
        <section key={index} className={section.className ? String(section.className) : "py-16"}>
          <div className="container px-4 md:px-6">
            {((section.children as ServiceSectionConfig[]) || []).map((child, i) => renderChildSection(child, i))}
          </div>
        </section>
      )
    case "intro":
      return <section key={index} className="py-16"><div className="container px-4 md:px-6"><IntroSplit {...section} /></div></section>
    case "cards":
      return <section key={index} className="py-16"><div className="container px-4 md:px-6"><CardsGrid {...section} /></div></section>
    case "two-cols-lists":
      return <TwoColsLists key={index} columns={(section.columns as Array<Record<string, unknown>>) || []} />
    case "split-emergency":
      return <SplitContentEmergency key={index} {...section} />
    case "subtypes":
      return <SubtypeGrid key={index} title={section.title as string} eyebrow={section.eyebrow as string} subtypes={section.subtypes as Array<{ icon?: string; title: string; color?: string; items: string[] }>} />
    case "process":
    case "process-inline":
      return <ProcessGrid key={index} title={section.title as string} eyebrow={section.eyebrow as string} steps={section.steps as Array<{ step: string; title: string; desc: string }>} inline={section.type === "process-inline"} />
    case "extras-dark":
      return <ExtrasDark key={index} title={section.title as string} items={(section.items as string[]) || []} />
    case "advantages-dark":
      return <section key={index} className="py-16"><div className="container px-4 md:px-6"><AdvantagesDark title={section.title as string} items={(section.items as string[]) || []} /></div></section>
    case "banner":
    case "banner-dark":
      return <BannerDark key={index} {...section} />
    case "emergency-bar":
      return <EmergencyBar key={index} {...section} />
    case "feature-icons":
      return <section key={index} className="py-16"><div className="container px-4 md:px-6"><FeatureIcons items={(section.items as Array<{ icon: string; title: string; desc: string }>) || []} /></div></section>
    case "plans":
      return <section key={index} className="py-16"><div className="container px-4 md:px-6"><PlansGrid {...section} /></div></section>
    case "prefab-catalog":
      return <PrefabCatalogSection key={index} eyebrow={section.eyebrow as string} title={section.title as string} subtitle={section.subtitle as string} />
    case "prefab-systems":
      return <PrefabSystemsSection key={index} />
    case "prefab-authority":
      return <PrefabAuthoritySection key={index} />
    case "prefab-financing":
      return <PrefabFinancingSection key={index} />
    case "prefab-process":
      return <PrefabProcessSection key={index} />
    case "prefab-specs":
      return <PrefabSpecsSection key={index} />
    case "prefab-faq":
      return <PrefabFAQSection key={index} />
    case "cta":
      return <ServiceCTA key={index} title={section.title as string} subtitle={section.subtitle as string} buttonText={section.buttonText as string} showPhone={section.showPhone as boolean} />
    default:
      return null
  }
}

export function SolutionsServicePage({ config }: { config: ServicePageConfig }) {
  const hero = config.hero
  return (
    <main className="flex flex-col">
      {hero?.type === "page-header" && <PageHeader title={hero.title} highlight={hero.highlight} subtitle={hero.subtitle} />}
      {hero?.type === "hero-slider" && <ServiceHeroSlider slides={(hero.slides as Parameters<typeof ServiceHeroSlider>[0]["slides"]) || []} minHeight={hero.minHeight} />}
      {(config.sections || []).map((section, i) => renderServiceSection(section, i))}
    </main>
  )
}
