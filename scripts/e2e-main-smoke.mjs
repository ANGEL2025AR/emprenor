/**
 * E2E prueba completa — sitio principal EMPRENOR
 * node scripts/e2e-main-smoke.mjs [baseUrl]
 */
import { readFileSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const BASE = process.argv[2] || process.env.BASE_URL || "http://localhost:3000"
const TS = Date.now()

function loadEnv() {
  try {
    const content = readFileSync(join(__dirname, "..", ".env.local"), "utf8")
    for (const line of content.split("\n")) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith("#")) continue
      const eq = trimmed.indexOf("=")
      if (eq === -1) continue
      process.env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim()
    }
  } catch {
    /* optional */
  }
}

loadEnv()

const ADMIN_PASSWORDS = [
  process.env.E2E_ADMIN_PASSWORD,
  "Emprenor-E2E-2026!",
  "Admin123!",
  "Emprenor2024!",
].filter(Boolean)

let cookie = ""
const results = []

async function req(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      ...(options.body && !(options.body instanceof FormData) ? { "Content-Type": "application/json" } : {}),
      Cookie: cookie,
      ...(options.headers || {}),
    },
  })
  const setCookie = res.headers.getSetCookie?.() || []
  if (setCookie.length) {
    cookie = setCookie.map((c) => c.split(";")[0]).join("; ")
  }
  let json = null
  const text = await res.text()
  try {
    json = JSON.parse(text)
  } catch {
    json = { raw: text.slice(0, 300) }
  }
  return { ok: res.ok, status: res.status, json }
}

function pass(name) {
  results.push({ name, ok: true })
  console.log(`✓ ${name}`)
}

function fail(name, detail) {
  results.push({ name, ok: false, detail })
  console.error(`✗ ${name}: ${detail}`)
}

async function login() {
  for (const password of ADMIN_PASSWORDS) {
    cookie = ""
    const res = await req("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "admin@emprenor.com", password }),
    })
    if (res.ok) {
      pass(`Login admin (${password === ADMIN_PASSWORDS[0] ? "env" : "fallback"})`)
      return true
    }
  }
  fail("Login admin", "Ninguna contraseña funcionó")
  return false
}

async function main() {
  console.log(`\nE2E EMPRENOR principal → ${BASE}\n`)

  if (!(await login())) process.exit(1)

  const me = await req("/api/auth/me")
  if (!me.ok) fail("GET /api/auth/me", me.status)
  else pass("GET /api/auth/me")

  const clientUserEmail = `cliente-prueba-${TS}@emprenor.com`
  const portalUser = await req("/api/users", {
    method: "POST",
    body: JSON.stringify({
      email: clientUserEmail,
      name: "Cliente",
      lastName: `Prueba ${TS}`,
      phone: "+5493876543210",
      role: "cliente",
      password: "Prueba2026!",
      isActive: true,
    }),
  })

  const linkedClientId = portalUser.json?.linkedClientId
  if (!portalUser.ok || !linkedClientId) {
    fail("POST usuario cliente (auto-ficha)", portalUser.json?.error || portalUser.status)
    process.exit(1)
  }
  pass(`POST usuario cliente → linkedClientId=${linkedClientId}`)

  const clients = await req("/api/clients")
  const clientInList = clients.json?.clients?.find(
    (c) => c._id === linkedClientId || c.email === clientUserEmail,
  )
  if (!clients.ok || !clientInList) {
    fail("GET clientes (ficha automática visible)", clients.status)
  } else {
    pass("GET clientes — ficha automática en listado")
  }

  const project = await req("/api/projects", {
    method: "POST",
    body: JSON.stringify({
      name: `Obra Prueba E2E ${TS}`,
      description: "Proyecto de verificación automatizada del sistema EMPRENOR",
      type: "construccion",
      priority: "media",
      clientId: linkedClientId,
      client: {
        name: "Cliente Prueba",
        email: clientUserEmail,
        phone: "+5493876543210",
        address: "Av. Test 123",
      },
      location: {
        address: "Obra Calle Falsa 456",
        city: "Salta",
        province: "Salta",
      },
      dates: {
        start: "2026-06-16",
        estimatedEnd: "2026-12-31",
      },
      budget: { estimated: 1500000, currency: "ARS" },
    }),
  })

  const projectId = project.json?.project?._id
  if (!project.ok || !projectId) {
    fail("POST proyecto", project.json?.message || project.json?.error || project.status)
    process.exit(1)
  }
  pass(`POST proyecto id=${projectId}`)

  const serviceCount = project.json?.project?.serviceLines?.length ?? 0
  if (serviceCount < 12) {
    fail("Servicios automáticos en proyecto", `esperado 12, recibido ${serviceCount}`)
  } else {
    pass(`Servicios automáticos (${serviceCount} líneas)`)
  }

  const projectGet = await req(`/api/projects/${projectId}`)
  const clientUserId = projectGet.json?.project?.clientUserId
  if (!projectGet.ok) fail("GET proyecto", projectGet.status)
  else if (!clientUserId) fail("clientUserId asignado al vincular cliente", "vacío")
  else pass("clientUserId asignado automáticamente")

  const form = new FormData()
  form.append("file", new Blob(["%PDF-1.4 test cliente"], { type: "application/pdf" }), "plano-prueba.pdf")
  form.append("projectId", projectId)
  form.append("type", "plano")
  form.append("name", "Plano prueba cliente")
  form.append("access", "privado")
  const docClient = await req("/api/documents/upload", { method: "POST", body: form })
  if (!docClient.ok) fail("POST documento visible cliente", docClient.json?.error)
  else pass("POST documento visible para cliente")

  const formInt = new FormData()
  formInt.append("file", new Blob(["interno"], { type: "application/pdf" }), "interno.pdf")
  formInt.append("projectId", projectId)
  formInt.append("type", "informe")
  formInt.append("name", "Informe interno admin")
  formInt.append("access", "equipo")
  const docInt = await req("/api/documents/upload", { method: "POST", body: formInt })
  if (!docInt.ok) fail("POST documento interno", docInt.json?.error)
  else pass("POST documento interno (equipo)")

  cookie = ""
  const clientLogin = await req("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: clientUserEmail, password: "Prueba2026!" }),
  })
  if (!clientLogin.ok) {
    fail("Login usuario cliente", clientLogin.json?.error)
  } else {
    pass("Login usuario cliente portal")
  }

  const clientDocs = await req(`/api/documents?projectId=${projectId}`)
  const docs = clientDocs.json?.documents || []
  const seesInternal = docs.some((d) => d.access === "equipo")
  const seesClient = docs.some((d) => d.access === "privado")
  if (!clientDocs.ok) fail("GET documentos como cliente", clientDocs.status)
  else if (seesInternal) fail("Aislamiento docs cliente", "ve documentos internos")
  else if (!seesClient) fail("Docs cliente visibles", "no ve documento privado")
  else pass("Cliente solo ve documentos compartidos (no internos)")

  const clientProjects = await req("/api/projects")
  const hasProject = clientProjects.json?.projects?.some((p) => p._id === projectId)
  if (!clientProjects.ok) fail("GET proyectos como cliente", clientProjects.status)
  else if (!hasProject) fail("Cliente ve su proyecto", "no encontrado")
  else pass("Cliente ve solo su proyecto asignado")

  const otherProjects = clientProjects.json?.projects?.filter((p) => p._id !== projectId) || []
  if (otherProjects.length > 0) {
    fail("Aislamiento proyectos", `cliente ve ${otherProjects.length} proyectos ajenos`)
  } else {
    pass("Cliente no ve proyectos ajenos en su listado")
  }

  const failed = results.filter((r) => !r.ok)
  console.log(`\n--- ${results.length - failed.length}/${results.length} pruebas OK ---\n`)
  if (failed.length) {
    console.log("Datos de prueba creados:")
    console.log(`  Cliente email: ${clientUserEmail}`)
    console.log(`  Cliente password: Prueba2026!`)
    console.log(`  Proyecto ID: ${projectId}`)
    process.exit(1)
  }

  console.log("Datos de prueba creados:")
  console.log(`  Usuario cliente: ${clientUserEmail} / Prueba2026!`)
  console.log(`  Ficha cliente ID: ${linkedClientId}`)
  console.log(`  Proyecto: ${projectId}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
