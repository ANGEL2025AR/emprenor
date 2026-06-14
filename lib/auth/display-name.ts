export function getUserDisplayName(
  user: { name?: string; lastName?: string; email?: string } | null | undefined,
): string {
  const full = [user?.name, user?.lastName].filter(Boolean).join(" ").trim()
  if (full) return full

  const emailLocal = user?.email?.split("@")[0]?.replace(/[._-]+/g, " ").trim()
  if (emailLocal) {
    return emailLocal.charAt(0).toUpperCase() + emailLocal.slice(1)
  }

  return "Usuario"
}
