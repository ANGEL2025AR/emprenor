"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import type { SerializableUser } from "@/lib/auth/session"
import { hasPermission } from "@/lib/auth/permissions"
import type { UserRole } from "@/lib/db/models"
import Image from "next/image"
import { isPortalAdminRole, isPortalEmployeeRole } from "@/lib/auth/portal-roles"
import {
  isPortalModuleEnabled,
  type PortalModuleKey,
  type PortalSettings,
} from "@/lib/portal/portal-settings-shared"
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
  X,
  ChevronLeft,
  Menu,
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
  Zap,
  Globe,
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
} from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface DashboardSidebarProps {
  user: SerializableUser
  /** Configuración del portal cargada en el servidor (evita parpadeo y desajustes). */
  initialPortalSettings?: PortalSettings | null
}

export function DashboardSidebar({ user, initialPortalSettings = null }: DashboardSidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const [portalSettings, setPortalSettings] = useState<PortalSettings | null>(initialPortalSettings)

  // Close mobile menu on route change
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

  // Ensure role is valid
  const userRole: UserRole = user?.role || "cliente"

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      permission: null,
    },
    {
      name: "Proyectos",
      href: "/dashboard/proyectos",
      icon: FolderKanban,
      permission: "projects.view" as const,
    },
    {
      name: "Bitácora Diaria",
      href: "/dashboard/bitacora-diaria",
      icon: FileText,
      permission: "projects.view" as const,
    },
    {
      name: "Punch Lists",
      href: "/dashboard/punch-lists",
      icon: ClipboardCheck,
      permission: "quality.view" as const,
    },
    {
      name: "RFIs",
      href: "/dashboard/rfis",
      icon: MessageSquare,
      permission: "projects.view" as const,
    },
    {
      name: "Clientes",
      href: "/dashboard/clientes",
      icon: Users,
      permission: "clients.view" as const,
    },
    {
      name: "Tareas",
      href: "/dashboard/tareas",
      icon: ListTodo,
      permission: "tasks.view" as const,
    },
    {
      name: "Cotizaciones",
      href: "/dashboard/cotizaciones",
      icon: FileText,
      permission: "finance.view" as const,
    },
    {
      name: "Contratos",
      href: "/dashboard/contratos",
      icon: FileSignature,
      permission: "finance.view" as const,
    },
    {
      name: "Facturas",
      href: "/dashboard/facturas",
      icon: Receipt,
      permission: "finance.view" as const,
    },
    {
      name: "Pagos",
      href: "/dashboard/pagos",
      icon: CreditCard,
      permission: "finance.view" as const,
    },
    {
      name: "Inventario",
      href: "/dashboard/inventario",
      icon: Package,
      permission: "inventory.view" as const,
    },
    {
      name: "Proveedores",
      href: "/dashboard/proveedores",
      icon: Truck,
      permission: "suppliers.view" as const,
    },
    {
      name: "Empleados",
      href: "/dashboard/empleados",
      icon: UserCheck,
      permission: "employees.view" as const,
    },
    {
      name: "Inspecciones",
      href: "/dashboard/inspecciones",
      icon: ClipboardCheck,
      permission: "inspections.view" as const,
    },
    {
      name: "Finanzas",
      href: "/dashboard/finanzas",
      icon: DollarSign,
      permission: "finance.view" as const,
    },
    {
      name: "Calendario",
      href: "/dashboard/calendario",
      icon: Calendar,
      permission: "calendar.view" as const,
    },
    {
      name: "Automatizaciones",
      href: "/dashboard/automatizaciones",
      icon: Zap,
      permission: "admin.access" as const,
    },
    {
      name: "Reportes",
      href: "/dashboard/reportes",
      icon: BarChart3,
      permission: "reports.view" as const,
    },
    {
      name: "Certificados",
      href: "/dashboard/certificados",
      icon: Award,
      permission: "quality.view" as const,
    },
    {
      name: "Incidencias",
      href: "/dashboard/incidencias",
      icon: AlertOctagon,
      permission: "incidents.view" as const,
    },
    {
      name: "Documentos",
      href: "/dashboard/documentos",
      icon: FileText,
      permission: "documents.view" as const,
    },
    {
      name: "Notificaciones",
      href: "/dashboard/notificaciones",
      icon: Bell,
      permission: "notifications.view" as const,
    },
    {
      name: "Chat",
      href: "/dashboard/chat",
      icon: MessageSquare,
      permission: "chat.view" as const,
    },
    {
      name: "Sitio Web",
      href: "/dashboard/sitio-web/proyectos",
      icon: Globe,
      permission: "admin.access" as const,
    },
    {
      name: "Portadas (slider)",
      href: "/dashboard/sitio-web/paginas",
      icon: LayoutTemplate,
      permission: "admin.access" as const,
    },
    {
      name: "Portal Empleados",
      href: "/dashboard/admin/portal",
      icon: Wallet,
      permission: "portal.admin" as const,
    },
    {
      name: "Portal (mi espacio)",
      href: "/dashboard/portal",
      icon: Wallet,
      permission: "portal.dashboard" as const,
      employeeOnly: true,
    },
    {
      name: "Billetera Virtual",
      href: "/dashboard/portal/billetera",
      icon: BadgeDollarSign,
      permission: "portal.wallet" as const,
      employeeOnly: true,
      moduleKey: "wallet" as const,
    },
    {
      name: "Recibos de Sueldo",
      href: "/dashboard/portal/recibos",
      icon: Banknote,
      permission: "portal.payslips" as const,
      employeeOnly: true,
      moduleKey: "payslips" as const,
    },
    {
      name: "Mi Legajo",
      href: "/dashboard/portal/legajo",
      icon: FolderOpen,
      permission: "portal.personnel_file" as const,
      employeeOnly: true,
      moduleKey: "personnelFile" as const,
    },
    {
      name: "Solicitudes",
      href: "/dashboard/portal/solicitudes",
      icon: Palmtree,
      permission: "portal.leave_requests" as const,
      employeeOnly: true,
      moduleKey: "leaveRequests" as const,
    },
    {
      name: "ART / Seguridad",
      href: "/dashboard/portal/art",
      icon: ShieldAlert,
      permission: "portal.art" as const,
      employeeOnly: true,
      moduleKey: "art" as const,
    },
    {
      name: "Mesa de Ayuda",
      href: "/dashboard/portal/mesa-ayuda",
      icon: HelpCircle,
      permission: "portal.help_desk" as const,
      employeeOnly: true,
      moduleKey: "helpDesk" as const,
    },
    {
      name: "Comunicaciones",
      href: "/dashboard/portal/comunicaciones",
      icon: Megaphone,
      permission: "portal.announcements" as const,
      employeeOnly: true,
      moduleKey: "announcements" as const,
    },
    {
      name: "Contactos Web",
      href: "/dashboard/contactos",
      icon: Inbox,
      permission: "contacts.view" as const,
    },
    {
      name: "Roles y Permisos",
      href: "/dashboard/roles",
      icon: ShieldCheck,
      permission: "admin.roles" as const,
    },
    {
      name: "Auditoría",
      href: "/dashboard/auditoria",
      icon: Shield,
      permission: "admin.access" as const,
    },
    {
      name: "Usuarios",
      href: "/dashboard/usuarios",
      icon: Users,
      permission: "users.view" as const,
    },
    {
      name: "Configuración",
      href: "/dashboard/configuracion",
      icon: Settings,
      permission: null,
    },
  ]

  const filteredNavigation = navigation.filter((item) => {
    const nav = item as {
      employeeOnly?: boolean
      permission: string | null
      moduleKey?: PortalModuleKey
    }

    if (nav.employeeOnly) {
      if (!isPortalEmployeeRole(userRole)) return false
      if (nav.moduleKey && portalSettings && !isPortalModuleEnabled(portalSettings, nav.moduleKey)) {
        return false
      }
      return nav.permission ? hasPermission(userRole, nav.permission) : true
    }

    if (nav.permission === "portal.admin") {
      return isPortalAdminRole(userRole) && hasPermission(userRole, "portal.admin")
    }

    if (!nav.permission) return true
    try {
      return hasPermission(userRole, nav.permission)
    } catch {
      return false
    }
  })

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* Mobile toggle button */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden p-2.5 rounded-xl border border-emerald-500/30 bg-slate-950 text-white shadow-lg shadow-emerald-500/20 hover:border-emerald-400/50 transition-all"
        onClick={() => setIsOpen(true)}
        aria-label="Abrir menú"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar */}
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
        {/* Header */}
        <div className="relative flex h-16 items-center justify-between px-4 border-b border-white/5 flex-shrink-0 z-10">
          <Link
            href="/dashboard"
            className={cn("flex items-center gap-3 transition-all", isCollapsed && "lg:justify-center")}
          >
            <div
              className={cn(
                "relative flex-shrink-0 drop-shadow-[0_0_16px_rgba(99,102,241,0.35)]",
                isCollapsed ? "h-10 w-10 lg:h-10 lg:w-10" : "h-10 w-36 sm:w-40",
              )}
            >
              <Image
                src={isCollapsed ? "/images/logo-icon-inverted.png" : "/images/logo-emprenor-white.png"}
                alt="EMPRENOR"
                fill
                sizes={isCollapsed ? "40px" : "160px"}
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          {/* Mobile close button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-slate-400 hover:text-white hover:bg-slate-800"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>

          {/* Desktop collapse button */}
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

        {/* Navigation */}
        <nav className="relative z-10 flex-1 overflow-y-auto py-5 px-3 scrollbar-thin">
          <ul className="space-y-0.5">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                      isActive ? "dashboard-nav-active text-white" : "dashboard-nav-item",
                      isCollapsed && "lg:justify-center lg:px-2",
                    )}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className={cn(isCollapsed && "lg:hidden")}>{item.name}</span>

                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-2 px-3 py-1.5 bg-slate-800/95 border border-white/10 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 hidden lg:block shadow-xl">
                        {item.name}
                      </div>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

      </aside>
    </>
  )
}
