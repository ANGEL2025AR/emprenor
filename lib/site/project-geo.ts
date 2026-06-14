export const NOA_MAP_DEFAULT = {
  center: { lat: -24.35, lng: -64.55 },
  zoom: 7,
}

export type MapCoordinates = { lat: number; lng: number }

export function normalizeCoordinates(raw: unknown): MapCoordinates | null {
  if (!raw || typeof raw !== "object") return null
  const obj = raw as { lat?: unknown; lng?: unknown }
  if (obj.lat != null && obj.lng != null) {
    const lat = Number(obj.lat)
    const lng = Number(obj.lng)
    if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng }
  }
  return null
}

export type MapProject = {
  id: string
  title: string
  location?: string
  status?: string
  progress?: number
  coordinates: MapCoordinates | null
}

export function toMapProject(doc: {
  _id: { toString(): string } | string
  title: string
  location?: string
  status?: string
  progress?: number
  coordinates?: unknown
  showOnMap?: boolean
  published?: boolean
}): MapProject | null {
  if (doc.published === false || doc.showOnMap === false) return null
  const coordinates = normalizeCoordinates(doc.coordinates)
  if (!coordinates) return null
  return {
    id: typeof doc._id === "string" ? doc._id : doc._id.toString(),
    title: doc.title,
    location: doc.location,
    status: doc.status,
    progress: doc.progress,
    coordinates,
  }
}
