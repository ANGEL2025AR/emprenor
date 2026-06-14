import type { Metadata } from "next"
import { BrochureDocument } from "@/components/brochure/brochure-document"
import { buildPageMetadata } from "@/lib/site/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "Brochure corporativo",
  description:
    "Brochure corporativo EMPRENOR C&S — construcción e instalaciones integradas en el NOA. Carta de presentación, 9 servicios detallados, cobertura y contacto. Descargable en PDF.",
  path: "/brochure",
})

export default function BrochurePage() {
  return (
    <main className="flex flex-col">
      <BrochureDocument />
    </main>
  )
}
