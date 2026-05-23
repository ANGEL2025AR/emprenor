import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { z } from "zod"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { hasPermission } from "@/lib/auth/permissions"
import { findProjectForUser } from "@/lib/auth/project-access"
import { applyProjectManagerSync } from "@/lib/projects/project-manager"

const patchSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  order: z.number().int().min(0).optional(),
  estimatedDate: z.coerce.date().optional().nullable(),
  completed: z.boolean().optional(),
  progress: z.number().min(0).max(100).optional(),
  amount: z.number().nonnegative().optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; milestoneId: string }> },
) {
  const user = await getCurrentUser()
  if (!user || !hasPermission(user.role, "projects.edit")) {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
  }

  const { id, milestoneId } = await params
  if (!ObjectId.isValid(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 })

  const project = await findProjectForUser(user, id)
  if (!project) return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 })

  const parsed = patchSchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
  }

  const milestones = (project.milestones ?? []).map((m) => {
    if (m.id !== milestoneId) return m
    const { estimatedDate, completed, ...rest } = parsed.data
    const next: typeof m = { ...m, ...rest }
    if (estimatedDate !== undefined) {
      if (estimatedDate === null) delete next.estimatedDate
      else next.estimatedDate = estimatedDate
    }
    if (completed === true) {
      next.completed = true
      next.progress = 100
      next.completedAt = new Date()
    } else if (completed === false) {
      next.completed = false
      next.completedAt = undefined
    }
    return next
  })

  if (!milestones.some((m) => m.id === milestoneId)) {
    return NextResponse.json({ error: "Hito no encontrado" }, { status: 404 })
  }

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

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; milestoneId: string }> },
) {
  const user = await getCurrentUser()
  if (!user || !hasPermission(user.role, "projects.edit")) {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
  }

  const { id, milestoneId } = await params
  if (!ObjectId.isValid(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 })

  const project = await findProjectForUser(user, id)
  if (!project) return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 })

  const milestones = (project.milestones ?? []).filter((m) => m.id !== milestoneId)
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
