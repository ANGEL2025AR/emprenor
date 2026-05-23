/**
 * Prueba de extremo a extremo: web pública, contacto, registro, login cliente y panel admin.
 * Uso: npm run test:platform
 */

import dns from "node:dns"
import { platform } from "node:os"
import { readFileSync, existsSync } from "node:fs"
import { join } from "node:path"
import { PUBLIC_PAGES } from "../lib/platform/active-routes"

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
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD || "Emprenor2024!"

type Result = { name: string; ok: boolean; detail?: string }
const results: Result[] = []

function pass(name: string, detail?: string) {
  results.push({ name, ok: true, detail })
  console.log(`  ✅ ${name}${detail ? ` — ${detail}` : ""}`)
}

function fail(name: string, detail?: string) {
  results.push({ name, ok: false, detail })
  console.log(`  ❌ ${name}${detail ? ` — ${detail}` : ""}`)
}

async function fetchPage(path: string): Promise<number> {
  const res = await fetch(`${BASE}${path}`, { redirect: "manual" })
  return res.status
}

async function api(
  path: string,
  init: RequestInit = {},
  cookie = "",
): Promise<{ status: number; json: Record<string, unknown> | null; cookies: string }> {
  const headers = new Headers(init.headers)
  if (cookie) headers.set("Cookie", cookie)
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json")
  const res = await fetch(`${BASE}${path}`, { ...init, headers, redirect: "manual" })
  const setCookie = res.headers.getSetCookie?.() ?? []
  const cookies =
    setCookie.length > 0
      ? setCookie.map((c) => c.split(";")[0]).join("; ")
      : res.headers.get("set-cookie")?.split(";")[0] ?? cookie
  const text = await res.text()
  let json: Record<string, unknown> | null = null
  try {
    json = JSON.parse(text) as Record<string, unknown>
  } catch {
    /* */
  }
  return { status: res.status, json, cookies }
}

function printSummary() {
  const ok = results.filter((r) => r.ok).length
  const bad = results.filter((r) => !r.ok).length
  console.log(`\n——— Resumen plataforma: ${ok} OK, ${bad} fallos ———\n`)
}

async function main() {
  console.log(`\n🌐 Pruebas plataforma EMPRENOR — ${BASE}\n`)

  const health = await api("/api/health/db")
  if (health.status === 200 && health.json?.ok) pass("MongoDB", `${health.json.pingMs}ms`)
  else fail("MongoDB", `HTTP ${health.status}`)

  for (const path of PUBLIC_PAGES) {
    const status = await fetchPage(path)
    if (status === 200) pass(`Pública ${path}`, "200")
    else fail(`Pública ${path}`, `HTTP ${status}`)
  }

  const services = await api("/api/site-services")
  if (services.status === 200 && Array.isArray(services.json?.services)) {
    pass("CMS servicios", `${(services.json.services as unknown[]).length} publicados`)
  } else {
    fail("CMS servicios", `HTTP ${services.status}`)
  }

  const ts = Date.now()
  const contact = await api("/api/contact", {
    method: "POST",
    body: JSON.stringify({
      name: "Prueba QA",
      email: `qa.contacto.${ts}@emprenor-test.local`,
      phone: "+54 9 387 5550100",
      service: "construccion",
      clientType: "empresa",
      message: "Mensaje de prueba automatizada desde platform-e2e-test.",
    }),
  })
  if (contact.status === 200 && contact.json?.success) pass("Formulario contacto", "guardado en MongoDB")
  else fail("Formulario contacto", (contact.json?.error as string) || `HTTP ${contact.status}`)

  const regEmail = `qa.registro.${ts}@emprenor-test.local`
  const register = await api("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({
      registrationIntent: "cotizacion",
      publicClientType: "empresa",
      name: "QA",
      lastName: "Registro",
      email: regEmail,
      phone: "+54 9 387 5550200",
      company: `Empresa QA ${ts}`,
      address: "Ituzaingó 920",
      city: "Salta",
      province: "Salta",
      message: "Registro de prueba E2E",
      password: "EmprenorQA1",
      confirmPassword: "EmprenorQA1",
    }),
  })
  if (register.status === 200 || register.status === 201) {
    pass("Registro público", regEmail)
    const pendingLogin = await api("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: regEmail, password: "EmprenorQA1" }),
    })
    if (pendingLogin.status === 403) pass("Registro pendiente activación", "403 esperado")
    else fail("Registro pendiente activación", `HTTP ${pendingLogin.status}`)
  } else if (register.status === 403) {
    pass("Registro público", "403 — deshabilitado en este entorno")
  } else {
    fail("Registro público", (register.json?.error as string) || `HTTP ${register.status}`)
  }

  let adminCookie = ""
  const adminLogin = await api("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  })
  if (adminLogin.status === 200 && adminLogin.json?.success) {
    adminCookie = adminLogin.cookies
    pass("Login admin", ADMIN_EMAIL)
  } else {
    fail("Login admin", (adminLogin.json?.error as string) || `HTTP ${adminLogin.status}`)
    printSummary()
    process.exit(1)
  }

  const clientEmail = `qa.portal.${ts}@emprenor-test.local`
  const clientPass = "EmprenorQA2!"
  const createClient = await api(
    "/api/clients",
    {
      method: "POST",
      body: JSON.stringify({
        publicClientType: "persona",
        contactName: "Cliente",
        contactLastName: "Portal QA",
        email: clientEmail,
        phone: "+54 9 387 5550300",
        address: "Belgrano 100",
        city: "Salta",
        province: "Salta",
        taxCondition: "consumidor_final",
        status: "activo",
        portalAccess: { enabled: true, password: clientPass, confirmPassword: clientPass, isActive: true },
      }),
    },
    adminCookie,
  )
  let clientId = ""
  if (createClient.status === 201 && createClient.json?.portalUser) {
    clientId = (createClient.json.client as { _id?: string })?._id || ""
    pass("Alta cliente + portal", clientId)
  } else {
    fail("Alta cliente + portal", (createClient.json?.error as string) || `HTTP ${createClient.status}`)
  }

  let clientCookie = ""
  const clientLogin = await api("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: clientEmail, password: clientPass }),
  })
  if (clientLogin.status === 200 && clientLogin.json?.success) {
    clientCookie = clientLogin.cookies
    pass("Login cliente portal", clientEmail)
  } else {
    fail("Login cliente portal", (clientLogin.json?.error as string) || `HTTP ${clientLogin.status}`)
  }

  if (clientCookie) {
    const me = await api("/api/auth/me", {}, clientCookie)
    if (me.status === 200 && (me.json?.user as { role?: string })?.role === "cliente") {
      pass("Sesión cliente", "rol cliente")
    } else {
      fail("Sesión cliente", `HTTP ${me.status}`)
    }
    for (const path of ["/dashboard", "/dashboard/mi-obra", "/dashboard/documentos"]) {
      const status = await fetch(`${BASE}${path}`, { headers: { Cookie: clientCookie }, redirect: "manual" }).then(
        (r) => r.status,
      )
      if (status === 200) pass(`Cliente ${path}`, "200")
      else fail(`Cliente ${path}`, `HTTP ${status}`)
    }
    const blocked = await fetch(`${BASE}/dashboard/finanzas`, {
      headers: { Cookie: clientCookie },
      redirect: "manual",
    }).then((r) => r.status)
    if (blocked === 307 || blocked === 308 || blocked === 302) pass("Cliente bloqueado finanzas", "redirect")
    else fail("Cliente bloqueado finanzas", `HTTP ${blocked}`)
  }

  if (clientId && adminCookie) {
    const project = await api(
      "/api/projects",
      {
        method: "POST",
        body: JSON.stringify({
          name: `Obra portal QA ${ts}`,
          description: "Proyecto E2E para validar portal cliente EMPRENOR C&S.",
          type: "construccion",
          priority: "media",
          clientId,
          client: {
            name: "Cliente Portal QA",
            email: clientEmail,
            phone: "+54 9 387 5550300",
            address: "Belgrano 100",
          },
          location: { address: "Belgrano 100", city: "Salta", province: "Salta" },
          dates: {
            start: new Date().toISOString(),
            estimatedEnd: new Date(Date.now() + 90 * 86400000).toISOString(),
          },
          budget: { estimated: 100000, approved: 100000, spent: 0, currency: "ARS" },
          status: "en_progreso",
          progress: 25,
        }),
      },
      adminCookie,
    )
    if (project.status === 200 || project.status === 201) {
      pass("Proyecto vinculado a cliente", "OK")
    } else {
      fail("Proyecto vinculado a cliente", (project.json?.error as string) || `HTTP ${project.status}`)
    }
  }

  const contactsAdmin = await api("/api/contact", {}, adminCookie)
  if (contactsAdmin.status === 200 && Array.isArray(contactsAdmin.json?.contactos)) {
    pass("Admin consultas web", `${(contactsAdmin.json.contactos as unknown[]).length} en bandeja`)
  } else {
    fail("Admin consultas web", `HTTP ${contactsAdmin.status}`)
  }

  printSummary()
  process.exit(results.some((r) => !r.ok) ? 1 : 0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
