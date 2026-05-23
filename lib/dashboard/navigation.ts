import type { LucideIcon } from "lucide-react"
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Inbox,
  Globe,
  LayoutTemplate,
  Wrench,
  FileText,
  ClipboardList,
  HardHat,
  Construction,
  ShieldCheck,
} from "lucide-react"

export type DashboardNavItem = {
  name: string
  href: string
  icon: LucideIcon
  permission: string | null
  employeeOnly?: boolean
  /** Legacy portal empleado (archivo en desuso). */
  moduleKey?: string
}

export type DashboardNavGroup = {
  id: string
  label: string
  icon: LucideIcon
  items: DashboardNavItem[]
}

/** Panel principal administración (super_admin / admin). */
export const DASHBOARD_HOME: DashboardNavItem = {
  name: "Inicio",
  href: "/dashboard",
  icon: LayoutDashboard,
  permission: null,
}

/**
 * Menú reducido: operación (proyectos + clientes), consultas web y CMS público.
 * El resto de módulos se retiró del menú hasta desarrollarlos por separado.
 */
export const DASHBOARD_NAV_GROUPS: DashboardNavGroup[] = [
  {
    id: "operacion",
    label: "Operación",
    icon: HardHat,
    items: [
      { name: "Proyectos", href: "/dashboard/proyectos", icon: FolderKanban, permission: "projects.view" },
      { name: "Clientes", href: "/dashboard/clientes", icon: Users, permission: "clients.view" },
    ],
  },
  {
    id: "atencion",
    label: "Atención al cliente",
    icon: Inbox,
    items: [
      { name: "Consultas y mensajes", href: "/dashboard/contactos", icon: Inbox, permission: "contacts.view" },
      { name: "Solicitudes de acceso", href: "/dashboard/accesos", icon: ShieldCheck, permission: "users.view" },
    ],
  },
  {
    id: "sitio-web",
    label: "Sitio web público",
    icon: Globe,
    items: [
      { name: "Proyectos públicos", href: "/dashboard/sitio-web/proyectos", icon: Globe, permission: "website.view" },
      { name: "Portadas (slider)", href: "/dashboard/sitio-web/paginas", icon: LayoutTemplate, permission: "website.view" },
      { name: "Servicios", href: "/dashboard/sitio-web/servicios", icon: Wrench, permission: "website.view" },
    ],
  },
]

/** Portal cliente: obras, documentación y cumplimiento. */
export const CLIENT_PORTAL_NAV_GROUPS: DashboardNavGroup[] = [
  {
    id: "mis-proyectos",
    label: "Mis proyectos",
    icon: FolderKanban,
    items: [
      { name: "Resumen", href: "/dashboard", icon: LayoutDashboard, permission: null },
      { name: "Todas mis obras", href: "/dashboard/mi-obra", icon: HardHat, permission: "client.compliance.view" },
    ],
  },
  {
    id: "cliente-docs",
    label: "Documentación",
    icon: FileText,
    items: [
      { name: "Documentos", href: "/dashboard/documentos", icon: FileText, permission: "documents.view" },
    ],
  },
]

/** Personal de obra / gerencia operativa: zona aparte (en desarrollo). */
export const STAFF_ZONE_NAV_GROUPS: DashboardNavGroup[] = [
  {
    id: "staff-zone",
    label: "Personal",
    icon: Construction,
    items: [
      { name: "Zona empleados", href: "/dashboard/zona-empleados", icon: Construction, permission: null },
    ],
  },
]

export function isNavPathActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard"
  return pathname === href || pathname.startsWith(`${href}/`)
}
