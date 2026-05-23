import { ObjectId } from "mongodb"

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/** Proyectos vinculados a un cliente (clientId canónico + email legacy). */
export function projectsFilterForClient(clientId: ObjectId, email: string): Record<string, unknown> {
  return {
    $or: [
      { clientId },
      { "client.email": { $regex: new RegExp(`^${escapeRegex(email.trim())}$`, "i") } },
    ],
  }
}
