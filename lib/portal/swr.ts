/** Fetchers SWR alineados con las respuestas JSON de /api/portal/* */

export function createPortalListFetcher(listKey: string) {
  return async (url: string): Promise<Record<string, unknown>[]> => {
    const res = await fetch(url)
    const json = await res.json()
    if (!res.ok) return []
    if (Array.isArray(json)) return json
    const list = json[listKey]
    return Array.isArray(list) ? list : []
  }
}

export async function portalWalletFetcher(url: string) {
  const res = await fetch(url)
  const json = await res.json()
  if (!res.ok) {
    return { wallet: null as { balance?: number; aguinaldo?: number; advances?: number } | null, movements: [] }
  }
  return {
    wallet: json.wallet ?? null,
    movements: Array.isArray(json.movements) ? json.movements : [],
  }
}

export async function portalPersonnelFetcher(url: string) {
  const res = await fetch(url)
  const json = await res.json()
  if (!res.ok) return { file: null }
  return json
}
