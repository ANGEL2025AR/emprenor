import type { Metadata } from "next"
import { PublicHeroSection } from "@/components/home/public-hero-section"
import ContactoClient from "./contacto-client"
import { buildPageMetadata } from "@/lib/site/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "Contacto",
  description:
    "Solicite una cotización gratuita. Oficinas en Salta Capital, Tartagal y Campamento Vespucio. Atención en Salta, Jujuy, Tucumán y Formosa.",
  path: "/contacto",
})

export default function ContactoPage() {
  return (
    <main className="flex flex-col">
      <PublicHeroSection slug="contacto" variant="simple" />
      <ContactoClient />
    </main>
  )
}
