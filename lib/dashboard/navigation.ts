import type { LucideIcon } from "lucide-react"
import { LayoutDashboard, FolderKanban, FileText, HardHat } from "lucide-react"

export type DashboardNavItem = {
  name: string
  href: string
  icon: LucideIcon
  permission: string | null
  employeeOnly?: boolean
  moduleKey?: string
}

export type DashboardNavGroup = {
  id: string
  label: string
  icon: LucideIcon
  items: DashboardNavItem[]
}

/** Inicio del gestor de obras — redirige al listado de proyectos. */
export const DASHBOARD_HOME: DashboardNavItem = {
  name: "Inicio",
  href: "/dashboard/proyectos",
  icon: LayoutDashboard,
  permission: null,
}

/** Panel administración: solo gestión de proyectos/obras. */
export const DASHBOARD_NAV_GROUPS: DashboardNavGroup[] = [
  {
    id: "obras",
    label: "Gestión de obras",
    icon: HardHat,
    items: [
      { name: "Todos los proyectos", href: "/dashboard/proyectos", icon: FolderKanban, permission: "projects.view" },
      { name: "Nuevo proyecto", href: "/dashboard/proyectos/nuevo", icon: FolderKanban, permission: "projects.create" },
    ],
  },
]

/** Portal cliente: obras asignadas y documentación. */
export const CLIENT_PORTAL_NAV_GROUPS: DashboardNavGroup[] = [
  {
    id: "mis-obras",
    label: "Mis obras",
    icon: FolderKanban,
    items: [
      { name: "Resumen", href: "/dashboard", icon: LayoutDashboard, permission: null },
      { name: "Mis proyectos", href: "/dashboard", icon: HardHat, permission: null },
    ],
  },
  {
    id: "cliente-docs",
    label: "Documentación",
    icon: FileText,
    items: [{ name: "Documentos", href: "/dashboard/documentos", icon: FileText, permission: "documents.view" }],
  },
]

/** Personal de obra: acceso a proyectos asignados. */
export const STAFF_ZONE_NAV_GROUPS: DashboardNavGroup[] = [
  {
    id: "staff-projects",
    label: "Mis obras",
    icon: HardHat,
    items: [{ name: "Proyectos asignados", href: "/dashboard/proyectos", icon: FolderKanban, permission: "projects.view" }],
  },
]

export function isNavPathActive(pathname: string, href: string): boolean {
  if (href === "/dashboard/proyectos") {
    return pathname === "/dashboard/proyectos" || pathname.startsWith("/dashboard/proyectos/")
  }
  if (href === "/dashboard") return pathname === "/dashboard"
  return pathname === href || pathname.startsWith(`${href}/`)
}
