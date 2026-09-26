const LOWER_WORDS = new Set(["de", "del", "la", "las", "el", "los", "y", "e", "o", "u", "en", "a"])
const ACRONYMS = new Set(["noa", "upateco", "sst", "aea", "enargas", "cirsoc", "iva", "cuit", "rfi", "art", "fao"])
const WORD_FIXES: Record<string, string> = {
  joaquin: "Joaquín",
  gonzales: "González",
  gonzalez: "González",
  tucuman: "Tucumán",
  martin: "Martín",
  salon: "Salón",
  multiples: "Múltiples",
  electrico: "Eléctrico",
  electrica: "Eléctrica",
}

function formatToken(token: string, isFirst: boolean): string {
  const match = token.match(/^([^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]*)([A-Za-zÁÉÍÓÚÜÑáéíóúüñ.]+)([^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]*)$/)
  if (!match) return token

  const [, prefix, core, suffix] = match
  const hasDot = core.endsWith(".")
  const bare = core.replace(/\./g, "")
  const lower = bare.toLowerCase()

  if (ACRONYMS.has(lower)) return `${prefix}${bare.toUpperCase()}${hasDot ? "." : ""}${suffix}`
  if (!isFirst && !hasDot && LOWER_WORDS.has(lower)) return `${prefix}${lower}${suffix}`

  const fixed = WORD_FIXES[lower] || bare.charAt(0).toUpperCase() + bare.slice(1).toLowerCase()
  return `${prefix}${fixed}${hasDot ? "." : ""}${suffix}`
}

/** Unifica mayúsculas, espacios y nombres propios en títulos y ubicaciones públicas. */
export function formatPublicLabel(value: string | null | undefined): string {
  if (!value?.trim()) return ""

  const cleaned = value
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:)])/g, "$1")
    .replace(/([,.;:])(?=\S)/g, "$1 ")
    .replace(/\(\s+/g, "(")
    .trim()

  return cleaned
    .split(" ")
    .filter(Boolean)
    .map((token, index) => formatToken(token, index === 0))
    .join(" ")
    .replace(/\s+([,.;:)])/g, "$1")
}

const TYPO_PATTERNS: Array<[RegExp, string]> = [
  [/\binsfraestructuras\b/gi, "infraestructuras"],
  [/\binsfraestructura\b/gi, "infraestructura"],
  [/\binslaciones\b/gi, "instalaciones"],
  [/\binslacion\b/gi, "instalación"],
  [/\binstalacion\b/gi, "instalación"],
  [/\belectricas\b/gi, "eléctricas"],
  [/\belectrica\b/gi, "eléctrica"],
]

function applyTypos(value: string): string {
  return TYPO_PATTERNS.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), value)
}

/** Corrige erratas y baja los textos gritados a oración legible, sin alterar párrafos ya redactados. */
export function formatPublicCopy(value: string | null | undefined): string {
  if (!value?.trim()) return ""

  const cleaned = value
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:)])/g, "$1")
    .replace(/([,.;:])(?=\S)/g, "$1 ")
    .trim()

  const letters = cleaned.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g, "")
  const uppercase = letters.replace(/[^A-ZÁÉÍÓÚÜÑ]/g, "")
  const shouted = letters.length > 12 && uppercase.length / letters.length > 0.7
  const corrected = applyTypos(shouted ? cleaned.toLowerCase() : cleaned)

  return shouted ? formatPublicLabel(corrected) : corrected
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;"
      case "<":
        return "&lt;"
      case ">":
        return "&gt;"
      case '"':
        return "&quot;"
      default:
        return "&#39;"
    }
  })
}
