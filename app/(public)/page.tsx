import type { Metadata } from "next"
import { buildPageMetadata } from "@/lib/site/page-metadata"
import { EMPRENOR_PROVINCIAS, EMPRENOR_SLOGAN } from "@/lib/company/constants"

export const metadata: Metadata = buildPageMetadata({
  title: "Inicio",
  description: `${EMPRENOR_SLOGAN}. Construcción e instalaciones integradas en ${EMPRENOR_PROVINCIAS.join(", ")}. Obras públicas, industriales, comerciales y viviendas llave en mano.`,
  path: "/",
})

export { default } from "./home-page"
