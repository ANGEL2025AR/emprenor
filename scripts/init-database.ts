// Script de inicialización de la base de datos
// Ejecutar con: npx ts-node scripts/init-database.ts

import { MongoClient } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI || ""

async function initDatabase() {
  console.log("Conectando a MongoDB...")

  const client = new MongoClient(MONGODB_URI)
  await client.connect()

  const db = client.db("emprenor")

  console.log("Creando índices...")

  // Índices para users
  await db.collection("users").createIndex({ email: 1 }, { unique: true })
  await db.collection("users").createIndex({ role: 1 })
  await db.collection("users").createIndex({ isActive: 1 })

  // Índices para projects
  await db.collection("projects").createIndex({ code: 1 }, { unique: true })
  await db.collection("projects").createIndex({ status: 1 })
  await db.collection("projects").createIndex({ "team.managerId": 1 })
  await db.collection("projects").createIndex({ createdAt: -1 })

  // Índices para tasks
  await db.collection("tasks").createIndex({ projectId: 1 })
  await db.collection("tasks").createIndex({ code: 1 }, { unique: true })
  await db.collection("tasks").createIndex({ status: 1 })
  await db.collection("tasks").createIndex({ assignedTo: 1 })

  // Índices para inspections
  await db.collection("inspections").createIndex({ projectId: 1 })
  await db.collection("inspections").createIndex({ code: 1 }, { unique: true })
  await db.collection("inspections").createIndex({ result: 1 })

  // Índices para transactions
  await db.collection("transactions").createIndex({ projectId: 1 })
  await db.collection("transactions").createIndex({ type: 1 })
  await db.collection("transactions").createIndex({ status: 1 })
  await db.collection("transactions").createIndex({ date: -1 })

  // Índices para documents
  await db.collection("documents").createIndex({ projectId: 1 })
  await db.collection("documents").createIndex({ type: 1 })
  await db.collection("documents").createIndex({ createdAt: -1 })

  // Índices para notifications
  await db.collection("notifications").createIndex({ userId: 1 })
  await db.collection("notifications").createIndex({ read: 1 })
  await db.collection("notifications").createIndex({ createdAt: -1 })

  // Índices para messages y conversations
  await db.collection("messages").createIndex({ conversationId: 1 })
  await db.collection("messages").createIndex({ createdAt: -1 })
  await db.collection("conversations").createIndex({ participants: 1 })

  console.log("Índices creados exitosamente!")

  // Crear usuario admin por defecto si no existe
  const adminExists = await db.collection("users").findOne({ email: "admin@emprenor.com" })

  if (!adminExists) {
    console.log("Creando usuario administrador...")

    // Usando crypto para hash simple (en producción usar bcrypt)
    const crypto = await import("crypto")
    const salt = crypto.randomBytes(16).toString("hex")
    const hash = crypto.scryptSync("Admin123!", salt, 64).toString("hex")

    await db.collection("users").insertOne({
      email: "admin@emprenor.com",
      password: `${salt}:${hash}`,
      name: "Administrador",
      lastName: "Sistema",
      role: "super_admin",
      permissions: [],
      isActive: true,
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    console.log("Usuario admin creado: admin@emprenor.com / Admin123!")
  }

  await client.close()
  console.log("Base de datos inicializada correctamente!")
}

initDatabase().catch(console.error)
