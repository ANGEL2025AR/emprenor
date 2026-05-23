import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ServiceDetailPage } from "@/components/public/service-detail-page"
import { getPublishedServices, getServiceBySlug } from "@/lib/site/get-services"
import { SITE_SERVICE_DEFAULTS } from "@/lib/site/service-defaults"

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return SITE_SERVICE_DEFAULTS.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const service = await getServiceBySlug(slug)
  if (!service) return { title: "Servicio no encontrado" }
  return {
    title: service.seoTitle || `${service.title} — EMPRENOR Construcciones`,
    description: service.seoDescription || service.shortDescription,
  }
}

export default async function ServicioDetallePage({ params }: Props) {
  const { slug } = await params
  const [service, allServices] = await Promise.all([getServiceBySlug(slug), getPublishedServices()])
  if (!service) notFound()
  return <ServiceDetailPage service={service} otherServices={allServices} />
}
