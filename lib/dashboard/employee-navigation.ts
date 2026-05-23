import {
  HardHat,
  ListTodo,
  FileText,
  AlertOctagon,
  ClipboardCheck,
  MessageSquare,
  Bell,
  Calendar,
  UserCircle,
  Wallet,
  BadgeDollarSign,
  Banknote,
  FolderOpen,
  Palmtree,
  ShieldAlert,
  HelpCircle,
  Megaphone,
  FolderKanban,
} from "lucide-react"
import type { DashboardNavGroup } from "@/lib/dashboard/navigation"

/** Menú exclusivo empleados de obra (trabajador / supervisor). Sin finanzas, clientes ni admin. */
export const EMPLOYEE_NAV_GROUPS: DashboardNavGroup[] = [
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
    id: "obra",
    label: "Mi Obra",
    icon: HardHat,
    items: [
      { name: "Mis obras", href: "/dashboard/proyectos", icon: FolderKanban, permission: "projects.view" },
      { name: "Tareas", href: "/dashboard/tareas", icon: ListTodo, permission: "tasks.view" },
      { name: "Bitácora diaria", href: "/dashboard/bitacora-diaria", icon: FileText, permission: "daily_logs.view" },
      { name: "Incidencias", href: "/dashboard/incidencias", icon: AlertOctagon, permission: "incidents.view" },
      { name: "Inspecciones", href: "/dashboard/inspecciones", icon: ClipboardCheck, permission: "inspections.view" },
      { name: "Documentos de obra", href: "/dashboard/documentos", icon: FileText, permission: "documents.view" },
    ],
  },
  {
    id: "supervision",
    label: "Supervisión",
    icon: ClipboardCheck,
    items: [
      { name: "Punch Lists", href: "/dashboard/punch-lists", icon: ClipboardCheck, permission: "quality.view" },
      { name: "Consultas técnicas (RFI)", href: "/dashboard/rfis", icon: MessageSquare, permission: "tasks.view" },
    ],
  },
  {
    id: "comunicacion",
    label: "Comunicación",
    icon: Bell,
    items: [
      { name: "Notificaciones", href: "/dashboard/notificaciones", icon: Bell, permission: "notifications.view" },
      { name: "Chat de obra", href: "/dashboard/chat", icon: MessageSquare, permission: "chat.view" },
      { name: "Calendario", href: "/dashboard/calendario", icon: Calendar, permission: "calendar.view" },
    ],
  },
]

/** Ítems de supervisión solo visibles para capataz / supervisor. */
export const EMPLOYEE_SUPERVISOR_ONLY_GROUP_IDS = new Set(["supervision"])
