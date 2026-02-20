"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Wallet, FileText, FolderOpen, CalendarDays, ShieldCheck,
  Headphones, Megaphone, CreditCard, ArrowRight, Clock,
  DollarSign, Umbrella, QrCode,
} from "lucide-react"
import { usePermissions } from "@/lib/auth/access-control"

interface DashboardData {
  wallet: { balance: number; aguinaldo: number; advances: number } | null
  pendingRequests: number
  unreadAnnouncements: number
  openTickets: number
  vacationDays: number
  nextPayDate: string
  aguinaldoDate: string
}

export default function PortalDashboardPage() {
  const { user, can } = usePermissions()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [walletRes, requestsRes, ticketsRes, announcementsRes] = await Promise.allSettled([
          fetch("/api/portal/wallet"),
          fetch("/api/portal/leave-requests"),
          fetch("/api/portal/help-desk"),
          fetch("/api/portal/announcements"),
        ])

        const wallet = walletRes.status === "fulfilled" && walletRes.value.ok
          ? (await walletRes.value.json()).wallet : null
        const requests = requestsRes.status === "fulfilled" && requestsRes.value.ok
          ? (await requestsRes.value.json()).requests : []
        const tickets = ticketsRes.status === "fulfilled" && ticketsRes.value.ok
          ? (await ticketsRes.value.json()).tickets : []
        const announcements = announcementsRes.status === "fulfilled" && announcementsRes.value.ok
          ? (await announcementsRes.value.json()).announcements : []

        const now = new Date()
        const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 5)
        const aguinaldoMonth = now.getMonth() < 6 ? 5 : 11
        const aguinaldoDate = new Date(now.getFullYear(), aguinaldoMonth, 18)

        setData({
          wallet: wallet ? { balance: wallet.balance || 0, aguinaldo: wallet.aguinaldo || 0, advances: wallet.advances || 0 } : { balance: 0, aguinaldo: 0, advances: 0 },
          pendingRequests: requests.filter((r: { status: string }) => r.status === "pendiente").length,
          unreadAnnouncements: announcements.length,
          openTickets: tickets.filter((t: { status: string }) => ["abierto", "en_proceso"].includes(t.status)).length,
          vacationDays: 14,
          nextPayDate: nextMonth.toLocaleDateString("es-AR", { day: "numeric", month: "long" }),
          aguinaldoDate: aguinaldoDate.toLocaleDateString("es-AR", { day: "numeric", month: "long" }),
        })
      } catch {
        setData(null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const quickLinks = [
    { label: "Billetera Virtual", href: "/dashboard/portal/billetera", icon: Wallet, color: "bg-emerald-500", permission: "portal.wallet" },
    { label: "Recibos de Sueldo", href: "/dashboard/portal/recibos", icon: FileText, color: "bg-blue-500", permission: "portal.payslips" },
    { label: "Mi Legajo", href: "/dashboard/portal/legajo", icon: FolderOpen, color: "bg-amber-500", permission: "portal.personnel_file" },
    { label: "Solicitudes", href: "/dashboard/portal/solicitudes", icon: CalendarDays, color: "bg-violet-500", permission: "portal.leave_requests" },
    { label: "ART / Seguros", href: "/dashboard/portal/art", icon: ShieldCheck, color: "bg-rose-500", permission: "portal.art" },
    { label: "Mesa de Ayuda", href: "/dashboard/portal/mesa-ayuda", icon: Headphones, color: "bg-cyan-500", permission: "portal.help_desk" },
    { label: "Comunicaciones", href: "/dashboard/portal/comunicaciones", icon: Megaphone, color: "bg-orange-500", permission: "portal.announcements" },
    { label: "Adelantos", href: "/dashboard/portal/adelantos", icon: CreditCard, color: "bg-teal-500", permission: "portal.advances" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Portal del Empleado
        </h1>
        <p className="text-slate-600">
          Bienvenido, {user?.name} {user?.lastName}
        </p>
      </div>

      {/* Saldo Widget principal */}
      <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0 shadow-xl">
        <CardContent className="p-6">
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-32 bg-slate-700" />
              <Skeleton className="h-10 w-48 bg-slate-700" />
            </div>
          ) : (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <p className="text-slate-400 text-sm font-medium uppercase tracking-wide">Saldo Disponible</p>
                <p className="text-4xl font-bold mt-1">
                  ${(data?.wallet?.balance ?? 0).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                </p>
                <div className="flex gap-4 mt-3 text-sm">
                  <span className="text-slate-400">
                    Aguinaldo: <span className="text-emerald-400 font-medium">${(data?.wallet?.aguinaldo ?? 0).toLocaleString("es-AR")}</span>
                  </span>
                  <span className="text-slate-400">
                    Adelantos: <span className="text-amber-400 font-medium">${(data?.wallet?.advances ?? 0).toLocaleString("es-AR")}</span>
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Link href="/dashboard/portal/billetera">
                    <Wallet className="w-4 h-4 mr-2" />
                    Retirar Fondos
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Panel de fechas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase">Proximo cobro</p>
              <p className="text-lg font-bold text-slate-900">
                {loading ? <Skeleton className="h-5 w-24" /> : data?.nextPayDate}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase">Aguinaldo</p>
              <p className="text-lg font-bold text-slate-900">
                {loading ? <Skeleton className="h-5 w-24" /> : data?.aguinaldoDate}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-violet-500">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
              <Umbrella className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase">Vacaciones disponibles</p>
              <p className="text-lg font-bold text-slate-900">
                {loading ? <Skeleton className="h-5 w-16" /> : `${data?.vacationDays} dias`}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-500" />
              <div>
                <p className="text-sm font-medium text-slate-900">Solicitudes Pendientes</p>
                <p className="text-xs text-slate-500">Licencias y permisos</p>
              </div>
            </div>
            <Badge variant={data?.pendingRequests ? "destructive" : "secondary"}>
              {loading ? "..." : data?.pendingRequests || 0}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Headphones className="w-5 h-5 text-cyan-500" />
              <div>
                <p className="text-sm font-medium text-slate-900">Tickets Abiertos</p>
                <p className="text-xs text-slate-500">Mesa de ayuda</p>
              </div>
            </div>
            <Badge variant={data?.openTickets ? "default" : "secondary"}>
              {loading ? "..." : data?.openTickets || 0}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Megaphone className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-slate-900">Comunicaciones</p>
                <p className="text-xs text-slate-500">Sin leer</p>
              </div>
            </div>
            <Badge variant="secondary">
              {loading ? "..." : data?.unreadAnnouncements || 0}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Acceso rapido ART + QR */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <QrCode className="w-5 h-5 text-emerald-600" />
            Credencial ART - Acceso Rapido
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-32 h-32 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center bg-slate-50">
              <div className="text-center">
                <QrCode className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="text-xs text-slate-400 mt-1">Codigo QR</p>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <p className="text-sm text-slate-600">
                Tu credencial ART con codigo QR estara disponible una vez que el administrador cargue tus datos de aseguradora en tu legajo personal.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/portal/art">
                    Ver ART / Seguros
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/portal/legajo">
                    Ver Mi Legajo
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick links grid */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Acceso Rapido</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickLinks
            .filter((l) => can(l.permission))
            .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex flex-col items-center gap-3 p-5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all"
              >
                <div className={`w-12 h-12 rounded-xl ${link.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                  <link.icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-slate-700 text-center">{link.label}</span>
              </Link>
            ))}
        </div>
      </div>
    </div>
  )
}
