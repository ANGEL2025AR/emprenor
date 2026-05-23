import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ServiceDetailPage } from "@/components/public/service-detail-page"
import { getPublishedServices, getServiceBySlug } from "@/lib/site/get-services"
import { SITE_SERVICE_DEFAULTS } from "@/lib/site/service-defaults"
import { buildPageMetadata } from "@/lib/site/page-metadata"
import { generateServiceSchema } from "@/lib/structured-data"
import { SITE_URL } from "@/lib/site-url"
import { EMPRENOR_BRAND } from "@/lib/company/constants"

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return SITE_SERVICE_DEFAULTS.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const service = await getServiceBySlug(slug)
  if (!service) return { title: "Servicio no encontrado" }
  return buildPageMetadata({
    title: service.seoTitle || `${service.title} — ${EMPRENOR_BRAND.siglas}`,
    description: service.seoDescription || service.shortDescription,
    path: `/servicios/${slug}`,
    image: service.heroImage || undefined,
  })
}

export default async function ServicioDetallePage({ params }: Props) {
  const { slug } = await params
  const [service, allServices] = await Promise.all([getServiceBySlug(slug), getPublishedServices()])
  if (!service) notFound()

  const serviceSchema = generateServiceSchema({
    name: service.title,
    description: service.shortDescription,
    url: `${SITE_URL}/servicios/${slug}`,
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <ServiceDetailPage service={service} otherServices={allServices} />
    </>
  )
}
