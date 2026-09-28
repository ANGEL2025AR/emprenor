import type { Metadata } from "next"
import { PublishedInstitutionalPage } from "@/components/public/published-institutional-page"
import { buildPageMetadata } from "@/lib/site/page-metadata"
import { getInstitutionalPage } from "@/lib/site/institutional-pages"

export async function generateMetadata(): Promise<Metadata> {
  const page = await getInstitutionalPage("seguridad-y-salud")
  return buildPageMetadata({
    title: page.title,
    description: page.description,
    path: "/seguridad-y-salud",
  })
}

export default function SeguridadSaludPage() {
  return <PublishedInstitutionalPage slug="seguridad-y-salud" />
}
