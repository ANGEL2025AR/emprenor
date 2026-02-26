import { MongoClient, type Db } from "mongodb"

const uri = process.env.MONGODB_URI || ""
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

function getClientPromise(): Promise<MongoClient> {
  if (!uri) {
    return Promise.reject(new Error("MONGODB_URI no esta definida en las variables de entorno"))
  }

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options)
      global._mongoClientPromise = client.connect()
    }
    return global._mongoClientPromise
  } else {
    client = new MongoClient(uri, options)
    return client.connect()
  }
}

clientPromise = getClientPromise()

export const connectToDatabase = async () => {
  const client = await clientPromise
  return client.db("emprenor")
}

export async function getDb(): Promise<Db> {
  const client = await clientPromise
  return client.db("emprenor")
}

export { clientPromise }

export default clientPromise
