/**
 * Sincroniza MongoDB con marca EMPRENOR C&S, servicios CMS e índices.
 *
 * Uso:
 *   npm run db:sync
 *   npm run db:test
 */

import dns from "node:dns"
import { platform } from "node:os"

if (platform() === "win32") {
  try {
    dns.setServers(["8.8.8.8", "1.1.1.1"])
  } catch {
    /* DNS del sistema */
  }
}

import { readFileSync, existsSync } from "node:fs"
import { join } from "node:path"
import { MongoClient } from "mongodb"
import {
  runFullDatabaseSync,
  testDatabaseConnection,
} from "../lib/db/maintenance"

function loadEnvLocal(): void {
  const path = join(process.cwd(), ".env.local")
  if (!existsSync(path)) return
  const content = readFileSync(path, "utf8")
  for (const line of content.split(/\r?\n/)) {
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

async function main(): Promise<void> {
  loadEnvLocal()

  const mode = process.argv[2] || "sync"
  const uri = process.env.MONGODB_URI?.trim()

  if (!uri) {
    console.error("❌ MONGODB_URI no está definida. Configurá .env.local o variables de entorno.")
    process.exit(1)
  }

  console.log(`\n🔌 Conectando a MongoDB (${mode})...\n`)

  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 15000,
    socketTimeoutMS: 45000,
  })

  try {
    await client.connect()
    const db = client.db("emprenor")

    if (mode === "test") {
      const health = await testDatabaseConnection(db)
      printHealth(health)
      process.exit(health.ok ? 0 : 1)
    }

    const result = await runFullDatabaseSync(db)

    printHealth(result.connection)
    console.log("\n📇 Índices verificados:", result.indexes.length)
    console.log("🏢 Configuración empresa:", result.companySettings ? "OK" : "falló")
    console.log("👤 Portal empleado:", result.portalSettings ? "OK" : "falló")
    console.log(
      `🛠️  Servicios CMS: ${result.siteServices.updated}/${result.siteServices.total} actualizados o insertados`,
    )
    console.log(
      `🖼️  Portadas CMS: ${result.sitePages.updated} páginas (${result.sitePages.slugs.join(", ")})`,
    )
    console.log(
      `🧹 Limpieza marca legacy: ${result.brandCleanup.siteServices} servicios, ${result.brandCleanup.sitePages} páginas`,
    )

    if (!result.connection.ok) {
      process.exit(1)
    }

    console.log("\n✅ Sincronización completada.\n")
  } catch (error) {
    console.error("\n❌ Error:", error instanceof Error ? error.message : error)
    process.exit(1)
  } finally {
    await client.close()
  }
}

function printHealth(health: Awaited<ReturnType<typeof testDatabaseConnection>>): void {
  if (health.ok) {
    console.log(`✅ Conexión OK — base "${health.database}" (${health.pingMs} ms)`)
    console.log("\nColecciones:")
    for (const c of health.collections) {
      console.log(`  • ${c.name}: ${c.count} documentos`)
    }
  } else {
    console.error(`❌ Conexión fallida — ${health.error}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
