import { MongoClient, type Db } from "mongodb"

const uri = process.env.MONGODB_URI || ""
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
}

let client: MongoClient

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
  }

  client = new MongoClient(uri, options)
  return client.connect()
}

let clientPromiseSingleton: Promise<MongoClient> | undefined

function ensureClientPromise(): Promise<MongoClient> {
  if (clientPromiseSingleton === undefined) {
    clientPromiseSingleton = getClientPromise()
  }
  return clientPromiseSingleton
}

export const connectToDatabase = async () => {
  const client = await ensureClientPromise()
  return client.db("emprenor")
}

export async function getDb(): Promise<Db> {
  const client = await ensureClientPromise()
  return client.db("emprenor")
}

/** Promesa lazy: no rechaza al importar el módulo si falta MONGODB_URI. */
export const clientPromise: Promise<MongoClient> = {
  then(onfulfilled, onrejected) {
    return ensureClientPromise().then(onfulfilled, onrejected)
  },
  catch(onrejected) {
    return ensureClientPromise().catch(onrejected)
  },
  finally(onfinally) {
    return ensureClientPromise().finally(onfinally)
  },
} as Promise<MongoClient>

export default clientPromise
