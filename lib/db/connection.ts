import { MongoClient, type Document } from "mongodb"
import { getDb as getDbFromMongodb, connectToDatabase } from "@/lib/mongodb"

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env")
}

const uri = process.env.MONGODB_URI
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export { clientPromise }
export { getDbFromMongodb as getDb, connectToDatabase }

// Helper function to get a collection with type safety
export async function getCollection<T extends Document>(collectionName: string) {
  const db = await getDbFromMongodb()
  return db.collection<T>(collectionName)
}
