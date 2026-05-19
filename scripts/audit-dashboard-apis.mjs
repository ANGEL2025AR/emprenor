/**
 * Auditoría APIs GET principales por rol.
 */
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { MongoClient } from "mongodb"
import { SignJWT } from "jose"
import crypto from "node:crypto"

const BASE = process.argv[2] || "http://localhost:3000"
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "emprenor-secret-key-change-in-production-2024",
)
const ROLES = ["super_admin", "admin", "gerente", "supervisor", "trabajador", "cliente"]

const APIS = [
  { path: "/api/auth/me", note: "sesión actual" },
  { path: "/api/projects", note: "proyectos" },
  { path: "/api/tasks", note: "tareas" },
  { path: "/api/clients", note: "clientes" },
  { path: "/api/transactions", note: "finanzas" },
  { path: "/api/invoices", note: "facturas" },
  { path: "/api/quotations", note: "cotizaciones" },
  { path: "/api/contracts", note: "contratos" },
  { path: "/api/payments", note: "pagos" },
  { path: "/api/employees", note: "empleados" },
  { path: "/api/users", note: "usuarios" },
  { path: "/api/inventory", note: "inventario" },
  { path: "/api/suppliers", note: "proveedores" },
  { path: "/api/inspections", note: "inspecciones" },
  { path: "/api/incidents", note: "incidencias" },
  { path: "/api/certificates", note: "certificados" },
  { path: "/api/documents", note: "documentos" },
  { path: "/api/notifications", note: "notificaciones" },
  { path: "/api/calendar", note: "calendario" },
  { path: "/api/public-projects", note: "proyectos públicos (sin auth)" },
  { path: "/api/portal/wallet", note: "portal billetera" },
  { path: "/api/portal/payslips", note: "portal recibos" },
  { path: "/api/contact", note: "contactos (admin)" },
  { path: "/api/admin/roles", note: "roles config" },
]

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex")
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex")
  return `${salt}:${hash}`
}

async function ensureTestUser(db, role) {
  const email = `audit+${role}@emprenor.test`
  let user = await db.collection("users").findOne({ email })
  if (user) return user
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

async function signCookie(user) {
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

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI)
  await client.connect()
  const db = client.db("emprenor")
  const users = await db.collection("users").find({ isActive: true }).toArray()
  await client.close()

  const byRole = {}
  for (const role of ROLES) {
    byRole[role] = users.find((u) => u.role === role) || (await (async () => {
      const c = new MongoClient(process.env.MONGODB_URI)
      await c.connect()
      const u = await ensureTestUser(c.db("emprenor"), role)
      await c.close()
      return u
    })())
  }

  console.log(`\n=== APIs ${BASE} ===\n`)
  const matrix = []

  for (const role of ROLES) {
    const cookie = await signCookie(byRole[role])
    for (const api of APIS) {
      const res = await fetch(`${BASE}${api.path}`, {
        headers: api.path === "/api/public-projects" ? {} : { Cookie: cookie },
      })
      let verdict = res.status
      if (res.ok) verdict = `OK ${res.status}`
      else if (res.status === 401) verdict = "401"
      else if (res.status === 403) verdict = "403"
      else if (res.status >= 500) verdict = `ERR ${res.status}`
      matrix.push({ role, api: api.path, verdict, note: api.note })
    }
  }

  for (const api of APIS) {
    console.log(`\n${api.path} (${api.note})`)
    for (const role of ROLES) {
      const row = matrix.find((m) => m.role === role && m.api === api.path)
      console.log(`  ${role.padEnd(12)} ${row.verdict}`)
    }
  }

  const errors = matrix.filter((m) => String(m.verdict).startsWith("ERR"))
  console.log(`\nErrores 5xx: ${errors.length}`)
  process.exit(errors.length ? 1 : 0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
