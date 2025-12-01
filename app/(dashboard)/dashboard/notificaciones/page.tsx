"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Bell, Check, CheckCheck, Info, AlertTriangle, CheckCircle, XCircle, Loader2 } from "lucide-react"
import type { Notification } from "@/lib/db/models"

const TYPE_CONFIG: Record<string, { icon: React.ElementType; color: string }> = {
  info: { icon: Info, color: "bg-blue-100 text-blue-600" },
  alerta: { icon: AlertTriangle, color: "bg-amber-100 text-amber-600" },
  urgente: { icon: AlertTriangle, color: "bg-red-100 text-red-600" },
  exito: { icon: CheckCircle, color: "bg-green-100 text-green-600" },
  error: { icon: XCircle, color: "bg-red-100 text-red-600" },
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications")
      const data = await response.json()
      setNotifications(data.notifications || [])
      setUnreadCount(data.unreadCount || 0)
    } catch {
      // Error silencioso en producción
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: "PUT" })
      fetchNotifications()
    } catch {
      // Error silencioso en producción
    }
  }

  const markAllAsRead = async () => {
    try {
      await Promise.all(
        notifications.filter((n) => !n.read).map((n) => fetch(`/api/notifications/${n._id}/read`, { method: "PUT" })),
      )
      fetchNotifications()
    } catch {
      // Error silencioso en producción
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notificaciones</h1>
          <p className="text-slate-600">
            {unreadCount > 0 ? `Tienes ${unreadCount} notificaciones sin leer` : "Todas las notificaciones leídas"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            <CheckCheck className="w-4 h-4 mr-2" />
            Marcar todas como leídas
          </Button>
        )}
      </div>

      {/* Notifications list */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      ) : notifications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No hay notificaciones</h3>
            <p className="text-slate-600">Las notificaciones aparecerán aquí</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => {
            const config = TYPE_CONFIG[notification.type] || TYPE_CONFIG.info
            const Icon = config.icon
            return (
              <Card
                key={notification._id?.toString()}
                className={`transition-all ${!notification.read ? "border-l-4 border-l-green-500 bg-green-50/30" : ""}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${config.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-slate-900">{notification.title}</h3>
                          <p className="text-sm text-slate-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-slate-400 mt-2">
                            {new Date(notification.createdAt).toLocaleString("es-AR")}
                          </p>
                        </div>
                        {!notification.read && (
                          <Button variant="ghost" size="sm" onClick={() => markAsRead(notification._id!.toString())}>
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
