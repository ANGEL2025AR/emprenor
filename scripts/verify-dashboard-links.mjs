/**
 * Verifica enlaces internos /dashboard/* contra páginas existentes.
 * Uso: node scripts/verify-dashboard-links.mjs
 */
import { readFileSync, readdirSync, statSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, "..")

function collectPageRoutes(dir, prefix = "/dashboard") {
  const routes = new Set()
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) {
      for (const r of collectPageRoutes(full, `${prefix}/${name}`)) routes.add(r)
    } else if (name === "page.tsx") {
      let route = prefix.replace(/\\/g, "/")
      route = route.replace(/\([^)]+\)/g, "")
      route = route.replace(/\/+/g, "/")
      routes.add(route)
    }
  }
  return routes
}

function routeMatches(path, routes) {
  const normalized = path.split("?")[0].replace(/\/$/, "") || "/dashboard"
  if (routes.has(normalized)) return true
  for (const r of routes) {
    const pattern = r.replace(/\[[^\]]+\]/g, "[^/]+")
    if (new RegExp(`^${pattern}$`).test(normalized)) return true
  }
  // dynamic segment: /dashboard/foo/bar -> check if parent list exists
  const parts = normalized.split("/")
  while (parts.length > 2) {
    parts.pop()
    const parent = parts.join("/")
    if (routes.has(parent)) return true
  }
  return false
}

function scanFiles(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) {
      if (name === "node_modules" || name === ".next") continue
      scanFiles(full, acc)
    } else if (/\.(tsx|ts|jsx|js)$/.test(name)) {
      acc.push(full)
    }
  }
  return acc
}

const dashboardDir = join(ROOT, "app/(dashboard)/dashboard")
const routes = collectPageRoutes(dashboardDir)
const linkRe = /(?:href|push)\s*=\s*[`'"](\/dashboard[^`'"]+)[`'"]/g
const broken = new Map()

for (const file of scanFiles(ROOT)) {
  if (file.includes("node_modules")) continue
  const content = readFileSync(file, "utf8")
  let m
  while ((m = linkRe.exec(content))) {
    const path = m[1].split("?")[0]
    if (path.includes("${") || path.includes("__id__")) continue
    if (!routeMatches(path, routes)) {
      const key = path
      if (!broken.has(key)) broken.set(key, [])
      broken.get(key).push(file.replace(ROOT, ""))
    }
  }
}

console.log("Rutas de página encontradas:", routes.size)
if (broken.size === 0) {
  console.log("OK: No se detectaron enlaces rotos a /dashboard/*")
  process.exit(0)
}

console.log("\nEnlaces posiblemente sin página (" + broken.size + "):")
for (const [path, files] of [...broken.entries()].sort()) {
  console.log("\n ", path)
  for (const f of [...new Set(files)].slice(0, 3)) console.log("    -", f)
}
process.exit(1)
