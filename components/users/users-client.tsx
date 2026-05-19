"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Search,
  Filter,
  Loader2,
  UserPlus,
  Mail,
  Phone,
  MoreVertical,
  Pencil,
  UserX,
  UserCheck,
  ShieldCheck,
  Trash2,
} from "lucide-react"
import { ROLE_LABELS, ROLE_COLORS } from "@/lib/auth/permissions"
import { usePermissions } from "@/lib/auth/access-control"
import { useToast } from "@/hooks/use-toast"
import type { UserRole } from "@/lib/db/models"
import { DashboardPageHeader, DashboardPrimaryButton } from "@/components/dashboard/dashboard-ui"

type UserRow = {
  _id: string
  email: string
  name: string
  lastName: string
  phone?: string
  role: UserRole
  isActive: boolean
  emailVerified: boolean
}

function getUserInitials(name?: string | null, lastName?: string | null): string {
  const firstInitial = (name || "U").charAt(0).toUpperCase()
  const lastInitial = (lastName || "").charAt(0).toUpperCase()
  return firstInitial + lastInitial
}

const ROLE_OPTIONS: { value: UserRole; label: string; superAdminOnly?: boolean }[] = [
  { value: "admin", label: "Administrador" },
  { value: "gerente", label: "Gerente de Proyecto" },
  { value: "supervisor", label: "Supervisor de Obra" },
  { value: "trabajador", label: "Trabajador" },
  { value: "cliente", label: "Cliente" },
  { value: "super_admin", label: "Super Administrador", superAdminOnly: true },
]

export default function UsersClient() {
  const { toast } = useToast()
  const { user: currentUser, can, isSuperAdmin } = usePermissions()
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [editUser, setEditUser] = useState<UserRow | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [editForm, setEditForm] = useState({
    name: "",
    lastName: "",
    phone: "",
    role: "trabajador" as UserRole,
    password: "",
  })

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (roleFilter && roleFilter !== "all") params.append("role", roleFilter)
      if (search.trim()) params.append("search", search.trim())

      const response = await fetch(`/api/users?${params}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al cargar usuarios")
      }

      const rows = (data.users || []).map((u: UserRow & { _id?: string | { toString(): string } }) => ({
        ...u,
        _id: typeof u._id === "string" ? u._id : u._id != null ? String(u._id) : "",
      }))
      setUsers(rows)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudieron cargar los usuarios",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [roleFilter, search, toast])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const patchUser = async (id: string, payload: Record<string, unknown>, successMessage: string) => {
    const response = await fetch(`/api/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || "Error al actualizar")
    toast({ title: "Listo", description: successMessage })
    fetchUsers()
  }

  const openEdit = (user: UserRow) => {
    setEditUser(user)
    setEditForm({
      name: user.name || "",
      lastName: user.lastName || "",
      phone: user.phone || "",
      role: user.role,
      password: "",
    })
  }

  const handleSaveEdit = async () => {
    if (!editUser) return
    setSaving(true)
    try {
      const payload: Record<string, unknown> = {
        name: editForm.name,
        lastName: editForm.lastName,
        phone: editForm.phone,
        role: editForm.role,
      }
      if (editForm.password.trim()) payload.password = editForm.password
      await patchUser(editUser._id, payload, "Usuario actualizado correctamente")
      setEditUser(null)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo guardar",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = async (user: UserRow) => {
    try {
      await patchUser(
        user._id,
        { isActive: !user.isActive },
        user.isActive ? "Usuario suspendido" : "Usuario reactivado",
      )
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo cambiar el estado",
        variant: "destructive",
      })
    }
  }

  const handleApprove = async (user: UserRow) => {
    try {
      await patchUser(user._id, { emailVerified: true, isActive: true }, "Usuario aprobado y activado")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo aprobar",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      const response = await fetch(`/api/users/${deleteId}`, { method: "DELETE" })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Error al eliminar")
      toast({ title: "Usuario eliminado", description: "Se eliminó del sistema" })
      fetchUsers()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo eliminar",
        variant: "destructive",
      })
    } finally {
      setDeleteId(null)
    }
  }

  const canEdit = can("users.edit")
  const canDelete = can("users.delete")
  const isSelf = (id: string) => currentUser?._id === id

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        badge="Administración"
        title="Usuarios"
        description="Gestiona cuentas, roles, acceso y aprobaciones del equipo."
        actions={
          can("users.create") ? (
            <DashboardPrimaryButton asChild>
              <Link href="/dashboard/usuarios/nuevo">
                <UserPlus className="w-4 h-4 mr-2" />
                Nuevo Usuario
              </Link>
            </DashboardPrimaryButton>
          ) : undefined
        }
      />

      <Card>
        <CardContent className="p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              fetchUsers()
            }}
            className="flex flex-col md:flex-row gap-4"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="search"
                placeholder="Buscar por nombre o email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los roles</SelectItem>
                {ROLE_OPTIONS.filter((r) => !r.superAdminOnly || isSuperAdmin).map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit">Buscar</Button>
          </form>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      ) : users.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No hay usuarios</h3>
            <p className="text-slate-600">Comienza agregando usuarios al sistema</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => {
            const showActions = canEdit || canDelete
            const self = isSelf(user._id)

            return (
              <Card key={user._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-lg font-semibold shrink-0">
                      {getUserInitials(user.name, user.lastName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-slate-900 truncate">
                          {user.name} {user.lastName}
                        </h3>
                        {showActions && !self && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Gestionar usuario</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {canEdit && (
                                <>
                                  <DropdownMenuItem onClick={() => openEdit(user)}>
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleToggleActive(user)}>
                                    {user.isActive ? (
                                      <>
                                        <UserX className="h-4 w-4 mr-2" />
                                        Suspender
                                      </>
                                    ) : (
                                      <>
                                        <UserCheck className="h-4 w-4 mr-2" />
                                        Reactivar
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                  {!user.emailVerified && (
                                    <DropdownMenuItem onClick={() => handleApprove(user)}>
                                      <ShieldCheck className="h-4 w-4 mr-2" />
                                      Aprobar acceso
                                    </DropdownMenuItem>
                                  )}
                                </>
                              )}
                              {canEdit && canDelete && <DropdownMenuSeparator />}
                              {canDelete && user.role !== "super_admin" && (
                                <DropdownMenuItem
                                  className="text-red-600 focus:text-red-600"
                                  onClick={() => setDeleteId(user._id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Eliminar
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                      <Badge className={`${ROLE_COLORS[user.role] || "bg-slate-500"} mt-1`}>
                        {ROLE_LABELS[user.role] || user.role}
                      </Badge>
                      <div className="mt-3 space-y-1 text-sm text-slate-500">
                        <div className="flex items-center gap-2 truncate">
                          <Mail className="w-4 h-4 shrink-0" />
                          <span className="truncate">{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 shrink-0" />
                            <span>{user.phone}</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge variant={user.isActive ? "default" : "secondary"}>
                          {user.isActive ? "Activo" : "Suspendido"}
                        </Badge>
                        <Badge variant={user.emailVerified ? "outline" : "destructive"}>
                          {user.emailVerified ? "Verificado" : "Pendiente"}
                        </Badge>
                        {self && (
                          <Badge variant="outline" className="text-xs">
                            Tu cuenta
                          </Badge>
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

      <Dialog open={!!editUser} onOpenChange={(open) => !open && setEditUser(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar usuario</DialogTitle>
            <DialogDescription>Actualiza datos, rol o contraseña temporal</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input value={editForm.name} onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Apellido</Label>
                <Input
                  value={editForm.lastName}
                  onChange={(e) => setEditForm((p) => ({ ...p, lastName: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Teléfono</Label>
              <Input value={editForm.phone} onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Rol</Label>
              <Select
                value={editForm.role}
                onValueChange={(value: UserRole) => setEditForm((p) => ({ ...p, role: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.filter((r) => !r.superAdminOnly || isSuperAdmin).map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Nueva contraseña (opcional)</Label>
              <Input
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={editForm.password}
                onChange={(e) => setEditForm((p) => ({ ...p, password: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUser(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El usuario perderá el acceso al sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}