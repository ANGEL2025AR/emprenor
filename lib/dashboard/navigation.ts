import type { LucideIcon } from "lucide-react"
import {
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  ClipboardCheck,
  DollarSign,
  FileText,
  Bell,
  MessageSquare,
  Users,
  Settings,
  FileSignature,
  Receipt,
  CreditCard,
  Calendar,
  Package,
  Truck,
  UserCheck,
  BarChart3,
  Award,
  AlertOctagon,
  Shield,
  ShieldCheck,
  Inbox,
  Wallet,
  Palmtree,
  HelpCircle,
  Megaphone,
  ShieldAlert,
  Banknote,
  FolderOpen,
  BadgeDollarSign,
  LayoutTemplate,
  HardHat,
  Briefcase,
  Building2,
  Boxes,
  UserCircle,
  Radio,
  ClipboardList,
  Globe,
} from "lucide-react"
import type { PortalModuleKey } from "@/lib/portal/portal-settings-shared"

export type DashboardNavItem = {
  name: string
  href: string
  icon: LucideIcon
  permission: string | null
  employeeOnly?: boolean
  moduleKey?: PortalModuleKey
}

export type DashboardNavGroup = {
  id: string
  label: string
  icon: LucideIcon
  items: DashboardNavItem[]
}

/** Dashboard principal (siempre arriba, fuera de grupos). */
export const DASHBOARD_HOME: DashboardNavItem = {
  name: "Dashboard",
  href: "/dashboard",
  icon: LayoutDashboard,
  permission: null,
}

/** Inicio del portal empleado (evita duplicar /dashboard + Mi Portal > Inicio). */
export const EMPLOYEE_PORTAL_HOME: DashboardNavItem = {
  name: "Inicio",
  href: "/dashboard/portal",
  icon: Wallet,
  permission: "portal.dashboard",
}

/** Menús agrupados por área de negocio. */
export const DASHBOARD_NAV_GROUPS: DashboardNavGroup[] = [
  {
    id: "proyectos",
    label: "Proyectos y Obra",
    icon: HardHat,
    items: [
      { name: "Proyectos", href: "/dashboard/proyectos", icon: FolderKanban, permission: "projects.view" },
      { name: "Cumplimiento de obra", href: "/dashboard/cumplimiento-obra", icon: ClipboardList, permission: "compliance.manage" },
      { name: "Bitácora Diaria", href: "/dashboard/bitacora-diaria", icon: FileText, permission: "projects.view" },
      { name: "Punch Lists", href: "/dashboard/punch-lists", icon: ClipboardCheck, permission: "quality.view" },
      { name: "RFIs", href: "/dashboard/rfis", icon: MessageSquare, permission: "projects.view" },
      { name: "Tareas", href: "/dashboard/tareas", icon: ListTodo, permission: "tasks.view" },
      { name: "Inspecciones", href: "/dashboard/inspecciones", icon: ClipboardCheck, permission: "inspections.view" },
      { name: "Incidencias", href: "/dashboard/incidencias", icon: AlertOctagon, permission: "incidents.view" },
    ],
  },
  {
    id: "comercial",
    label: "Comercial",
    icon: Briefcase,
    items: [
      { name: "Clientes", href: "/dashboard/clientes", icon: Users, permission: "clients.view" },
      { name: "Cotizaciones", href: "/dashboard/cotizaciones", icon: FileText, permission: "finance.view" },
      { name: "Contratos", href: "/dashboard/contratos", icon: FileSignature, permission: "finance.view" },
    ],
  },
  {
    id: "finanzas",
    label: "Finanzas",
    icon: DollarSign,
    items: [
      { name: "Panel Financiero", href: "/dashboard/finanzas", icon: DollarSign, permission: "finance.view" },
      { name: "Facturas", href: "/dashboard/facturas", icon: Receipt, permission: "finance.view" },
      { name: "Pagos", href: "/dashboard/pagos", icon: CreditCard, permission: "finance.view" },
      { name: "Reportes", href: "/dashboard/reportes", icon: BarChart3, permission: "reports.view" },
    ],
  },
  {
    id: "logistica",
    label: "Logística",
    icon: Boxes,
    items: [
      { name: "Inventario", href: "/dashboard/inventario", icon: Package, permission: "inventory.view" },
      { name: "Proveedores", href: "/dashboard/proveedores", icon: Truck, permission: "suppliers.view" },
    ],
  },
  {
    id: "rrhh",
    label: "Recursos Humanos",
    icon: UserCheck,
    items: [
      { name: "Empleados", href: "/dashboard/empleados", icon: UserCheck, permission: "employees.view" },
      { name: "Portal Empleados", href: "/dashboard/admin/portal", icon: Wallet, permission: "portal.admin" },
    ],
  },
  {
    id: "portal-empleado",
    label: "Mi Portal",
    icon: UserCircle,
    items: [
      {
        name: "Billetera Virtual",
        href: "/dashboard/portal/billetera",
        icon: BadgeDollarSign,
        permission: "portal.wallet",
        employeeOnly: true,
        moduleKey: "wallet",
      },
      {
        name: "Recibos de Sueldo",
        href: "/dashboard/portal/recibos",
        icon: Banknote,
        permission: "portal.payslips",
        employeeOnly: true,
        moduleKey: "payslips",
      },
      {
        name: "Mi Legajo",
        href: "/dashboard/portal/legajo",
        icon: FolderOpen,
        permission: "portal.personnel_file",
        employeeOnly: true,
        moduleKey: "personnelFile",
      },
      {
        name: "Solicitudes",
        href: "/dashboard/portal/solicitudes",
        icon: Palmtree,
        permission: "portal.leave_requests",
        employeeOnly: true,
        moduleKey: "leaveRequests",
      },
      {
        name: "ART / Seguridad",
        href: "/dashboard/portal/art",
        icon: ShieldAlert,
        permission: "portal.art",
        employeeOnly: true,
        moduleKey: "art",
      },
      {
        name: "Mesa de Ayuda",
        href: "/dashboard/portal/mesa-ayuda",
        icon: HelpCircle,
        permission: "portal.help_desk",
        employeeOnly: true,
        moduleKey: "helpDesk",
      },
      {
        name: "Comunicaciones",
        href: "/dashboard/portal/comunicaciones",
        icon: Megaphone,
        permission: "portal.announcements",
        employeeOnly: true,
        moduleKey: "announcements",
      },
    ],
  },
  {
    id: "calidad",
    label: "Calidad y Documentos",
    icon: Award,
    items: [
      { name: "Certificados", href: "/dashboard/certificados", icon: Award, permission: "quality.view" },
      { name: "Documentos", href: "/dashboard/documentos", icon: FileText, permission: "documents.view" },
    ],
  },
  {
    id: "comunicacion",
    label: "Comunicación",
    icon: Radio,
    items: [
      { name: "Notificaciones", href: "/dashboard/notificaciones", icon: Bell, permission: "notifications.view" },
      { name: "Chat", href: "/dashboard/chat", icon: MessageSquare, permission: "chat.view" },
      { name: "Calendario", href: "/dashboard/calendario", icon: Calendar, permission: "calendar.view" },
    ],
  },
  {
    id: "administracion",
    label: "Administración",
    icon: Building2,
    items: [
      { name: "Usuarios", href: "/dashboard/usuarios", icon: Users, permission: "users.view" },
      { name: "Roles y Permisos", href: "/dashboard/roles", icon: ShieldCheck, permission: "admin.roles" },
      { name: "Auditoría", href: "/dashboard/auditoria", icon: Shield, permission: "admin.access" },
      { name: "Contactos Web", href: "/dashboard/contactos", icon: Inbox, permission: "contacts.view" },
      { name: "Configuración", href: "/dashboard/configuracion", icon: Settings, permission: "admin.access" },
    ],
  },
  {
    id: "sitio-web",
    label: "Sitio Web",
    icon: Globe,
    items: [
      { name: "Proyectos públicos", href: "/dashboard/sitio-web/proyectos", icon: Globe, permission: "admin.access" },
      { name: "Portadas (slider)", href: "/dashboard/sitio-web/paginas", icon: LayoutTemplate, permission: "admin.access" },
    ],
  },
]

/** Menú exclusivo rol cliente (portal de obra). */
export const CLIENT_PORTAL_NAV_GROUPS: DashboardNavGroup[] = [
  {
    id: "mi-obra",
    label: "Mi obra",
    icon: HardHat,
    items: [
      { name: "Mis obras", href: "/dashboard", icon: LayoutDashboard, permission: null },
      { name: "Cumplimiento de obra", href: "/dashboard/mi-obra", icon: ClipboardList, permission: "client.compliance.view" },
    ],
  },
  {
    id: "cliente-docs",
    label: "Documentación",
    icon: FileText,
    items: [
      { name: "Documentos", href: "/dashboard/documentos", icon: FileText, permission: "documents.view" },
      { name: "Certificados", href: "/dashboard/certificados", icon: Award, permission: "certificates.view" },
      { name: "Notificaciones", href: "/dashboard/notificaciones", icon: Bell, permission: "notifications.view" },
    ],
  },
]

export function isNavPathActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard"
  return pathname === href || pathname.startsWith(`${href}/`)
}
