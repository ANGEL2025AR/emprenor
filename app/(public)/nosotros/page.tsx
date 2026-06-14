import type { Metadata } from "next"
import { buildPageMetadata } from "@/lib/site/page-metadata"
import { EMPRENOR_BRAND, EMPRENOR_PROVINCIAS, EMPRENOR_TITULAR } from "@/lib/company/constants"

export const metadata: Metadata = buildPageMetadata({
  title: "Nosotros",
  description: `${EMPRENOR_BRAND.nombreExtendido} — ${EMPRENOR_TITULAR.nombreCompleto}. Historia, misión, valores y cobertura en ${EMPRENOR_PROVINCIAS.join(", ")}.`,
  path: "/nosotros",
})

export { default } from "./nosotros-content"
