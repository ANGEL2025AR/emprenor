import type { Document } from "mongodb"
import { getDb, connectToDatabase, clientPromise } from "@/lib/mongodb"

export { getDb, connectToDatabase, clientPromise }

// Helper function to get a collection with type safety
export async function getCollection<T extends Document>(collectionName: string) {
  const db = await getDb()
  return db.collection<T>(collectionName)
}
