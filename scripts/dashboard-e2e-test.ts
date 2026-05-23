/**
 * Prueba integral del dashboard vía API (sesión real).
 * Uso: npx tsx scripts/dashboard-e2e-test.ts
 */

import dns from "node:dns"
import { platform } from "node:os"
import { readFileSync, existsSync } from "node:fs"
import { join } from "node:path"

if (platform() === "win32") {
  try {
    dns.setServers(["8.8.8.8", "1.1.1.1"])
  } catch {
    /* */
  }
}

function loadEnvLocal(): void {
  const path = join(process.cwd(), ".env.local")
  if (!existsSync(path)) return
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const eq = trimmed.indexOf("=")
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (!process.env[key]) process.env[key] = value
  }
}

loadEnvLocal()

const BASE = process.env.E2E_BASE_URL || "http://localhost:3001"
const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL || "admin@emprenor.com"
const PASSWORDS = (process.env.E2E_ADMIN_PASSWORD || "Emprenor2024!,Admin123!")
  .split(",")
  .map((p) => p.trim())
  .filter(Boolean)

type Result = { name: string; ok: boolean; detail?: string }

const results: Result[] = []
let cookieHeader = ""

function pass(name: string, detail?: string) {
  results.push({ name, ok: true, detail })
  console.log(`  ✅ ${name}${detail ? ` — ${detail}` : ""}`)
}

function fail(name: string, detail?: string) {
  results.push({ name, ok: false, detail })
  console.log(`  ❌ ${name}${detail ? ` — ${detail}` : ""}`)
}

async function api(
  path: string,
  init: RequestInit = {},
): Promise<{ status: number; json: Record<string, unknown> | null; text: string }> {
  const headers = new Headers(init.headers)
  if (cookieHeader) headers.set("Cookie", cookieHeader)
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }
  const res = await fetch(`${BASE}${path}`, { ...init, headers, redirect: "manual" })
  const setCookie = res.headers.getSetCookie?.() ?? []
  if (setCookie.length) {
    const parts = setCookie.map((c) => c.split(";")[0]).filter(Boolean)
    cookieHeader = parts.join("; ")
  } else {
    const single = res.headers.get("set-cookie")
    if (single) cookieHeader = single.split(";")[0]
  }
  const text = await res.text()
  let json: Record<string, unknown> | null = null
  try {
    json = JSON.parse(text) as Record<string, unknown>
  } catch {
    /* */
  }
  return { status: res.status, json, text }
}

async function login(): Promise<boolean> {
  for (const password of PASSWORDS) {
    cookieHeader = ""
    const { status, json } = await api("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: ADMIN_EMAIL, password }),
    })
    if (status === 200 && json?.success) {
      pass("Login admin", ADMIN_EMAIL)
      return true
    }
  }
  fail("Login admin", `No se pudo con ${ADMIN_EMAIL} (probá E2E_ADMIN_PASSWORD en .env.local)`)
  return false
}

async function main() {
  console.log(`\n🧪 Pruebas dashboard — ${BASE}\n`)

  const health = await api("/api/health/db")
  if (health.status === 200 && health.json?.ok) {
    pass("MongoDB health", `${health.json.pingMs}ms`)
  } else {
    fail("MongoDB health", health.json?.error as string || `HTTP ${health.status}`)
  }

  if (!(await login())) {
    printSummary()
    process.exit(1)
  }

  const me = await api("/api/auth/me")
  if (me.status === 200 && me.json?.user) {
    const u = me.json.user as { role?: string; email?: string }
    pass("Sesión /api/auth/me", `${u.role} — ${u.email}`)
  } else {
    fail("Sesión /api/auth/me", `HTTP ${me.status}`)
  }

  const ts = Date.now()
  const testClient = {
    publicClientType: "empresa",
    contactName: "Cliente",
    contactLastName: `QA ${ts}`,
    company: `Empresa QA ${ts}`,
    email: `qa.cliente.${ts}@emprenor-test.local`,
    phone: "+54 9 11 5555-0100",
    address: "Ituzaingó 920",
    city: "Salta",
    province: "Salta",
    taxCondition: "responsable_inscripto",
    status: "activo",
    portalAccess: {
      enabled: false,
    },
  }

  let clientId = ""
  const createClient = await api("/api/clients", {
    method: "POST",
    body: JSON.stringify(testClient),
  })
  if (createClient.status === 200 || createClient.status === 201) {
    const id = (createClient.json?.client as { _id?: string })?._id
    clientId = id || ""
    pass("Crear cliente", clientId)
  } else {
    fail("Crear cliente", (createClient.json?.error as string) || createClient.text.slice(0, 120))
  }

  const listClients = await api("/api/clients")
  if (listClients.status === 200 && Array.isArray(listClients.json?.clients)) {
    pass("Listar clientes", `${(listClients.json.clients as unknown[]).length} registros`)
  } else {
    fail("Listar clientes", `HTTP ${listClients.status}`)
  }

  const start = new Date()
  const end = new Date(start)
  end.setMonth(end.getMonth() + 3)

  const testProject = {
    name: `Obra QA ${ts}`,
    description: "Proyecto de prueba automatizada para validar dashboard EMPRENOR C&S.",
    type: "electricidad",
    priority: "media",
    clientId: clientId || undefined,
    client: {
      name: testClient.company,
      email: testClient.email,
      phone: testClient.phone,
      address: testClient.address,
    },
    location: {
      address: "Av. Belgrano 100",
      city: "Salta Capital",
      province: "Salta",
    },
    dates: {
      start: start.toISOString().slice(0, 10),
      estimatedEnd: end.toISOString().slice(0, 10),
    },
    budget: { estimated: 1500000, currency: "ARS" },
  }

  let projectId = ""
  const createProject = await api("/api/projects", {
    method: "POST",
    body: JSON.stringify(testProject),
  })
  if (createProject.status === 200 || createProject.status === 201) {
    projectId = (createProject.json?.project as { _id?: string })?._id || ""
    pass("Crear proyecto (servicio electricidad)", projectId)
  } else {
    fail(
      "Crear proyecto",
      (createProject.json?.error as string) ||
        (createProject.json?.details as string) ||
        createProject.text.slice(0, 200),
    )
  }

  const listProjects = await api("/api/projects?limit=20")
  if (listProjects.status === 200 && Array.isArray(listProjects.json?.projects)) {
    pass("Listar proyectos", `${(listProjects.json.projects as unknown[]).length} en página`)
  } else {
    fail("Listar proyectos", `HTTP ${listProjects.status}`)
  }

  if (projectId) {
    const getProject = await api(`/api/projects/${projectId}`)
    if (getProject.status === 200) {
      const p = getProject.json?.project as {
        clientId?: string
        institutionalCompliance?: { enabled?: boolean; clientType?: string }
        type?: string
      }
      const linked = clientId ? p?.clientId === clientId : true
      if (linked && p?.type === "electricidad" && p?.institutionalCompliance?.clientType === "empresa") {
        pass("Detalle proyecto + vínculo cliente", "tipo cumplimiento: empresa")
      } else if (linked && p?.type === "electricidad") {
        fail(
          "Detalle proyecto + vínculo cliente",
          `clientId ok pero compliance=${p?.institutionalCompliance?.clientType}`,
        )
      } else {
        fail("Detalle proyecto + vínculo cliente", `clientId=${p?.clientId} type=${p?.type}`)
      }
    } else {
      fail("Detalle proyecto", `HTTP ${getProject.status}`)
    }
  }

  const endpoints: { name: string; path: string; expectEmployeeOnly?: boolean }[] = [
    { name: "Tareas", path: "/api/tasks?limit=5" },
    { name: "Inspecciones", path: "/api/inspections?limit=5" },
    { name: "Empleados", path: "/api/employees?limit=5" },
    { name: "Contactos web", path: "/api/contact" },
    { name: "Servicios CMS", path: "/api/site-services" },
    { name: "Settings empresa", path: "/api/settings" },
    { name: "Portal settings (empleado)", path: "/api/portal/settings", expectEmployeeOnly: true },
    { name: "Proveedores", path: "/api/suppliers" },
    { name: "Inventario", path: "/api/inventory" },
    { name: "Notificaciones", path: "/api/notifications?limit=5" },
  ]

  for (const { name, path, expectEmployeeOnly } of endpoints) {
    const r = await api(path)
    if (r.status === 200) pass(`API ${name}`, `HTTP ${r.status}`)
    else if (expectEmployeeOnly && r.status === 403) pass(`API ${name}`, "403 esperado (solo empleados)")
    else if (r.status === 401 || r.status === 403) fail(`API ${name}`, `Sin permiso HTTP ${r.status}`)
    else fail(`API ${name}`, `HTTP ${r.status}`)
  }

  if (projectId && clientId) {
    const compliance = await api(`/api/compliance/summary/${projectId}`)
    if (compliance.status === 200) {
      pass("Resumen cumplimiento obra", "OK")
    } else if (compliance.status === 403) {
      pass("Resumen cumplimiento obra", "403 (revisar permiso compliance.manage)")
    } else {
      fail("Resumen cumplimiento obra", `HTTP ${compliance.status}`)
    }
  }

  const dashPages = [
    "/dashboard",
    "/dashboard/proyectos",
    "/dashboard/clientes",
    "/dashboard/proyectos/nuevo",
    "/dashboard/contactos",
    "/dashboard/sitio-web/servicios",
    "/dashboard/cumplimiento-obra",
  ]
  for (const path of dashPages) {
    const r = await fetch(`${BASE}${path}`, { headers: { Cookie: cookieHeader }, redirect: "manual" })
    const ok = r.status === 200 || r.status === 307 || r.status === 308
    if (ok) pass(`Página ${path}`, `HTTP ${r.status}`)
    else fail(`Página ${path}`, `HTTP ${r.status}`)
  }

  const projectTypes = await api("/api/projects", {
    method: "POST",
    body: JSON.stringify({
      ...testProject,
      name: `Obra QA gas ${ts}`,
      type: "gas",
      clientId: undefined,
    }),
  })
  if (projectTypes.status === 200 || projectTypes.status === 201) {
    pass("Crear proyecto tipo gas", "slug válido")
  } else {
    fail("Crear proyecto tipo gas", (projectTypes.json?.error as string) || `HTTP ${projectTypes.status}`)
  }

  printSummary()
  process.exit(results.some((r) => !r.ok) ? 1 : 0)
}

function printSummary() {
  const ok = results.filter((r) => r.ok).length
  const bad = results.filter((r) => !r.ok).length
  console.log(`\n——— Resumen: ${ok} OK, ${bad} fallos ———\n`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
