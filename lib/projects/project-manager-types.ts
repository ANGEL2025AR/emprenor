/** Tipos del Project Manager (Plan Maestro v4 — sección 4.3). */

export const PROJECT_BRANCHES = ["salta", "tartagal", "vespucio", "central"] as const
export type ProjectBranch = (typeof PROJECT_BRANCHES)[number]

export const SCHEDULE_STATUSES = ["en_tiempo", "demorado", "adelantado", "critico"] as const
export type ScheduleStatus = (typeof SCHEDULE_STATUSES)[number]

export const INSTALLMENT_STATUSES = ["pendiente", "pagada", "vencida"] as const
export type InstallmentStatus = (typeof INSTALLMENT_STATUSES)[number]

export interface ProjectMilestone {
  id: string
  name: string
  description?: string
  order: number
  estimatedDate?: Date
  completedAt?: Date
  completed: boolean
  progress: number
  amount?: number
}

export interface ProjectInstallment {
  id: string
  number: number
  description?: string
  percentage?: number
  amount: number
  dueDate?: Date
  status: InstallmentStatus
  paidAt?: Date
  receiptUrl?: string
}

export interface ProjectManagerFields {
  branch?: ProjectBranch
  scheduleStatus?: ScheduleStatus
  milestones?: ProjectMilestone[]
  installments?: ProjectInstallment[]
  budgetCurrent?: number
  totalCollected?: number
  totalPending?: number
}
