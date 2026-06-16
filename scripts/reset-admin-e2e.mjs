import { readFileSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { MongoClient } from "mongodb"
import { randomBytes, scryptSync } from "node:crypto"

const __dirname = dirname(fileURLToPath(import.meta.url))

function loadEnv() {
  const content = readFileSync(join(__dirname, "..", ".env.local"), "utf8")
  for (const line of content.split("\n")) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const eq = trimmed.indexOf("=")
    if (eq === -1) continue
    process.env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim()
  }
}

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex")
  const hash = scryptSync(password, salt, 64).toString("hex")
  return `${salt}:${hash}`
}

loadEnv()

const PASSWORD = process.env.E2E_ADMIN_PASSWORD || "Emprenor-E2E-2026!"
const EMAIL = "admin@emprenor.com"

const client = new MongoClient(process.env.MONGODB_URI)
await client.connect()
const db = client.db("emprenor")
const users = db.collection("users")

const existing = await users.findOne({ email: EMAIL })
const hash = hashPassword(PASSWORD)

if (existing) {
  await users.updateOne(
    { email: EMAIL },
    {
      $set: {
        password: hash,
        isActive: true,
        role: "super_admin",
        updatedAt: new Date(),
      },
    },
  )
  console.log(`Admin actualizado: ${EMAIL}`)
} else {
  await users.insertOne({
    email: EMAIL,
    password: hash,
    name: "Administrador",
    lastName: "EMPRENOR",
    role: "super_admin",
    permissions: [],
    isActive: true,
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  console.log(`Admin creado: ${EMAIL}`)
}

console.log(`Contraseña E2E: ${PASSWORD}`)
await client.close()
