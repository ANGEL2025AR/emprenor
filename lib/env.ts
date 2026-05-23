/**
 * Validación mínima de variables de entorno.
 * En producción, falla el arranque si faltan secretos críticos.
 */

const isProduction = process.env.NODE_ENV === "production"

function requireEnv(name: string, minLength = 1): string {
  const value = process.env[name]?.trim()
  if (!value || value.length < minLength) {
    if (isProduction) {
      throw new Error(
        `[EMPRENOR] La variable de entorno ${name} es obligatoria en producción` +
          (minLength > 1 ? ` (mínimo ${minLength} caracteres)` : ""),
      )
    }
    return ""
  }
  return value
}

export function getMongoUri(): string {
  const uri = requireEnv("MONGODB_URI")
  if (!uri && !isProduction) {
    return process.env.MONGODB_URI || ""
  }
  return uri
}

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET?.trim()
  if (isProduction) {
    if (!secret || secret.length < 32) {
      throw new Error("[EMPRENOR] JWT_SECRET debe tener al menos 32 caracteres en producción")
    }
    return secret
  }
  return secret || "dev-only-emprenor-jwt-secret-not-for-production"
}

export function getAdminSetupKey(): string | null {
  const key = process.env.ADMIN_SETUP_KEY?.trim()
  if (isProduction && !key) {
    throw new Error("[EMPRENOR] ADMIN_SETUP_KEY es obligatoria en producción para el setup inicial")
  }
  return key || null
}

export function isPublicRegistrationAllowed(): boolean {
  return process.env.ALLOW_PUBLIC_REGISTRATION === "true"
}
