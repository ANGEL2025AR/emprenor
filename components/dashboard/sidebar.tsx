"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import type { SerializableUser } from "@/lib/auth/session"
import type { UserRole } from "@/lib/db/models"
import Image from "next/image"
import { isPortalEmployeeRole } from "@/lib/auth/portal-roles"
import type { PortalSettings } from "@/lib/portal/portal-settings-shared"
import { isNavPathActive } from "@/lib/dashboard/navigation"
import {
  getDashboardHome,
  filterNavGroups,
  isHomeVisible,
} from "@/lib/dashboard/filter-navigation"
import type { DashboardNavGroup, DashboardNavItem } from "@/lib/dashboard/navigation"
import { X, ChevronLeft, Menu, ChevronDown } from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { LOGO_DARK_BG, LOGO_ICON_LIGHT } from "@/lib/brand/logo"

interface DashboardSidebarProps {
  user: SerializableUser
  /** Configuración del portal cargada en el servidor (evita parpadeo y desajustes). */
  initialPortalSettings?: PortalSettings | null
}

function getOpenGroupsForPath(
  pathname: string,
  groups: DashboardNavGroup[],
): Set<string> {
  const open = new Set<string>()
  for (const group of groups) {
    if (group.items.some((item) => isNavPathActive(pathname, item.href))) {
      open.add(group.id)
    }
  }
  return open
}

function NavLink({
  item,
  isActive,
  isCollapsed,
  nested = false,
}: {
  item: DashboardNavItem
  isActive: boolean
  isCollapsed: boolean
  nested?: boolean
}) {
  const Icon = item.icon

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 group relative",
        nested && !isCollapsed && "pl-9",
        isActive ? "dashboard-nav-active text-white" : "dashboard-nav-item",
        isCollapsed && "lg:justify-center lg:px-2",
      )}
      title={isCollapsed ? item.name : undefined}
    >
      <Icon className={cn("flex-shrink-0", nested && !isCollapsed ? "w-4 h-4" : "w-5 h-5")} />
      <span className={cn(isCollapsed && "lg:hidden")}>{item.name}</span>

      {isCollapsed && (
        <div className="absolute left-full ml-2 px-3 py-1.5 bg-slate-800/95 border border-white/10 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 hidden lg:block shadow-xl">
          {item.name}
        </div>
      )}
    </Link>
  )
}

function NavGroupSection({
  group,
  isCollapsed,
  isOpen,
  onToggle,
  pathname,
}: {
  group: DashboardNavGroup
  isCollapsed: boolean
  isOpen: boolean
  onToggle: () => void
  pathname: string
}) {
  const GroupIcon = group.icon
  const hasActiveItem = group.items.some((item) => isNavPathActive(pathname, item.href))

  if (isCollapsed) {
    return (
      <li className="space-y-0.5">
        <div
          className="hidden lg:block h-px bg-white/5 mx-2 my-2 first:hidden"
          aria-hidden
        />
        {group.items.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            isActive={isNavPathActive(pathname, item.href)}
            isCollapsed={isCollapsed}
          />
        ))}
      </li>
    )
  }

  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
          hasActiveItem
            ? "text-emerald-300/90 bg-white/[0.04]"
            : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]",
        )}
        aria-expanded={isOpen}
      >
        <GroupIcon className="w-5 h-5 flex-shrink-0 opacity-80" />
        <span className="flex-1 text-left">{group.label}</span>
        <ChevronDown
          className={cn("w-4 h-4 flex-shrink-0 transition-transform duration-200", isOpen && "rotate-180")}
        />
      </button>

      {isOpen && (
        <ul className="mt-0.5 space-y-0.5">
          {group.items.map((item) => (
            <li key={item.href}>
              <NavLink
                item={item}
                isActive={isNavPathActive(pathname, item.href)}
                isCollapsed={isCollapsed}
                nested
              />
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

export function DashboardSidebar({ user, initialPortalSettings = null }: DashboardSidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const [portalSettings, setPortalSettings] = useState<PortalSettings | null>(initialPortalSettings)

  const userRole: UserRole = user?.role || "cliente"

  const navGroups = useMemo(
    () => filterNavGroups(userRole, portalSettings),
    [userRole, portalSettings],
  )

  const [openGroups, setOpenGroups] = useState<Set<string>>(() =>
    getOpenGroupsForPath(pathname, filterNavGroups(userRole, initialPortalSettings)),
  )

  const showHome = useMemo(() => isHomeVisible(userRole), [userRole])
  const homeItem = useMemo(() => getDashboardHome(userRole), [userRole])
  const homeHref = homeItem?.href ?? "/dashboard"

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  useEffect(() => {
    setPortalSettings(initialPortalSettings)
  }, [initialPortalSettings])

  useEffect(() => {
    if (!isPortalEmployeeRole(user?.role || "")) return
    if (initialPortalSettings) return
    fetch("/api/portal/settings")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.settings) setPortalSettings(data.settings)
      })
      .catch(() => {})
  }, [user?.role, initialPortalSettings])

  useEffect(() => {
    setOpenGroups((prev) => {
      const active = getOpenGroupsForPath(pathname, navGroups)
      return new Set([...prev, ...active])
    })
  }, [pathname, navGroups])

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev)
      if (next.has(groupId)) next.delete(groupId)
      else next.add(groupId)
      return next
    })
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setIsOpen(false)} />
      )}

      <button
        className="fixed top-4 left-4 z-50 lg:hidden p-2.5 rounded-xl border border-emerald-500/30 bg-slate-950 text-white shadow-lg shadow-emerald-500/20 hover:border-emerald-400/50 transition-all"
        onClick={() => setIsOpen(true)}
        aria-label="Abrir menú"
      >
        <Menu className="w-6 h-6" />
      </button>

      <aside
        className={cn(
          "dashboard-sidebar relative fixed lg:sticky top-0 inset-y-0 left-0 z-50 h-screen flex flex-col transform transition-all duration-300 ease-in-out overflow-hidden",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0",
          isCollapsed ? "lg:w-20" : "lg:w-72",
          "w-72",
        )}
      >
        <div className="dashboard-sidebar-glow" aria-hidden />
        <div className="relative flex h-16 items-center justify-between px-4 border-b border-white/5 flex-shrink-0 z-10">
          <Link
            href={homeHref}
            className={cn("flex items-center gap-3 transition-all", isCollapsed && "lg:justify-center")}
          >
            <div
              className={cn(
                "relative flex-shrink-0 drop-shadow-[0_0_16px_rgba(99,102,241,0.35)]",
                isCollapsed ? "h-10 w-10 lg:h-10 lg:w-10" : "h-10 w-36 sm:w-40",
              )}
            >
              <Image
                src={isCollapsed ? LOGO_ICON_LIGHT.src : LOGO_DARK_BG.src}
                alt="EMPRENOR"
                fill
                unoptimized
                sizes={isCollapsed ? "40px" : "160px"}
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-slate-400 hover:text-white hover:bg-slate-800"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "hidden lg:flex text-slate-400 hover:text-white hover:bg-slate-800",
              isCollapsed && "absolute -right-3 top-5 w-6 h-6 bg-slate-800 rounded-full border border-slate-700",
            )}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <ChevronLeft className={cn("w-4 h-4 transition-transform", isCollapsed && "rotate-180")} />
          </Button>
        </div>

        <nav className="relative z-10 flex-1 overflow-y-auto py-4 px-3 scrollbar-thin">
          <ul className="space-y-1">
            {showHome && homeItem ? (
              <li className="mb-2">
                <NavLink
                  item={homeItem}
                  isActive={isNavPathActive(pathname, homeItem.href)}
                  isCollapsed={isCollapsed}
                />
              </li>
            ) : null}

            {navGroups.map((group) => (
              <NavGroupSection
                key={group.id}
                group={group}
                isCollapsed={isCollapsed}
                isOpen={openGroups.has(group.id)}
                onToggle={() => toggleGroup(group.id)}
                pathname={pathname}
              />
            ))}
          </ul>
        </nav>
      </aside>
    </>
  )
}
