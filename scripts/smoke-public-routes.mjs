/**
 * Smoke test: rutas públicas HTTP 200.
 * Uso: node scripts/smoke-public-routes.mjs [baseUrl]
 */
const BASE = process.argv[2] || "http://localhost:3000"

const PUBLIC_ROUTES = [
  "/",
  "/proyectos",
  "/nosotros",
  "/contacto",
  "/preguntas-frecuentes",
  "/servicios",
  "/servicios/construccion",
  "/servicios/remodelacion",
  "/servicios/albanileria",
  "/servicios/electricidad",
  "/servicios/plomeria",
  "/servicios/pintura",
  "/servicios/viviendas-prefabricadas",
  "/servicios/obras-industriales",
  "/servicios/gas",
  "/login",
]

async function check(path) {
  try {
    const res = await fetch(`${BASE}${path}`, { redirect: "follow" })
    return { path, status: res.status, ok: res.ok }
  } catch (e) {
    return { path, status: 0, ok: false, error: String(e.message || e) }
  }
}

const results = await Promise.all(PUBLIC_ROUTES.map(check))
const failed = results.filter((r) => !r.ok || r.status >= 500)

console.log(`\n=== Smoke público (${BASE}) ===`)
for (const r of results) {
  console.log(r.ok ? "✓" : "✗", r.status, r.path, r.error || "")
}
console.log(`\n${results.length - failed.length}/${results.length} OK`)
if (failed.length) process.exit(1)
