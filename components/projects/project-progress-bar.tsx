import { STATUS_CONFIG, normalizeProjectStatus } from "@/lib/site/project-status"
import { cn } from "@/lib/utils"

export function ProjectProgressBar({
  progress,
  status,
  compact = false,
  className,
}: {
  progress?: number
  status?: string
  compact?: boolean
  className?: string
}) {
  const key = normalizeProjectStatus(status)
  const cfg = STATUS_CONFIG[key]
  const pct = Math.min(100, Math.max(0, progress ?? (key === "Finalizado" ? 100 : key === "Planificacion" ? 15 : 55)))

  return (
    <div className={cn("space-y-1", className)}>
      {!compact && <p className="text-xs text-muted-foreground">Avance de obra</p>}
      <div className={cn("w-full rounded-full bg-muted overflow-hidden", compact ? "h-1.5" : "h-2")}>
        <div className={cn("h-full rounded-full transition-all", cfg.color)} style={{ width: `${pct}%` }} />
      </div>
      <p className="text-[10px] text-muted-foreground">{pct}% completado</p>
    </div>
  )
}
