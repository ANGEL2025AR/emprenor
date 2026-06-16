import { readFileSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { MongoClient } from "mongodb"
import { scryptSync, timingSafeEqual } from "node:crypto"

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

loadEnv()

const PASSWORD = "Emprenor-E2E-2026!"
const client = new MongoClient(process.env.MONGODB_URI)
await client.connect()
const db = client.db("emprenor")
const users = await db.collection("users").find({ email: /admin/i }).toArray()
console.log("Admins:", users.length)
for (const u of users) {
  const [salt, hash] = u.password.split(":")
  const ok = timingSafeEqual(Buffer.from(hash, "hex"), scryptSync(PASSWORD, salt, 64))
  console.log({ email: u.email, role: u.role, isActive: u.isActive, pwOk: ok })
}
await client.close()

const base = process.argv[2] || "http://localhost:3000"
const res = await fetch(`${base}/api/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "admin@emprenor.com", password: PASSWORD }),
})
const json = await res.json()
console.log("API login:", res.status, json)
