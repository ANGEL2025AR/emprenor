import type { Metadata } from "next"
import { PublicHeroSection } from "@/components/home/public-hero-section"
import ContactoClient from "./contacto-client"
import { buildPageMetadata } from "@/lib/site/page-metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "Contacto",
  description:
    "Pedí un presupuesto. Sede en Campamento Vespucio, Salta. Atención en Salta, Jujuy, Tucumán y Formosa.",
  path: "/contacto",
})

export default async function ContactoPage({
  searchParams,
}: {
  searchParams: Promise<{ servicio?: string }>
}) {
  const { servicio } = await searchParams
  return (
    <main className="flex flex-col">
      <PublicHeroSection slug="contacto" variant="simple" />
      <ContactoClient initialService={servicio} />
    </main>
  )
}
