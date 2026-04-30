/**
 * URL pública del sitio (producción: https://www.emprenor.com).
 * En Vercel, definí NEXT_PUBLIC_SITE_URL para previsualizaciones o dominios alternativos.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://www.emprenor.com"
).replace(/\/$/, "")

/** Base URL para que Server Components llamen a rutas /api del mismo despliegue (Vercel o local). */
export function getInternalAppUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "")
  if (explicit) return explicit
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return "http://localhost:3000"
}
