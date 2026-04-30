import { PublicHeroSection } from "@/components/home/public-hero-section"
import ContactoClient from "./contacto-client"

export default function ContactoPage() {
  return (
    <main className="flex flex-col">
      <PublicHeroSection slug="contacto" variant="simple" />
      <ContactoClient />
    </main>
  )
}
