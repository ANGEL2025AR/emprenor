import type { ReactNode } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

type Section = {
  title: string
  content: ReactNode
}

export function InstitutionalPage({
  title,
  subtitle,
  sections,
  cta,
  heroImage,
}: {
  slug?: string
  title: string
  subtitle: string
  sections: Section[]
  cta?: { label: string; href: string }
  heroImage?: string
}) {
  return (
    <main className="flex flex-col">
      <section
        className="public-page-hero relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white py-16 md:py-24"
        style={
          heroImage
            ? {
                backgroundImage: `linear-gradient(rgba(2,6,23,.88), rgba(2,6,23,.82)), url(${heroImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.15),transparent_55%)]" />
        <div className="container relative px-4 md:px-6 max-w-3xl mx-auto text-center space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400/90">EMPRENOR C&S</p>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">{title}</h1>
          <p className="text-slate-300 text-lg leading-relaxed max-w-2xl mx-auto">{subtitle}</p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-gradient-to-b from-background to-muted/20">
        <div className="container px-4 md:px-6 max-w-3xl mx-auto space-y-8">
          {sections.map((section) => (
            <article
              key={section.title}
              className="public-content-card rounded-2xl border border-border/80 bg-card/80 p-6 md:p-8 shadow-sm space-y-3"
            >
              <h2 className="text-xl font-semibold text-foreground">{section.title}</h2>
              <div className="prose prose-slate max-w-none text-muted-foreground leading-relaxed space-y-3 text-sm md:text-base">
                {section.content}
              </div>
            </article>
          ))}

          {cta ? (
            <div className="flex justify-center pt-2">
              <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20">
                <Link href={cta.href}>
                  {cta.label}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  )
}
