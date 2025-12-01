// Manejo de sesiones con cookies
import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"
import { getDb } from "@/lib/db/connection"
import { ObjectId } from "mongodb"
import type { UserRole } from "@/lib/db/models"

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "emprenor-secret-key-change-in-production-2024")

const COOKIE_NAME = "emprenor_session"

export interface SessionPayload {
  userId: string
  email: string
  role: string
  name: string
  exp?: number
  [key: string]: unknown
}

export interface SerializableUser {
  _id: string
  email: string
  name: string
  lastName: string
  phone?: string
  avatar?: string
  role: UserRole
  permissions: string[]
  isActive: boolean
  emailVerified: boolean
  lastLogin?: string
  createdAt: string
  updatedAt: string
}

export async function createSession(user: {
  _id: ObjectId | string
  email: string
  role: UserRole
  name: string
  lastName: string
}): Promise<string> {
  const payload: SessionPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
    name: `${user.name} ${user.lastName}`,
  }

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET_KEY)

  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 días
    path: "/",
  })

  return token
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value

  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY)
    return payload as SessionPayload
  } catch {
    return null
  }
}

export async function getCurrentUser(): Promise<SerializableUser | null> {
  const session = await getSession()
  if (!session) return null

  try {
    const db = await getDb()
    const user = await db.collection("users").findOne({
      _id: new ObjectId(session.userId),
      isActive: true,
    })

    if (!user) return null

    // Convertir a objeto serializable (sin ObjectId)
    return {
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role || "cliente", // Default si no tiene rol
      permissions: user.permissions || [],
      isActive: user.isActive ?? true,
      emailVerified: user.emailVerified ?? false,
      lastLogin: user.lastLogin?.toISOString(),
      createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: user.updatedAt?.toISOString() || new Date().toISOString(),
    }
  } catch {
    return null
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function updateLastLogin(userId: string): Promise<void> {
  const db = await getDb()
  await db.collection("users").updateOne({ _id: new ObjectId(userId) }, { $set: { lastLogin: new Date() } })
}
