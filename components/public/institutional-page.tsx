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
        className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white py-16 md:py-20"
        style={heroImage ? { backgroundImage: `linear-gradient(rgba(15,23,42,.85), rgba(15,23,42,.85)), url(${heroImage})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
      >
        <div className="container px-4 md:px-6 max-w-3xl mx-auto text-center space-y-4">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
          <p className="text-slate-200 text-lg leading-relaxed">{subtitle}</p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6 max-w-3xl mx-auto space-y-10">
          {sections.map((section) => (
            <article key={section.title} className="space-y-3 border-t border-border pt-8 first:border-0 first:pt-0">
              <h2 className="text-xl font-semibold text-foreground">{section.title}</h2>
              <div className="prose prose-slate max-w-none text-muted-foreground leading-relaxed space-y-3 text-sm md:text-base">
                {section.content}
              </div>
            </article>
          ))}

          {cta ? (
            <div className="flex justify-center pt-4">
              <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
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
