import type { Metadata } from "next"
import { buildPageMetadata } from "@/lib/site/page-metadata"
import { EMPRENOR_PROVINCIAS, EMPRENOR_SLOGAN } from "@/lib/company/constants"

export const metadata: Metadata = buildPageMetadata({
  title: "Proyectos",
  description: `Portafolio de obras y mapa geolocalizado de EMPRENOR C&S en ${EMPRENOR_PROVINCIAS.join(", ")}. ${EMPRENOR_SLOGAN}.`,
  path: "/proyectos",
})

export { default } from "./proyectos-client"
