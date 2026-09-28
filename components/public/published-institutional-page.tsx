import { Card, CardContent } from "@/components/ui/card"
import { InstitutionalPage } from "@/components/public/institutional-page"
import { InstitutionalRichText } from "@/components/public/institutional-rich-text"
import { getInstitutionalPage, type InstitutionalSlug } from "@/lib/site/institutional-pages"

export async function PublishedInstitutionalPage({ slug }: { slug: InstitutionalSlug }) {
  const page = await getInstitutionalPage(slug)
  return (
    <>
      <InstitutionalPage
        title={page.title}
        subtitle={page.subtitle}
        heroImage={page.heroImage || undefined}
        sections={page.sections.map((section) => ({
          title: section.title,
          content: <InstitutionalRichText body={section.body} />,
        }))}
        cta={page.ctaLabel && page.ctaHref ? { label: page.ctaLabel, href: page.ctaHref } : undefined}
      />
      {page.highlights.length > 0 ? (
        <section className="pb-16">
          <div className="container px-4 md:px-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
              {page.highlights.map((item) => (
                <Card key={item.title}>
                  <CardContent className="p-5 space-y-2">
                    <p className="font-semibold text-sm">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}
