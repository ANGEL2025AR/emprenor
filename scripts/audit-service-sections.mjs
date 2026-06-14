/**
 * Audita que todos los tipos de sección en service-configs tengan renderer en service-page.tsx
 */
import { readFileSync, readdirSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const configsDir = join(root, "shared/service-configs")
const servicePage = readFileSync(join(root, "components/public/solutions-service/service-page.tsx"), "utf8")

const HANDLED = new Set([
  "group", "intro", "cards", "two-cols-lists", "split-emergency", "subtypes", "process", "process-inline",
  "extras-dark", "advantages-dark", "banner", "banner-dark", "emergency-bar", "feature-icons", "plans", "cta",
  "prefab-catalog", "prefab-systems", "prefab-authority", "prefab-financing", "prefab-process", "prefab-specs", "prefab-faq",
  "models", "systems",
])

function collectTypes(obj, types = new Set()) {
  if (!obj || typeof obj !== "object") return types
  if (obj.type && typeof obj.type === "string") types.add(obj.type)
  if (Array.isArray(obj)) obj.forEach((x) => collectTypes(x, types))
  else Object.values(obj).forEach((v) => collectTypes(v, types))
  return types
}

let failed = false
for (const file of readdirSync(configsDir).filter((f) => f.endsWith(".json"))) {
  const config = JSON.parse(readFileSync(join(configsDir, file), "utf8"))
  const types = collectTypes(config.sections || [])
  if (config.hero?.type) types.add(`hero:${config.hero.type}`)
  const missing = [...types].filter((t) => !t.startsWith("hero:") && !HANDLED.has(t))
  if (missing.length) {
    console.error(`FAIL ${file}: tipos sin renderer:`, missing.join(", "))
    failed = true
  } else {
    console.log(`OK   ${file}: ${types.size} tipos`)
  }
}

if (!servicePage.includes("hero-slider")) {
  console.error("FAIL service-page: falta hero-slider")
  failed = true
}

process.exit(failed ? 1 : 0)
