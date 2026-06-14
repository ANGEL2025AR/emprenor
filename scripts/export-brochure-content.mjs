/**
 * Exporta contenido del brochure desde emprenorsolutions a shared/brochure-content.json
 */
import { writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import { BROCHURE_CERTIFICATIONS, BROCHURE_PRESENTATION, BROCHURE_SERVICES_DETAIL } from "../emprenorsolutions/src/data/brochureServicesDetail.js"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const out = {
  certifications: BROCHURE_CERTIFICATIONS,
  presentation: BROCHURE_PRESENTATION,
  servicesDetail: BROCHURE_SERVICES_DETAIL,
}
writeFileSync(join(root, "shared/brochure-content.json"), JSON.stringify(out, null, 2), "utf8")
console.log("Exported", out.servicesDetail.length, "service detail blocks to shared/brochure-content.json")
