/**
 * Portal SaaS Gestión Emprenor (myemprenor.online) — mismo sistema de autenticación
 * para clientes, equipo y empresas en obra.
 */
export const GESTION_EMPRENOR = {
  product: "Gestión Emprenor",
  homeUrl: "https://www.myemprenor.online",
  loginUrl: "https://www.myemprenor.online/login",
  registerUrl: "https://www.myemprenor.online/registro",
} as const

export function portalLoginUrl(fromPath?: string | null): string {
  if (!fromPath) return GESTION_EMPRENOR.loginUrl
  const url = new URL(GESTION_EMPRENOR.loginUrl)
  url.searchParams.set("callbackUrl", fromPath)
  return url.toString()
}
