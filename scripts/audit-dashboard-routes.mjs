/**
 * Auditoría de rutas dashboard por rol.
 * Uso: node --require ./scripts/dns-windows-atlas.cjs --env-file=.env.local scripts/audit-dashboard-routes.mjs [baseUrl]
 */
import { readFileSync, readdirSync, statSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { MongoClient } from "mongodb"
import { SignJWT } from "jose"
import crypto from "node:crypto"

const __dirname = dirname(fileURLToPath(import.meta.url))
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "emprenor-secret-key-change-in-production-2024",
)
const ROOT = join(__dirname, "..")
const BASE = process.argv[2] || "http://localhost:3000"

const ROUTE_PERMISSION_MAP = {
  "/dashboard/finanzas": ["super_admin", "admin", "gerente"],
  "/dashboard/cotizaciones": ["super_admin", "admin", "gerente"],
  "/dashboard/contratos": ["super_admin", "admin", "gerente"],
  "/dashboard/facturas": ["super_admin", "admin", "gerente"],
  "/dashboard/pagos": ["super_admin", "admin", "gerente"],
  "/dashboard/usuarios": ["super_admin", "admin", "gerente"],
  "/dashboard/empleados": ["super_admin", "admin", "gerente"],
  "/dashboard/reportes": ["super_admin", "admin", "gerente"],
  "/dashboard/automatizaciones": ["super_admin", "admin"],
  "/dashboard/sitio-web": ["super_admin", "admin"],
  "/dashboard/auditoria": ["super_admin", "admin"],
  "/dashboard/contactos": ["super_admin", "admin"],
  "/dashboard/roles": ["super_admin", "admin"],
  "/dashboard/proveedores": ["super_admin", "admin", "gerente"],
  "/dashboard/inventario": ["super_admin", "admin", "gerente", "supervisor"],
  "/dashboard/certificados": ["super_admin", "admin", "gerente", "supervisor", "cliente"],
  "/dashboard/portal": ["super_admin", "admin", "gerente", "supervisor", "trabajador"],
}

const ROLES = ["super_admin", "admin", "gerente", "supervisor", "trabajador", "cliente"]

function collectRoutes(dir, prefix = "/dashboard") {
  const routes = []
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) {
      routes.push(...collectRoutes(full, `${prefix}/${name}`))
    } else if (name === "page.tsx") {
      let route = prefix.replace(/\\/g, "/")
      route = route.replace(/\([^)]+\)/g, "")
      route = route.replace(/\/+/g, "/")
      route = route.replace(/\/\[[^/]+\]/g, "/__id__")
      routes.push(route)
    }
  }
  return [...new Set(routes)].sort()
}

const CLIENT_PATH_PATTERNS = [
  /^\/dashboard\/?$/,
  /^\/dashboard\/perfil\/?$/,
  /^\/dashboard\/configuracion\/?$/,
  /^\/dashboard\/proyectos\/?$/,
  /^\/dashboard\/proyectos\/[a-fA-F0-9]{24}\/?$/,
  /^\/dashboard\/documentos\/?$/,
  /^\/dashboard\/certificados\/?$/,
  /^\/dashboard\/certificados\/[a-fA-F0-9]{24}\/?$/,
  /^\/dashboard\/notificaciones\/?$/,
]

function isClientPathAllowed(pathname) {
  if (/\/nuevo\/?$/.test(pathname) || /\/editar\/?$/.test(pathname)) return false
  return CLIENT_PATH_PATTERNS.some((p) => p.test(pathname))
}

function expectedAccess(pathname, role) {
  if (pathname.startsWith("/admin")) {
    return ["super_admin", "admin"].includes(role) ? "allow" : "redirect_dashboard"
  }
  if (role === "cliente" && pathname.startsWith("/dashboard")) {
    return isClientPathAllowed(pathname) ? "allow" : "redirect_dashboard"
  }
  for (const [prefix, roles] of Object.entries(ROUTE_PERMISSION_MAP)) {
    if (pathname.startsWith(prefix)) {
      return roles.includes(role) ? "allow" : "redirect_dashboard"
    }
  }
  return "allow"
}

function getCookieHeader(setCookie) {
  if (!setCookie) return ""
  const parts = Array.isArray(setCookie) ? setCookie : [setCookie]
  return parts.map((c) => c.split(";")[0]).join("; ")
}

async function signSessionCookie(user) {
  const token = await new SignJWT({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
    name: `${user.name} ${user.lastName || ""}`.trim(),
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(JWT_SECRET)
  return `emprenor_session=${token}`
}

async function fetchRoute(base, path, cookie) {
  const res = await fetch(`${base}${path}`, {
    redirect: "manual",
    headers: cookie ? { Cookie: cookie } : {},
  })
  const loc = res.headers.get("location") || ""
  let finalPath = path
  if (res.status >= 300 && res.status < 400 && loc) {
    try {
      finalPath = new URL(loc, base).pathname
    } catch {
      finalPath = loc
    }
  }
  return { status: res.status, location: loc, finalPath }
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex")
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex")
  return `${salt}:${hash}`
}

async function ensureTestUser(db, role) {
  const email = `audit+${role}@emprenor.test`
  const existing = await db.collection("users").findOne({ email })
  if (existing) return existing
  const now = new Date()
  const doc = {
    email,
    password: hashPassword("AuditTest2024!"),
    name: "Audit",
    lastName: role,
    role,
    permissions: [],
    isActive: true,
    emailVerified: true,
    createdAt: now,
    updatedAt: now,
  }
  const { insertedId } = await db.collection("users").insertOne(doc)
  return { ...doc, _id: insertedId }
}

async function findUsersByRole() {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error("MONGODB_URI requerida")
  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db("emprenor")
  const users = await db
    .collection("users")
    .find({ isActive: true }, { projection: { email: 1, role: 1, name: 1, lastName: 1 } })
    .toArray()

  const byRole = {}
  for (const role of ROLES) {
    byRole[role] = users.filter((u) => u.role === role)
    if (!byRole[role].length) {
      byRole[role] = [await ensureTestUser(db, role)]
      console.log(`(creado usuario de prueba audit+${role}@emprenor.test)`)
    }
  }

  await client.close()
  return { users, byRole }
}

async function main() {
  const dashboardDir = join(ROOT, "app", "(dashboard)", "dashboard")
  const routes = collectRoutes(dashboardDir)
  routes.push("/admin/contactos")

  console.log(`\n=== Auditoría dashboard ===`)
  console.log(`Base URL: ${BASE}`)
  console.log(`Rutas únicas (plantilla): ${routes.length}\n`)

  let usersByRole
  try {
    usersByRole = await findUsersByRole()
  } catch (e) {
    console.error("No se pudo leer usuarios de MongoDB:", e.message)
    process.exit(1)
  }

  const sessions = {}
  for (const role of ROLES) {
    const user = usersByRole.byRole[role]?.[0]
    if (!user) {
      sessions[role] = { ok: false, reason: "sin usuario en DB" }
      continue
    }
    const cookie = await signSessionCookie(user)
    sessions[role] = { ok: true, email: user.email, cookie, role: user.role }
  }

  console.log("--- Sesiones por rol ---")
  for (const role of ROLES) {
    const s = sessions[role]
    console.log(
      `${role}: ${s.ok ? `OK (${s.email})` : `SKIP - ${s.reason}`}`,
    )
  }

  const summary = { ok: 0, redirect: 0, error: 0, skip: 0 }
  const issues = []

  for (const role of ROLES) {
    const session = sessions[role]
    if (!session.ok) {
      summary.skip += routes.length
      continue
    }

    console.log(`\n--- Rol: ${role} ---`)
    for (const route of routes) {
      const exp = expectedAccess(route, role)
      const result = await fetchRoute(BASE, route, session.cookie)
      const status = result.status
      let verdict = "?"
      if (status === 200) verdict = "OK"
      else if (status === 307 || status === 308 || status === 302 || status === 301) verdict = "REDIRECT"
      else if (status === 500) verdict = "ERROR"
      else if (status === 404) verdict = "NOT_FOUND"
      else verdict = String(status)

      const okExpected =
        (exp === "allow" && verdict === "OK") ||
        (exp === "redirect_dashboard" && verdict === "REDIRECT" && result.finalPath === "/dashboard")

      if (okExpected) summary.ok++
      else if (verdict === "REDIRECT") summary.redirect++
      else if (verdict === "ERROR" || verdict === "NOT_FOUND") {
        summary.error++
        issues.push({ role, route, exp, verdict, status, finalPath: result.finalPath })
      } else {
        summary.redirect++
        if (exp === "allow" && verdict === "REDIRECT") {
          issues.push({ role, route, exp, verdict: "blocked_redirect", status, finalPath: result.finalPath })
        }
      }

      const mark = okExpected ? "✓" : "✗"
      if (!okExpected) {
        console.log(
          `${mark} ${route} → ${verdict} ${result.finalPath ? `→ ${result.finalPath}` : ""} (esperado: ${exp})`,
        )
      }
    }
  }

  console.log("\n=== Resumen ===")
  console.log(`Checks OK: ${summary.ok}`)
  console.log(`Redirects inesperados / otros: ${summary.redirect}`)
  console.log(`Errores 404/500: ${summary.error}`)
  console.log(`Rutas omitidas (sin sesión): ${summary.skip}`)

  if (issues.length) {
    console.log(`\n=== Problemas (${issues.length}) ===`)
    for (const i of issues.slice(0, 40)) {
      console.log(`[${i.role}] ${i.route} → ${i.verdict} (${i.status}) esperado ${i.exp}`)
    }
    if (issues.length > 40) console.log(`... y ${issues.length - 40} más`)
  }

  process.exit(issues.length ? 1 : 0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
