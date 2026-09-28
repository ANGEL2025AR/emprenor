import type { Metadata } from "next"
import { EthicsReportForm } from "@/components/public/ethics-report-form"
import { InstitutionalRichText } from "@/components/public/institutional-rich-text"
import { buildPageMetadata } from "@/lib/site/page-metadata"
import { getInstitutionalPage } from "@/lib/site/institutional-pages"

export async function generateMetadata(): Promise<Metadata> {
  const page = await getInstitutionalPage("linea-etica")
  return buildPageMetadata({
    title: page.title,
    description: page.description,
    path: "/linea-etica",
  })
}

export default async function LineaEticaPage() {
  const page = await getInstitutionalPage("linea-etica")
  return (
    <main className="flex flex-col">
      <section
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white py-16 md:py-20"
        style={
          page.heroImage
            ? {
                backgroundImage: `linear-gradient(rgba(15,23,42,.85), rgba(15,23,42,.85)), url(${page.heroImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        <div className="container px-4 md:px-6 max-w-3xl mx-auto text-center space-y-4">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{page.title}</h1>
          <p className="text-slate-200 text-lg leading-relaxed">{page.subtitle}</p>
        </div>
      </section>
      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6 max-w-2xl mx-auto space-y-8">
          <header className="text-center space-y-3">
            <h2 className="text-2xl font-semibold">{page.formTitle}</h2>
            <div className="text-muted-foreground">
              <InstitutionalRichText body={page.formIntro} />
            </div>
          </header>
          <EthicsReportForm />
        </div>
      </section>
    </main>
  )
}
