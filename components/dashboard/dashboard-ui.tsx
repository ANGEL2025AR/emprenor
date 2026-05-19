import type { LucideIcon } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingDown, TrendingUp } from "lucide-react"
import type { ComponentProps, ReactNode } from "react"

/** Panel con estilo glass; en dashboard las Card normales ya heredan el mismo look vía CSS. */
export function DashboardPanel({ className, children, ...props }: ComponentProps<typeof Card>) {
  return (
    <Card className={cn("dashboard-panel", className)} {...props}>
      {children}
    </Card>
  )
}

export function DashboardPageHeader({
  title,
  description,
  badge,
  actions,
}: {
  title: string
  description?: string
  badge?: string
  actions?: ReactNode
}) {
  return (
    <div className="dashboard-page-header flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="space-y-3 min-w-0">
        {badge && (
          <span className="dashboard-badge inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
            {badge}
          </span>
        )}
        <h1 className="dashboard-title text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        {description && <p className="dashboard-subtitle max-w-2xl text-base">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-3 shrink-0">{actions}</div>}
    </div>
  )
}

const iconAccentClasses: Record<string, string> = {
  emerald: "border-emerald-400/40 bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/30",
  blue: "border-blue-400/40 bg-gradient-to-br from-blue-500 to-cyan-600 shadow-blue-500/30",
  amber: "border-amber-400/40 bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-500/30",
  violet: "border-violet-400/40 bg-gradient-to-br from-violet-500 to-purple-600 shadow-violet-500/30",
  rose: "border-rose-400/40 bg-gradient-to-br from-rose-500 to-pink-600 shadow-rose-500/30",
  cyan: "border-cyan-400/40 bg-gradient-to-br from-cyan-500 to-sky-600 shadow-cyan-500/30",
}

const glowAccentClasses: Record<string, string> = {
  emerald: "from-emerald-400/30 to-teal-500/10",
  blue: "from-blue-400/30 to-cyan-500/10",
  amber: "from-amber-400/30 to-orange-500/10",
  violet: "from-violet-400/30 to-purple-500/10",
  rose: "from-rose-400/30 to-pink-500/10",
  cyan: "from-cyan-400/30 to-sky-500/10",
}

export function DashboardStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  href,
  trend,
  accent = "emerald",
}: {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  href?: string
  trend?: "up" | "down" | "stable"
  accent?: keyof typeof iconAccentClasses
}) {
  const content = (
    <DashboardPanel
      className={cn(
        "dashboard-stat-card group relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5",
        href && "cursor-pointer",
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br opacity-60 blur-2xl transition-opacity group-hover:opacity-100",
          glowAccentClasses[accent],
        )}
      />
      <CardContent className="relative p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-slate-500">{title}</p>
              {trend === "up" && <TrendingUp className="h-4 w-4 text-emerald-500" />}
              {trend === "down" && <TrendingDown className="h-4 w-4 text-rose-500" />}
            </div>
            <p className="text-3xl font-bold tracking-tight text-slate-900 tabular-nums">{value}</p>
            {subtitle && <p className="text-sm text-slate-500 line-clamp-2">{subtitle}</p>}
          </div>
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border shadow-lg",
              iconAccentClasses[accent],
            )}
          >
            <Icon className="h-6 w-6 text-white drop-shadow-sm" />
          </div>
        </div>
      </CardContent>
    </DashboardPanel>
  )

  if (href) {
    return (
      <Link
        href={href}
        className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
      >
        {content}
      </Link>
    )
  }

  return content
}

export function DashboardPrimaryButton({ children, className, ...props }: ComponentProps<typeof Button>) {
  return (
    <Button className={cn("dashboard-btn-primary shadow-lg shadow-emerald-500/25 border-0", className)} {...props}>
      {children}
    </Button>
  )
}

export function DashboardOutlineButton({ children, className, ...props }: ComponentProps<typeof Button>) {
  return (
    <Button variant="outline" className={cn("dashboard-btn-outline bg-white/70 backdrop-blur-sm", className)} {...props}>
      {children}
    </Button>
  )
}

export function DashboardSectionTitle({
  title,
  icon: Icon,
  className,
}: {
  title: string
  icon?: LucideIcon
  className?: string
}) {
  return (
    <CardTitle className={cn("flex items-center gap-2 text-lg font-semibold text-slate-800", className)}>
      {Icon && (
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-white shadow-md">
          <Icon className="h-4 w-4" />
        </span>
      )}
      {title}
    </CardTitle>
  )
}
