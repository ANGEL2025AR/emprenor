import {
  UserCircle,
  BadgeDollarSign,
  Banknote,
  FolderOpen,
  Palmtree,
  ShieldAlert,
  HelpCircle,
  Megaphone,
  Wallet,
} from "lucide-react"
import type { DashboardNavGroup, DashboardNavItem } from "@/lib/dashboard/navigation"

/** Únicos accesos del empleado de obra (trabajador / supervisor). */
export const EMPLOYEE_PORTAL_NAV_ITEMS: DashboardNavItem[] = [
  {
    name: "Mi Portal",
    href: "/dashboard/portal",
    icon: Wallet,
    permission: "portal.dashboard",
    employeeOnly: true,
  },
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
]

/** Compatibilidad con filterNavGroups (un solo bloque, sin sub-menús de obra). */
export const EMPLOYEE_NAV_GROUPS: DashboardNavGroup[] = [
  {
    id: "portal-empleado",
    label: "Mi Portal",
    icon: UserCircle,
    items: EMPLOYEE_PORTAL_NAV_ITEMS.filter((item) => item.href !== "/dashboard/portal"),
  },
]
