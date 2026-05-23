import { ObjectId } from "mongodb"
import { getDb } from "@/lib/db/connection"
import {
  buildProjectClientFields,
  projectSyncFromClient,
  type ClientRecord,
} from "@/lib/clients/compliance-sync"
import type { Project, ProjectInstitutionalCompliance } from "@/lib/db/models"

export async function loadClientRecord(clientId: string): Promise<ClientRecord | null> {
  if (!ObjectId.isValid(clientId)) return null
  const db = await getDb()
  return db.collection<ClientRecord>("clients").findOne({ _id: new ObjectId(clientId) })
}

export async function applyClientToProjectUpdate(
  projectId: string,
  clientId: string,
  existingCompliance?: ProjectInstitutionalCompliance,
) {
  const client = await loadClientRecord(clientId)
  if (!client) return null

  const sync = projectSyncFromClient(client, existingCompliance)
  const db = await getDb()

  await db.collection<Project>("projects").updateOne(
    { _id: new ObjectId(projectId) },
    {
      $set: {
        clientId: new ObjectId(clientId),
        client: sync.client,
        institutionalCompliance: sync.institutionalCompliance,
        updatedAt: new Date(),
      },
    },
  )

  return sync
}

export async function propagateClientToLinkedProjects(clientId: string, client: ClientRecord) {
  const db = await getDb()
  const oid = new ObjectId(clientId)
  const projects = await db
    .collection<Project>("projects")
    .find({ clientId: oid })
    .project({ institutionalCompliance: 1 })
    .toArray()

  if (projects.length === 0) return 0

  const clientFields = buildProjectClientFields(client)

  await Promise.all(
    projects.map((p) => {
      const sync = projectSyncFromClient(client, p.institutionalCompliance)
      return db.collection("projects").updateOne(
        { _id: p._id },
        {
          $set: {
            client: clientFields,
            institutionalCompliance: sync.institutionalCompliance,
            updatedAt: new Date(),
          },
        },
      )
    }),
  )

  return projects.length
}
