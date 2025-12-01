// Utilidades para manejo de contraseñas
import { randomBytes, scryptSync, timingSafeEqual } from "crypto"

const SALT_LENGTH = 16
const KEY_LENGTH = 64

export function hashPassword(password: string): string {
  const salt = randomBytes(SALT_LENGTH).toString("hex")
  const hash = scryptSync(password, salt, KEY_LENGTH).toString("hex")
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, hash] = storedHash.split(":")
  const hashBuffer = Buffer.from(hash, "hex")
  const suppliedHashBuffer = scryptSync(password, salt, KEY_LENGTH)
  return timingSafeEqual(hashBuffer, suppliedHashBuffer)
}

export function generateToken(): string {
  return randomBytes(32).toString("hex")
}

export function generateCode(prefix: string): string {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")
  return `${prefix}-${year}-${random}`
}
