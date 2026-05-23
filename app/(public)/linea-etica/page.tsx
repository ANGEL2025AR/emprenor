import type { Metadata } from "next"
import { PublicHeroSection } from "@/components/home/public-hero-section"
import { EthicsReportForm } from "@/components/public/ethics-report-form"
import { EMPRENOR_LEGAL } from "@/lib/company/constants"

export const metadata: Metadata = {
  title: "Línea de ética | EMPRENOR",
  description: "Canal confidencial para reportar conductas contrarias a nuestro código de ética.",
}

export default function LineaEticaPage() {
  return (
    <main className="flex flex-col">
      <PublicHeroSection slug="linea-etica" variant="simple" />
      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6 max-w-2xl mx-auto space-y-8">
          <header className="text-center space-y-3">
            <h1 className="text-3xl font-bold">Línea de ética</h1>
            <p className="text-muted-foreground">
              Canal confidencial para empleados, proveedores, clientes y comunidad. No toleramos represalias por reportes de
              buena fe. También puede escribir a{" "}
              <a href={`mailto:${EMPRENOR_LEGAL.emailEtica}`} className="text-emerald-700 underline">
                {EMPRENOR_LEGAL.emailEtica}
              </a>
              .
            </p>
          </header>
          <EthicsReportForm />
        </div>
      </section>
    </main>
  )
}
