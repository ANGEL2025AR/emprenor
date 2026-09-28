import type { Metadata } from "next"
import { PublishedInstitutionalPage } from "@/components/public/published-institutional-page"
import { buildPageMetadata } from "@/lib/site/page-metadata"
import { getInstitutionalPage } from "@/lib/site/institutional-pages"

export async function generateMetadata(): Promise<Metadata> {
  const page = await getInstitutionalPage("licitaciones")
  return buildPageMetadata({
    title: page.title,
    description: page.description,
    path: "/licitaciones",
  })
}

export default function LicitacionesPage() {
  return <PublishedInstitutionalPage slug="licitaciones" />
}
