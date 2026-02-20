"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import {
  PERMISSION_CATEGORIES,
  PERMISSION_ACTION_LABELS,
  ROLE_LABELS,
  ROLE_DESCRIPTIONS,
  ROLE_COLORS,
  ROLE_HIERARCHY,
  DEFAULT_PERMISSIONS,
} from "@/lib/auth/permissions"
import { USER_ROLES, type UserRole } from "@/lib/db/models"
import {
  Shield,
  Save,
  RotateCcw,
  Loader2,
  ChevronDown,
  ChevronRight,
  Info,
  AlertTriangle,
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type PermissionsMap = Record<string, string[]>

export function RolesAdminClient() {
  const [permissions, setPermissions] = useState<PermissionsMap>({})
  const [originalPermissions, setOriginalPermissions] = useState<PermissionsMap>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [lastUpdated, setLastUpdated] = useState<{ by: string; at: string } | null>(null)
  const { toast } = useToast()

  const fetchPermissions = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/roles")
      if (!res.ok) throw new Error("Error al cargar permisos")
      const data = await res.json()
      setPermissions(data.permissions)
      setOriginalPermissions(data.permissions)
      if (data.lastUpdatedBy) {
        setLastUpdated({
          by: data.lastUpdatedBy.name,
          at: data.lastUpdatedAt,
        })
      }
    } catch {
      toast({ title: "Error", description: "No se pudieron cargar los permisos", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => { fetchPermissions() }, [fetchPermissions])

  const togglePermission = (permission: string, role: string) => {
    // No permitir quitar permisos admin a super_admin
    if (role === "super_admin" && permission.startsWith("admin.")) return

    setPermissions((prev) => {
      const current = prev[permission] || []
      const updated = current.includes(role)
        ? current.filter((r) => r !== role)
        : [...current, role]
      return { ...prev, [permission]: updated }
    })
  }

  const toggleCategoryForRole = (categoryKey: string, role: string) => {
    const category = PERMISSION_CATEGORIES[categoryKey]
    if (!category) return

    const allEnabled = category.permissions.every((p) => permissions[p]?.includes(role))
    setPermissions((prev) => {
      const updated = { ...prev }
      for (const perm of category.permissions) {
        if (role === "super_admin" && perm.startsWith("admin.")) continue
        const current = updated[perm] || []
        if (allEnabled) {
          updated[perm] = current.filter((r) => r !== role)
        } else {
          if (!current.includes(role)) {
            updated[perm] = [...current, role]
          }
        }
      }
      return updated
    })
  }

  const toggleAllForRole = (role: string, enable: boolean) => {
    setPermissions((prev) => {
      const updated = { ...prev }
      for (const perm of Object.keys(updated)) {
        if (role === "super_admin" && perm.startsWith("admin.")) continue
        if (enable) {
          if (!updated[perm].includes(role)) {
            updated[perm] = [...updated[perm], role]
          }
        } else {
          updated[perm] = updated[perm].filter((r) => r !== role)
        }
      }
      return updated
    })
  }

  const hasChanges = JSON.stringify(permissions) !== JSON.stringify(originalPermissions)

  const savePermissions = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/admin/roles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permissions }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Error al guardar")
      }
      setOriginalPermissions(permissions)
      toast({ title: "Permisos guardados", description: "Los cambios se aplicarán inmediatamente." })
      fetchPermissions()
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "No se pudieron guardar los permisos",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const resetToDefaults = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/admin/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      })
      if (!res.ok) throw new Error("Error al restaurar")
      setPermissions({ ...DEFAULT_PERMISSIONS })
      setOriginalPermissions({ ...DEFAULT_PERMISSIONS })
      setLastUpdated(null)
      toast({ title: "Permisos restaurados", description: "Se han restaurado los permisos por defecto." })
    } catch {
      toast({ title: "Error", description: "No se pudieron restaurar los permisos", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const toggleCategory = (key: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    )
  }

  const roles = USER_ROLES.filter((r) => r !== "super_admin")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-7 h-7 text-emerald-600" />
            Gestión de Roles y Permisos
          </h1>
          <p className="text-slate-500 mt-1">
            Configura los permisos de cada rol del sistema. Los cambios se aplican inmediatamente.
          </p>
          {lastUpdated && (
            <p className="text-xs text-slate-400 mt-1">
              Última modificación por {lastUpdated.by} el{" "}
              {new Date(lastUpdated.at).toLocaleDateString("es-ES", {
                day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
              })}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" disabled={saving}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Restaurar defecto
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Restaurar permisos por defecto</AlertDialogTitle>
                <AlertDialogDescription>
                  Esto eliminará todas las personalizaciones y restaurará los permisos originales del sistema. Esta acción no se puede deshacer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={resetToDefaults}>Restaurar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button onClick={savePermissions} disabled={saving || !hasChanges} size="sm">
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Guardar cambios
          </Button>
        </div>
      </div>

      {hasChanges && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2 text-sm text-amber-800">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          Tienes cambios sin guardar. Haz clic en &quot;Guardar cambios&quot; para aplicarlos.
        </div>
      )}

      {/* Resumen de roles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((role) => {
          const permCount = Object.values(permissions).filter((r) => r.includes(role)).length
          const totalPerms = Object.keys(permissions).length
          return (
            <Card
              key={role}
              className={`cursor-pointer transition-all hover:shadow-md ${selectedRole === role ? "ring-2 ring-emerald-500 shadow-md" : ""}`}
              onClick={() => setSelectedRole(selectedRole === role ? null : role)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={ROLE_COLORS[role]} variant="secondary">
                        {ROLE_LABELS[role]}
                      </Badge>
                      <span className="text-xs text-slate-400">Nivel {ROLE_HIERARCHY[role]}</span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2">{ROLE_DESCRIPTIONS[role]}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900">{permCount}</p>
                    <p className="text-xs text-slate-400">de {totalPerms}</p>
                  </div>
                </div>
                <div className="mt-3 bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full transition-all"
                    style={{ width: `${(permCount / totalPerms) * 100}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Nota sobre super_admin */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start gap-2 text-sm text-blue-800">
        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>
          El rol <strong>Super Administrador</strong> siempre tiene acceso total al sistema. Los permisos de administración no pueden ser removidos de este rol.
        </span>
      </div>

      {/* Tabla de permisos por categoría */}
      <Card>
        <CardHeader>
          <CardTitle>Matriz de Permisos</CardTitle>
          <CardDescription>
            {selectedRole
              ? `Mostrando permisos de: ${ROLE_LABELS[selectedRole]}`
              : "Selecciona un rol arriba para filtrar, o edita directamente la matriz completa"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left p-3 text-sm font-semibold text-slate-700 min-w-[200px]">Permiso</th>
                  {(selectedRole ? [selectedRole] : roles).map((role) => (
                    <th key={role} className="p-3 text-center min-w-[100px]">
                      <div className="flex flex-col items-center gap-1">
                        <Badge className={`${ROLE_COLORS[role]} text-[10px]`} variant="secondary">
                          {ROLE_LABELS[role].split(" ")[0]}
                        </Badge>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(PERMISSION_CATEGORIES).map(([catKey, category]) => {
                  const isExpanded = expandedCategories.has(catKey)
                  return (
                    <CategoryRow
                      key={catKey}
                      catKey={catKey}
                      category={category}
                      isExpanded={isExpanded}
                      onToggle={() => toggleCategory(catKey)}
                      roles={selectedRole ? [selectedRole] : roles}
                      permissions={permissions}
                      onTogglePermission={togglePermission}
                      onToggleCategory={toggleCategoryForRole}
                    />
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Acciones rápidas por rol */}
      {selectedRole && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Acciones rápidas para {ROLE_LABELS[selectedRole]}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => toggleAllForRole(selectedRole, true)}>
              Activar todos
            </Button>
            <Button variant="outline" size="sm" onClick={() => toggleAllForRole(selectedRole, false)}>
              Desactivar todos
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setSelectedRole(null)}>
              Deseleccionar rol
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Componente de fila de categoría colapsable
function CategoryRow({
  catKey,
  category,
  isExpanded,
  onToggle,
  roles,
  permissions,
  onTogglePermission,
  onToggleCategory,
}: {
  catKey: string
  category: { label: string; permissions: string[] }
  isExpanded: boolean
  onToggle: () => void
  roles: UserRole[]
  permissions: PermissionsMap
  onTogglePermission: (permission: string, role: string) => void
  onToggleCategory: (catKey: string, role: string) => void
}) {
  return (
    <>
      {/* Fila de categoría */}
      <tr
        className="bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors border-b border-slate-100"
        onClick={onToggle}
      >
        <td className="p-3">
          <div className="flex items-center gap-2 font-semibold text-sm text-slate-800">
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            {category.label}
            <span className="text-xs font-normal text-slate-400">({category.permissions.length})</span>
          </div>
        </td>
        {roles.map((role) => {
          const allEnabled = category.permissions.every((p) => permissions[p]?.includes(role))
          const someEnabled = category.permissions.some((p) => permissions[p]?.includes(role))
          return (
            <td key={role} className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
              <Checkbox
                checked={allEnabled}
                data-state={someEnabled && !allEnabled ? "indeterminate" : undefined}
                className={someEnabled && !allEnabled ? "opacity-60" : ""}
                onCheckedChange={() => onToggleCategory(catKey, role)}
              />
            </td>
          )
        })}
      </tr>

      {/* Filas de permisos individuales */}
      {isExpanded &&
        category.permissions.map((perm) => {
          const action = perm.split(".")[1]
          return (
            <tr key={perm} className="border-b border-slate-50 hover:bg-slate-50/50">
              <td className="p-3 pl-10">
                <span className="text-sm text-slate-600">
                  {PERMISSION_ACTION_LABELS[action] || action}
                </span>
                <span className="text-xs text-slate-400 ml-2">({perm})</span>
              </td>
              {roles.map((role) => {
                const isEnabled = permissions[perm]?.includes(role) ?? false
                const isProtected = role === "super_admin" && perm.startsWith("admin.")
                return (
                  <td key={role} className="p-3 text-center">
                    <Checkbox
                      checked={isEnabled}
                      disabled={isProtected}
                      onCheckedChange={() => onTogglePermission(perm, role)}
                      className={isProtected ? "opacity-40" : ""}
                    />
                  </td>
                )
              })}
            </tr>
          )
        })}
    </>
  )
}
