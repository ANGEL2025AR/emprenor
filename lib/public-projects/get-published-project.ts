import { ObjectId } from "mongodb"
import { getDb } from "@/lib/db/connection"
import type { PublicProject } from "@/lib/db/models"

export type SerializedPublicProject = Omit<PublicProject, "_id" | "publishDate" | "createdAt" | "updatedAt"> & {
  _id: string
  publishDate?: string
  createdAt?: string
  updatedAt?: string
}

export function serializePublicProject(project: PublicProject): SerializedPublicProject {
  return {
    ...project,
    _id: project._id?.toString() ?? "",
    publishDate: project.publishDate ? new Date(project.publishDate).toISOString() : undefined,
    createdAt: project.createdAt ? new Date(project.createdAt).toISOString() : undefined,
    updatedAt: project.updatedAt ? new Date(project.updatedAt).toISOString() : undefined,
  }
}

export async function getPublishedProjectById(id: string): Promise<SerializedPublicProject | null> {
  if (!process.env.MONGODB_URI?.trim() || !ObjectId.isValid(id)) {
    return null
  }

  const db = await getDb()
  const project = await db.collection<PublicProject>("public_projects").findOne({
    _id: new ObjectId(id),
    published: true,
  })

  if (!project) return null
  return serializePublicProject(project)
}
