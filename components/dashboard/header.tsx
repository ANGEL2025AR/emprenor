"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { SerializableUser } from "@/lib/auth/session"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Bell,
  Search,
  UserIcon,
  LogOut,
  Settings,
  HelpCircle,
  Home,
  FolderKanban,
  ListTodo,
  ClipboardCheck,
  DollarSign,
  FileText,
  Check,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { ROLE_LABELS } from "@/lib/auth/permissions"
import type { UserRole } from "@/lib/db/models"

interface DashboardHeaderProps {
  user: SerializableUser
}

interface NotificationPreview {
  _id: string
  title: string
  message: string
  type: string
  read: boolean
  createdAt: string
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState<NotificationPreview[]>([])
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  // Fetch notifications count
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/notifications?limit=5")
        if (response.ok) {
          const data = await response.json()
          setUnreadCount(data.unreadCount || 0)
          setNotifications(data.notifications || [])
        }
      } catch {
        // Silent error
      }
    }

    fetchNotifications()
    // Refresh every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  // Keyboard shortcut for search
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/login")
      router.refresh()
    } catch {
      setIsLoggingOut(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: "PUT" })
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)))
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch {
      // Silent error
    }
  }

  // Safe user display
  const userInitials = `${user?.name?.charAt(0) || "U"}${user?.lastName?.charAt(0) || ""}`
  const userName = user?.name || "Usuario"
  const userLastName = user?.lastName || ""
  const userRole: UserRole = user?.role || "cliente"
  const roleLabel = ROLE_LABELS[userRole] || "Usuario"

  const quickLinks = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Proyectos", href: "/dashboard/proyectos", icon: FolderKanban },
    { name: "Nuevo Proyecto", href: "/dashboard/proyectos/nuevo", icon: FolderKanban },
    { name: "Tareas", href: "/dashboard/tareas", icon: ListTodo },
    { name: "Nueva Tarea", href: "/dashboard/tareas/nueva", icon: ListTodo },
    { name: "Inspecciones", href: "/dashboard/inspecciones", icon: ClipboardCheck },
    { name: "Finanzas", href: "/dashboard/finanzas", icon: DollarSign },
    { name: "Documentos", href: "/dashboard/documentos", icon: FileText },
    { name: "Configuración", href: "/dashboard/configuracion", icon: Settings },
  ]

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 md:px-6">
        <div className="flex h-full items-center justify-between gap-4">
          {/* Spacer for mobile menu button */}
          <div className="w-12 lg:hidden" />

          {/* Search */}
          <div className="flex-1 max-w-xl hidden md:block">
            <button onClick={() => setSearchOpen(true)} className="w-full relative flex items-center">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Buscar proyectos, tareas, documentos..."
                  className="pl-10 bg-slate-50 border-slate-200 cursor-pointer"
                  readOnly
                />
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </div>
            </button>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Mobile search button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-slate-600"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* Link to public site */}
            <Button variant="ghost" size="icon" asChild className="text-slate-600">
              <Link href="/" target="_blank">
                <Home className="w-5 h-5" />
              </Link>
            </Button>

            {/* Notifications dropdown */}
            <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-slate-600">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Notificaciones</span>
                  {unreadCount > 0 && <span className="text-xs text-slate-500">{unreadCount} sin leer</span>}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-sm text-slate-500">No hay notificaciones</div>
                ) : (
                  <>
                    {notifications.slice(0, 5).map((notification) => (
                      <DropdownMenuItem
                        key={notification._id}
                        className={`flex items-start gap-3 p-3 cursor-pointer ${!notification.read ? "bg-green-50/50" : ""}`}
                      >
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm truncate ${!notification.read ? "font-semibold" : ""}`}>
                            {notification.title}
                          </p>
                          <p className="text-xs text-slate-500 truncate">{notification.message}</p>
                        </div>
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 shrink-0"
                            onClick={(e) => {
                              e.stopPropagation()
                              markAsRead(notification._id)
                            }}
                          >
                            <Check className="w-3 h-3" />
                          </Button>
                        )}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        href="/dashboard/notificaciones"
                        className="w-full text-center text-sm text-green-600 font-medium cursor-pointer"
                      >
                        Ver todas las notificaciones
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-3 px-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-sm font-semibold">
                    {userInitials}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-slate-900">
                      {userName} {userLastName}
                    </p>
                    <p className="text-xs text-slate-500">{roleLabel}</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/perfil" className="flex items-center gap-2 cursor-pointer">
                    <UserIcon className="w-4 h-4" />
                    Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/configuracion" className="flex items-center gap-2 cursor-pointer">
                    <Settings className="w-4 h-4" />
                    Configuración
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/preguntas-frecuentes" className="flex items-center gap-2 cursor-pointer">
                    <HelpCircle className="w-4 h-4" />
                    Ayuda
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="text-red-600 focus:text-red-600 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {isLoggingOut ? "Cerrando sesión..." : "Cerrar Sesión"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Search Command Dialog */}
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder="Buscar en el dashboard..." />
        <CommandList>
          <CommandEmpty>No se encontraron resultados.</CommandEmpty>
          <CommandGroup heading="Navegación rápida">
            {quickLinks.map((link) => (
              <CommandItem
                key={link.href}
                onSelect={() => {
                  router.push(link.href)
                  setSearchOpen(false)
                }}
              >
                <link.icon className="mr-2 h-4 w-4" />
                <span>{link.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
