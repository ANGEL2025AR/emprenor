"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import type { SerializableUser } from "@/lib/auth/session"
import { hasPermission } from "@/lib/auth/permissions"
import type { UserRole } from "@/lib/db/models"
import Image from "next/image"
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
  LogOut,
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
} from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface DashboardSidebarProps {
  user: SerializableUser
}

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

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
      name: "Clientes",
      href: "/dashboard/clientes",
      icon: Users,
      permission: null,
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
      permission: "users.view" as const,
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
      permission: null,
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
    if (!item.permission) return true
    try {
      return hasPermission(userRole, item.permission)
    } catch {
      return false
    }
  })

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      window.location.href = "/login"
    } catch {
      window.location.href = "/login"
    }
  }

  // Safe user display
  const userInitials = `${user?.name?.charAt(0) || "U"}${user?.lastName?.charAt(0) || ""}`
  const userName = user?.name || "Usuario"
  const userLastName = user?.lastName || ""
  const roleDisplay = userRole.replace("_", " ")

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* Mobile toggle button */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden p-2.5 rounded-xl bg-slate-900 text-white shadow-lg hover:bg-slate-800 transition-colors"
        onClick={() => setIsOpen(true)}
        aria-label="Abrir menú"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 inset-y-0 left-0 z-50 h-screen bg-slate-900 flex flex-col transform transition-all duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0",
          isCollapsed ? "lg:w-20" : "lg:w-72",
          "w-72",
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800 flex-shrink-0">
          <Link
            href="/dashboard"
            className={cn("flex items-center gap-3 transition-all", isCollapsed && "lg:justify-center")}
          >
            <div className="relative w-10 h-10 flex-shrink-0">
              <Image src="/images/logo-emprenor.png" alt="EMPRENOR" fill className="object-contain" priority />
            </div>
            {!isCollapsed && <span className="text-xl font-bold text-white lg:block">EMPRENOR</span>}
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
        <nav className="flex-1 overflow-y-auto py-6 px-3">
          <ul className="space-y-1">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all group relative",
                      isActive
                        ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/20"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white",
                      isCollapsed && "lg:justify-center lg:px-2",
                    )}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className={cn(isCollapsed && "lg:hidden")}>{item.name}</span>

                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 hidden lg:block">
                        {item.name}
                      </div>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User info */}
        <div className="p-3 border-t border-slate-800 flex-shrink-0">
          <div
            className={cn(
              "flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-800/50",
              isCollapsed && "lg:justify-center lg:px-2",
            )}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
              {userInitials}
            </div>
            <div className={cn("flex-1 min-w-0", isCollapsed && "lg:hidden")}>
              <p className="text-sm font-medium text-white truncate">
                {userName} {userLastName}
              </p>
              <p className="text-xs text-slate-400 truncate capitalize">{roleDisplay}</p>
            </div>
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-3 w-full mt-2 px-3 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all",
              isCollapsed && "lg:justify-center lg:px-2",
            )}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className={cn(isCollapsed && "lg:hidden")}>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  )
}
