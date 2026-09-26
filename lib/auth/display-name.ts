const PRESERVED = new Set(["qa", "emprenor", "noa"])

function cleanPart(value?: string | null): string {
  return (value || "").replace(/\s+/g, " ").trim()
}

function formatNameToken(token: string): string {
  const lower = token.toLowerCase()
  if (PRESERVED.has(lower) || (token.length <= 3 && token === token.toUpperCase() && /[A-ZÁÉÍÓÚÑ]/.test(token))) {
    return token.toUpperCase()
  }
  if (token !== token.toLowerCase() && token !== token.toUpperCase()) return token
  return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase()
}

function formatPersonName(value: string): string {
  return value
    .split(" ")
    .filter(Boolean)
    .map(formatNameToken)
    .join(" ")
}

export function getUserDisplayName(
  user: { name?: string | null; lastName?: string | null; email?: string | null } | null | undefined,
): string {
  const name = cleanPart(user?.name)
  const lastName = cleanPart(user?.lastName)

  let full = ""
  if (name && lastName) {
    const nameLower = name.toLowerCase()
    const lastLower = lastName.toLowerCase()
    if (nameLower === lastLower || nameLower.endsWith(` ${lastLower}`)) full = name
    else if (lastLower.endsWith(` ${nameLower}`)) full = lastName
    else full = `${name} ${lastName}`
  } else {
    full = name || lastName
  }

  if (full) return formatPersonName(full)

  const emailLocal = user?.email?.split("@")[0]?.replace(/[._-]+/g, " ").trim()
  if (emailLocal) return formatPersonName(emailLocal)

  return "Usuario"
}

export function getUserInitials(
  user: { name?: string | null; lastName?: string | null; email?: string | null } | null | undefined,
): string {
  const display = getUserDisplayName(user)
  if (display === "Usuario") return "U"
  const parts = display.split(" ").filter(Boolean)
  const first = parts[0]?.charAt(0) || "U"
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : ""
  return `${first}${last}`.toUpperCase()
}
