import { getJwtSecret } from "@/lib/env"

let cachedKey: Uint8Array | null = null

export function getJwtSecretKey(): Uint8Array {
  if (!cachedKey) {
    cachedKey = new TextEncoder().encode(getJwtSecret())
  }
  return cachedKey
}
