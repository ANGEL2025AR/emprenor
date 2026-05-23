import type { Project } from "@/lib/db/models"
import type {
  ProjectInstallment,
  ProjectMilestone,
  ScheduleStatus,
} from "@/lib/projects/project-manager-types"

export function newMilestoneId(): string {
  return `m_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

export function newInstallmentId(): string {
  return `c_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

/** Avance % desde hitos (promedio: completado=100, sino progress del hito). */
export function computeProgressFromMilestones(milestones: ProjectMilestone[]): number {
  if (!milestones.length) return 0
  const sum = milestones.reduce((acc, h) => acc + (h.completed ? 100 : Math.min(100, Math.max(0, h.progress))), 0)
  return Math.round(sum / milestones.length)
}

export function computeScheduleStatus(
  project: Pick<Project, "dates" | "status"> & { scheduleStatus?: ScheduleStatus },
  milestones: ProjectMilestone[],
): ScheduleStatus {
  if (project.status === "pausado") return project.scheduleStatus ?? "en_tiempo"

  const end = project.dates?.estimatedEnd ? new Date(project.dates.estimatedEnd) : null
  const start = project.dates?.start ? new Date(project.dates.start) : null
  const now = new Date()

  if (end && now > end) {
    const overdueIncomplete = milestones.some((m) => !m.completed && m.estimatedDate && new Date(m.estimatedDate) < now)
    return overdueIncomplete ? "critico" : "demorado"
  }

  if (start && end) {
    const totalMs = end.getTime() - start.getTime()
    const elapsedMs = now.getTime() - start.getTime()
    if (totalMs > 0) {
      const expectedProgress = Math.min(100, Math.max(0, (elapsedMs / totalMs) * 100))
      const actual = computeProgressFromMilestones(milestones)
      if (actual >= expectedProgress + 10) return "adelantado"
      if (actual < expectedProgress - 15) return "demorado"
    }
  }

  return "en_tiempo"
}

export function refreshInstallmentStatuses(installments: ProjectInstallment[]): ProjectInstallment[] {
  const now = new Date()
  return installments.map((c) => {
    if (c.status === "pagada") return c
    if (c.dueDate && new Date(c.dueDate) < now) return { ...c, status: "vencida" as const }
    return { ...c, status: "pendiente" as const }
  })
}

export function computeFinancialTotals(
  project: Pick<Project, "budget">,
  installments: ProjectInstallment[],
  budgetCurrent?: number,
): { budgetCurrent: number; totalCollected: number; totalPending: number } {
  const base = budgetCurrent ?? (project.budget?.approved || project.budget?.estimated || 0)
  const refreshed = refreshInstallmentStatuses(installments)
  const totalCollected = refreshed.filter((c) => c.status === "pagada").reduce((s, c) => s + c.amount, 0)
  const totalPending = Math.max(0, base - totalCollected)
  return { budgetCurrent: base, totalCollected, totalPending }
}

export function applyProjectManagerSync(
  project: Project & {
    milestones?: ProjectMilestone[]
    installments?: ProjectInstallment[]
    budgetCurrent?: number
    scheduleStatus?: ScheduleStatus
  },
): {
  progress: number
  scheduleStatus: ScheduleStatus
  milestones: ProjectMilestone[]
  installments: ProjectInstallment[]
  budgetCurrent: number
  totalCollected: number
  totalPending: number
} {
  const milestones = project.milestones ?? []
  const installments = refreshInstallmentStatuses(project.installments ?? [])
  const progress = milestones.length > 0 ? computeProgressFromMilestones(milestones) : project.progress ?? 0
  const scheduleStatus = computeScheduleStatus({ ...project, scheduleStatus: project.scheduleStatus }, milestones)
  const financial = computeFinancialTotals(project, installments, project.budgetCurrent)

  return {
    progress,
    scheduleStatus,
    milestones,
    installments,
    ...financial,
  }
}

export const SCHEDULE_STATUS_LABELS: Record<ScheduleStatus, string> = {
  en_tiempo: "En tiempo",
  demorado: "Demorado",
  adelantado: "Adelantado",
  critico: "Crítico",
}

export const SCHEDULE_STATUS_COLORS: Record<ScheduleStatus, string> = {
  en_tiempo: "bg-green-100 text-green-800 border-green-200",
  adelantado: "bg-emerald-100 text-emerald-800 border-emerald-200",
  demorado: "bg-amber-100 text-amber-800 border-amber-200",
  critico: "bg-red-100 text-red-800 border-red-200",
}

export const BRANCH_LABELS: Record<string, string> = {
  salta: "Salta Capital",
  tartagal: "Tartagal",
  vespucio: "Campamento Vespucio",
  central: "Central",
}
