import { CheckCircle2, Clock, PauseCircle, Shield, TrendingUp, type LucideIcon } from "lucide-react"

export type ProjectStatusKey = "Planificacion" | "En Ejecucion" | "Pausado" | "Finalizado" | "Garantia"

export const STATUS_MARKER_COLORS: Record<ProjectStatusKey, string> = {
  Planificacion: "#3b82f6",
  "En Ejecucion": "#f59e0b",
  Pausado: "#94a3b8",
  Finalizado: "#10b981",
  Garantia: "#a855f7",
}

export const STATUS_CONFIG: Record<
  ProjectStatusKey,
  { color: string; light: string; icon: LucideIcon; label: string }
> = {
  Planificacion: { color: "bg-blue-500", light: "bg-blue-50 text-blue-700 border-blue-200", icon: Clock, label: "Planificación" },
  "En Ejecucion": { color: "bg-amber-500", light: "bg-amber-50 text-amber-700 border-amber-200", icon: TrendingUp, label: "En Ejecución" },
  Pausado: { color: "bg-slate-400", light: "bg-slate-50 text-slate-600 border-slate-200", icon: PauseCircle, label: "Pausado" },
  Finalizado: { color: "bg-emerald-500", light: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2, label: "Finalizado" },
  Garantia: { color: "bg-purple-500", light: "bg-purple-50 text-purple-700 border-purple-200", icon: Shield, label: "En Garantía" },
}

export function normalizeProjectStatus(status?: string): ProjectStatusKey {
  const map: Record<string, ProjectStatusKey> = {
    borrador: "Planificacion",
    planificacion: "Planificacion",
    en_ejecucion: "En Ejecucion",
    "en ejecución": "En Ejecucion",
    pausado: "Pausado",
    finalizado: "Finalizado",
    garantia: "Garantia",
  }
  if (!status) return "Finalizado"
  const key = map[status.toLowerCase()] || (status as ProjectStatusKey)
  return STATUS_CONFIG[key] ? key : "Finalizado"
}
