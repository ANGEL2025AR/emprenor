/**
 * Script para crear el primer usuario administrador
 *
 * Para ejecutar este script, necesitas:
 * 1. Tener configurada la variable de entorno MONGODB_URI
 * 2. Ejecutar: npx ts-node scripts/create-admin.ts
 *
 * O puedes usar el endpoint API con la clave secreta
 */

import { MongoClient } from "mongodb"
import crypto from "crypto"

// Configuración del administrador inicial
const ADMIN_CONFIG = {
  email: "admin@emprenor.com",
  password: "Emprenor2024!", // Cambia esta contraseña después del primer login
  name: "Administrador",
  lastName: "EMPRENOR",
  phone: "+54 9 11 2758-6521",
}

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex")
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex")
  return `${salt}:${hash}`
}

async function createAdmin() {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    console.error("Error: MONGODB_URI no está configurado")
    process.exit(1)
  }

  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("Conectado a MongoDB")

    const db = client.db()
    const usersCollection = db.collection("users")

    // Verificar si ya existe un admin
    const existingAdmin = await usersCollection.findOne({
      email: ADMIN_CONFIG.email.toLowerCase(),
    })

    if (existingAdmin) {
      console.log("El usuario administrador ya existe")
      console.log("Email:", ADMIN_CONFIG.email)
      return
    }

    // Crear el usuario administrador
    const hashedPassword = hashPassword(ADMIN_CONFIG.password)

    const adminUser = {
      email: ADMIN_CONFIG.email.toLowerCase(),
      password: hashedPassword,
      name: ADMIN_CONFIG.name,
      lastName: ADMIN_CONFIG.lastName,
      phone: ADMIN_CONFIG.phone,
      role: "super_admin",
      permissions: [
        "projects.create",
        "projects.edit",
        "projects.delete",
        "projects.view",
        "tasks.create",
        "tasks.edit",
        "tasks.delete",
        "tasks.view",
        "inspections.create",
        "inspections.edit",
        "inspections.delete",
        "inspections.view",
        "finances.view",
        "finances.create",
        "finances.approve",
        "documents.upload",
        "documents.delete",
        "documents.view",
        "users.create",
        "users.edit",
        "users.delete",
        "users.view",
        "settings.edit",
      ],
      isActive: true,
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await usersCollection.insertOne(adminUser)

    console.log("Usuario administrador creado exitosamente!")
    console.log("=====================================")
    console.log("Email:", ADMIN_CONFIG.email)
    console.log("Contraseña:", ADMIN_CONFIG.password)
    console.log("Rol: super_admin")
    console.log("=====================================")
    console.log("IMPORTANTE: Cambia la contraseña después del primer login")
  } catch (error) {
    console.error("Error al crear administrador:", error)
  } finally {
    await client.close()
  }
}

createAdmin()
