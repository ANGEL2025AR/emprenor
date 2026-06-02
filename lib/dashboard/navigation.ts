import type { LucideIcon } from "lucide-react"
import { LayoutDashboard, FolderKanban, FileText, HardHat, ClipboardList, UserCircle } from "lucide-react"

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

/** Inicio del panel de gestión. */
export const DASHBOARD_HOME: DashboardNavItem = {
  name: "Inicio",
  href: "/dashboard",
  icon: LayoutDashboard,
  permission: null,
}

/** @deprecated Usar MANAGEMENT_NAV_GROUPS */
export const DASHBOARD_NAV_GROUPS: DashboardNavGroup[] = []

/** Portal cliente: obras asignadas y documentación. */
export const CLIENT_PORTAL_NAV_GROUPS: DashboardNavGroup[] = [
  {
    id: "mis-obras",
    label: "Mis obras",
    icon: FolderKanban,
    items: [
      { name: "Resumen", href: "/dashboard", icon: LayoutDashboard, permission: null },
      { name: "Cumplimiento", href: "/dashboard/mi-obra", icon: ClipboardList, permission: null },
    ],
  },
  {
    id: "cliente-docs",
    label: "Documentación",
    icon: FileText,
    items: [{ name: "Documentos", href: "/dashboard/documentos", icon: FileText, permission: "documents.view" }],
  },
]

/** Personal de obra en campo: proyectos asignados. */
export const STAFF_ZONE_NAV_GROUPS: DashboardNavGroup[] = [
  {
    id: "staff-projects",
    label: "Mis obras",
    icon: HardHat,
    items: [
      { name: "Proyectos asignados", href: "/dashboard/proyectos", icon: FolderKanban, permission: "projects.view" },
      { name: "Zona empleados", href: "/dashboard/zona-empleados", icon: UserCircle, permission: null },
    ],
  },
]

export function isNavPathActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard"
  if (href === "/dashboard/proyectos") {
    return pathname === "/dashboard/proyectos" || pathname.startsWith("/dashboard/proyectos/")
  }
  return pathname === href || pathname.startsWith(`${href}/`)
}
