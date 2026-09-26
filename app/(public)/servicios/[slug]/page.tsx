import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { SolutionsServicePage } from "@/components/public/solutions-service/service-page"
import { getServicePageConfig } from "@/lib/site/get-service-config"
import { getServicePageConfigResolved } from "@/lib/site/service-page-copy"
import { getAllServiceSlugs, getCatalogBySlug, LEGACY_SERVICE_SLUG_REDIRECTS, resolveServiceSlug } from "@/lib/site/services-catalog"
import { buildPageMetadata } from "@/lib/site/page-metadata"
import { EMPRENOR_PROVINCIAS } from "@/lib/company/constants"
import { generateBreadcrumbSchema, generateServiceSchema } from "@/lib/structured-data"
import { SITE_URL } from "@/lib/site-url"

function serviceMetaDescription(title: string, shortDescription: string) {
  const base = `${title}. ${shortDescription.replace(/\.+$/, "")}.`
  const coverage = `Cobertura en ${EMPRENOR_PROVINCIAS.join(", ")}.`
  const full = `${base} ${coverage}`
  if (full.length <= 160) return full
  return base.length <= 160 ? base : `${base.slice(0, 157)}...`
}

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return getAllServiceSlugs().map((slug) => ({ slug }))
}

export const dynamicParams = true

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const resolved = resolveServiceSlug(slug)
  const entry = getCatalogBySlug(resolved)
  const config = getServicePageConfig(resolved)
  if (!entry || !config) notFound()
  return buildPageMetadata({
    title: entry.title,
    description: serviceMetaDescription(entry.title, entry.shortDescription),
    path: `/servicios/${resolved}`,
  })
}

export default async function ServicioDetallePage({ params }: Props) {
  const { slug } = await params

  if (LEGACY_SERVICE_SLUG_REDIRECTS[slug]) {
    redirect(`/servicios/${LEGACY_SERVICE_SLUG_REDIRECTS[slug]}`)
  }

  const resolved = resolveServiceSlug(slug)
  const entry = getCatalogBySlug(resolved)
  const config = await getServicePageConfigResolved(resolved)
  if (!entry || !config) notFound()

  const url = `${SITE_URL}/servicios/${resolved}`
  const description = serviceMetaDescription(entry.title, entry.shortDescription)
  const structuredData = [
    generateServiceSchema({ name: entry.title, description, url }),
    generateBreadcrumbSchema([
      { name: "Inicio", url: SITE_URL },
      { name: "Servicios", url: `${SITE_URL}/servicios` },
      { name: entry.title, url },
    ]),
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <SolutionsServicePage config={config} />
    </>
  )
}
