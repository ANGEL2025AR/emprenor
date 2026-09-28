import type { Metadata } from "next"
import { PublishedInstitutionalPage } from "@/components/public/published-institutional-page"
import { buildPageMetadata } from "@/lib/site/page-metadata"
import { getInstitutionalPage } from "@/lib/site/institutional-pages"

export async function generateMetadata(): Promise<Metadata> {
  const page = await getInstitutionalPage("sostenibilidad")
  return buildPageMetadata({
    title: page.title,
    description: page.description,
    path: "/sostenibilidad",
  })
}

export default function SostenibilidadPage() {
  return <PublishedInstitutionalPage slug="sostenibilidad" />
}
