/** Restablece contraseña del admin para pruebas QA. Uso: npx tsx scripts/reset-qa-admin.ts */
import dns from "node:dns"
import { platform } from "node:os"
import { readFileSync, existsSync } from "node:fs"
import { join } from "node:path"
import { MongoClient } from "mongodb"
import { hashPassword } from "../lib/auth/password"

if (platform() === "win32") {
  try {
    dns.setServers(["8.8.8.8", "1.1.1.1"])
  } catch {
    /* */
  }
}

const envPath = join(process.cwd(), ".env.local")
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const t = line.trim()
    if (!t || t.startsWith("#")) continue
    const eq = t.indexOf("=")
    if (eq < 0) continue
    const k = t.slice(0, eq).trim()
    let v = t.slice(eq + 1).trim()
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1)
    if (!process.env[k]) process.env[k] = v
  }
}

const EMAIL = "admin@emprenor.com"
const PASS = process.env.QA_ADMIN_PASSWORD || "Emprenor2024!"

async function main() {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error("MONGODB_URI no definida")
  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db("emprenor")
  const hashed = hashPassword(PASS)
  const r = await db.collection("users").updateOne(
    { email: EMAIL.toLowerCase() },
    {
      $set: {
        password: hashed,
        role: "super_admin",
        isActive: true,
        updatedAt: new Date(),
      },
    },
    { upsert: true },
  )
  console.log(r.matchedCount ? "Admin actualizado" : "Admin creado", EMAIL, PASS)
  await client.close()
}

main().catch(console.error)
