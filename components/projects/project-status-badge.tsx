import { STATUS_CONFIG, normalizeProjectStatus, type ProjectStatusKey } from "@/lib/site/project-status"
import { cn } from "@/lib/utils"

export function ProjectStatusBadge({ status, className }: { status?: string; className?: string }) {
  const key = normalizeProjectStatus(status) as ProjectStatusKey
  const cfg = STATUS_CONFIG[key]
  const Icon = cfg.icon
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border", cfg.light, className)}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  )
}
