// Server-only: funciones de permisos que acceden a MongoDB
// Este archivo NO debe importarse desde Client Components

import { getDb } from "@/lib/db/connection"
import { DEFAULT_PERMISSIONS } from "@/lib/auth/permissions"

// ============================================
// CACHE DE PERMISOS DINÁMICOS
// ============================================

let dynamicPermissionsCache: Record<string, string[]> | null = null
let cacheTimestamp = 0
const CACHE_TTL = 60000

export async function loadDynamicPermissions(): Promise<Record<string, string[]>> {
  const now = Date.now()
  if (dynamicPermissionsCache && now - cacheTimestamp < CACHE_TTL) {
    return dynamicPermissionsCache
  }

  try {
    const db = await getDb()
    const config = await db.collection("roles_config").findOne({ type: "permissions_override" })

    if (config?.permissions) {
      dynamicPermissionsCache = { ...DEFAULT_PERMISSIONS, ...config.permissions }
    } else {
      dynamicPermissionsCache = { ...DEFAULT_PERMISSIONS }
    }
    cacheTimestamp = now
    return dynamicPermissionsCache
  } catch {
    return { ...DEFAULT_PERMISSIONS }
  }
}

export function invalidatePermissionsCache(): void {
  dynamicPermissionsCache = null
  cacheTimestamp = 0
}
