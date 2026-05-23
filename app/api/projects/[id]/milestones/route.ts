import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { z } from "zod"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { hasPermission } from "@/lib/auth/permissions"
import { findProjectForUser } from "@/lib/auth/project-access"
import { applyProjectManagerSync, newMilestoneId } from "@/lib/projects/project-manager"
import type { ProjectMilestone } from "@/lib/projects/project-manager-types"

const milestoneSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  order: z.number().int().min(0).optional(),
  estimatedDate: z.coerce.date().optional(),
  completed: z.boolean().optional(),
  progress: z.number().min(0).max(100).optional(),
  amount: z.number().nonnegative().optional(),
})

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user || !hasPermission(user.role, "projects.view")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { id } = await params
  if (!ObjectId.isValid(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 })

  const project = await findProjectForUser(user, id)
  if (!project) return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 })

  const milestones = (project.milestones ?? []).sort((a, b) => a.order - b.order)
  return NextResponse.json({ milestones, scheduleStatus: project.scheduleStatus, progress: project.progress })
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user || !hasPermission(user.role, "projects.edit")) {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
  }

  const { id } = await params
  if (!ObjectId.isValid(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 })

  const project = await findProjectForUser(user, id)
  if (!project) return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 })

  const body = await request.json()
  const parsed = milestoneSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos", details: parsed.error.flatten() }, { status: 400 })
  }

  const existing = project.milestones ?? []
  const order = parsed.data.order ?? existing.length

  const milestone: ProjectMilestone = {
    id: newMilestoneId(),
    name: parsed.data.name,
    description: parsed.data.description,
    order,
    estimatedDate: parsed.data.estimatedDate,
    completed: parsed.data.completed ?? false,
    progress: parsed.data.progress ?? 0,
    amount: parsed.data.amount,
    completedAt: parsed.data.completed ? new Date() : undefined,
  }

  const milestones = [...existing, milestone].sort((a, b) => a.order - b.order)
  const sync = applyProjectManagerSync({ ...project, milestones })

  const db = await getDb()
  await db.collection("projects").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        milestones: sync.milestones,
        progress: sync.progress,
        scheduleStatus: sync.scheduleStatus,
        updatedAt: new Date(),
      },
    },
  )

  return NextResponse.json({ milestone, ...sync })
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user || !hasPermission(user.role, "projects.edit")) {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
  }

  const { id } = await params
  if (!ObjectId.isValid(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 })

  const project = await findProjectForUser(user, id)
  if (!project) return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 })

  const body = await request.json()
  const milestones: ProjectMilestone[] = Array.isArray(body.milestones) ? body.milestones : []
  const sync = applyProjectManagerSync({ ...project, milestones })

  const db = await getDb()
  await db.collection("projects").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        milestones: sync.milestones,
        progress: sync.progress,
        scheduleStatus: sync.scheduleStatus,
        updatedAt: new Date(),
      },
    },
  )

  return NextResponse.json(sync)
}
