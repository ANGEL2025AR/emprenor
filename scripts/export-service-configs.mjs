/**
 * Exporta configuraciones de servicio desde emprenorsolutions a shared/service-configs/*.json
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const outDir = join(root, "shared/service-configs")
const catalog = JSON.parse(readFileSync(join(root, "shared/services.catalog.json"), "utf8"))
const servicesDir = join(root, "emprenorsolutions/src/data/services")

mkdirSync(outDir, { recursive: true })

const moduleMap = {
  ServicioConstuccion: "construccion.js",
  ServicioElectrico: "electrico.js",
  ServicioSanitario: "sanitario.js",
  ServicioGas: "gas.js",
  ServicioIndustrial: "industrial.js",
  ServicioAgropecuario: "agropecuario.js",
  ServicioClimatizacion: "climatizacion.js",
  ServicioMantenimiento: "mantenimiento.js",
  ServicioPrefabricadas: "prefabricadas.js",
}

for (const svc of catalog.services) {
  const file = moduleMap[svc.pageKey]
  if (!file) {
    console.warn(`Missing module map for ${svc.pageKey}`)
    continue
  }
  const mod = await import(pathToFileURL(join(servicesDir, file)).href)
  const config = mod.default
  writeFileSync(join(outDir, `${svc.slug}.json`), `${JSON.stringify(config, null, 2)}\n`, "utf8")
  console.log(`Exported ${svc.slug}.json`)
}
