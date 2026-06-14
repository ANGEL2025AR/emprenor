import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { SolutionsServicePage } from "@/components/public/solutions-service/service-page"
import { getServicePageConfig } from "@/lib/site/get-service-config"
import { getAllServiceSlugs, getCatalogBySlug, LEGACY_SERVICE_SLUG_REDIRECTS, resolveServiceSlug } from "@/lib/site/services-catalog"
import { buildPageMetadata } from "@/lib/site/page-metadata"

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return getAllServiceSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const resolved = resolveServiceSlug(slug)
  const entry = getCatalogBySlug(resolved)
  const config = getServicePageConfig(resolved)
  if (!entry || !config) return { title: "Servicio no encontrado" }
  return buildPageMetadata({
    title: entry.title,
    description: entry.shortDescription,
    path: `/servicios/${resolved}`,
  })
}

export default async function ServicioDetallePage({ params }: Props) {
  const { slug } = await params

  if (LEGACY_SERVICE_SLUG_REDIRECTS[slug]) {
    redirect(`/servicios/${LEGACY_SERVICE_SLUG_REDIRECTS[slug]}`)
  }

  const resolved = resolveServiceSlug(slug)
  const config = getServicePageConfig(resolved)
  if (!config) notFound()

  return <SolutionsServicePage config={config} />
}
