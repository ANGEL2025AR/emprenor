import { MongoClient } from "mongodb"

async function testConnection() {
  console.log("[v0] Iniciando prueba de conexión a MongoDB...")

  const uri = process.env.MONGODB_URI

  if (!uri) {
    console.error("[v0] ERROR: MONGODB_URI no está definida")
    process.exit(1)
  }

  console.log("[v0] URI encontrada, intentando conectar...")

  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("[v0] ✓ Conexión exitosa a MongoDB")

    const db = client.db("emprenor_db")

    // Crear colección de contactos si no existe
    const collections = await db.listCollections().toArray()
    const contactsExists = collections.some((col) => col.name === "contacts")

    if (!contactsExists) {
      await db.createCollection("contacts")
      console.log('[v0] ✓ Colección "contacts" creada')
    } else {
      console.log('[v0] ✓ Colección "contacts" ya existe')
    }

    // Crear índices para optimizar búsquedas
    await db.collection("contacts").createIndex({ createdAt: -1 })
    await db.collection("contacts").createIndex({ email: 1 })
    await db.collection("contacts").createIndex({ status: 1 })
    console.log("[v0] ✓ Índices creados correctamente")

    // Obtener estadísticas
    const count = await db.collection("contacts").countDocuments()
    console.log(`[v0] ✓ Total de contactos en DB: ${count}`)

    console.log("[v0] ✓ Conexión a MongoDB configurada correctamente!")
  } catch (error) {
    console.error("[v0] ERROR al conectar con MongoDB:", error)
    throw error
  } finally {
    await client.close()
    console.log("[v0] Conexión cerrada")
  }
}

testConnection()
  .then(() => {
    console.log("[v0] Script finalizado exitosamente")
    process.exit(0)
  })
  .catch((error) => {
    console.error("[v0] Script finalizado con errores:", error)
    process.exit(1)
  })
