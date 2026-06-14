/** Desactiva el optimizador solo para uploads y data URLs; el resto pasa por /_next/image (evita bloqueos CSP). */
export function shouldUnoptimizeImage(src: string | null | undefined): boolean {
  if (!src) return false
  const s = src.trim()
  return s.startsWith("/uploads") || s.startsWith("data:") || s.startsWith("blob:")
}
