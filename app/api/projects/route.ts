import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { hasPermission } from "@/lib/auth/permissions"
import { projectSchema } from "@/lib/validations/schemas"
import { generateCode } from "@/lib/auth/password"
import type { Project } from "@/lib/db/models"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || !user._id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    if (!hasPermission(user.role, "projects.view")) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const search = searchParams.get("search")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const db = await getDb()

    const filter: Record<string, unknown> = {}

    if (user.role === "cliente") {
      filter["client.email"] = user.email
    }

    const userObjectId = new ObjectId(user._id)

    const restrictedRoles: string[] = ["trabajador", "supervisor"]
    if (restrictedRoles.includes(user.role)) {
      filter.$or = [
        { "team.managerId": userObjectId },
        { "team.supervisorId": userObjectId },
        { "team.workers": userObjectId },
      ]
    }

    if (status) filter.status = status
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { code: { $regex: search, $options: "i" } },
        { "client.name": { $regex: search, $options: "i" } },
      ]
    }

    const [projects, total] = await Promise.all([
      db.collection<Project>("projects").find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
      db.collection("projects").countDocuments(filter),
    ])

    return NextResponse.json({
      projects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch {
    return NextResponse.json({ error: "Error al obtener proyectos" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || !user._id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    if (!hasPermission(user.role, "projects.create")) {
      return NextResponse.json({ error: "Sin permisos para crear proyectos" }, { status: 403 })
    }

    const body = await request.json()
    const result = projectSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: "Datos inválidos", details: result.error.flatten() }, { status: 400 })
    }

    const db = await getDb()
    const code = generateCode("PRY")

    const userObjectId = new ObjectId(user._id)

    const newProject: Omit<Project, "_id"> = {
      ...result.data,
      code,
      status: "borrador",
      progress: 0,
      budget: {
        ...result.data.budget,
        approved: 0,
        spent: 0,
      },
      team: {
        managerId: userObjectId,
        workers: [],
      },
      tags: result.data.tags || [],
      createdBy: userObjectId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const insertResult = await db.collection("projects").insertOne(newProject)

    return NextResponse.json(
      {
        success: true,
        project: { ...newProject, _id: insertResult.insertedId },
      },
      { status: 201 },
    )
  } catch {
    return NextResponse.json({ error: "Error al crear proyecto" }, { status: 500 })
  }
}
