"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Camera, Save, Loader2, Mail, Phone, Calendar, Briefcase } from "lucide-react"

interface UserProfile {
  name: string
  lastName: string
  email: string
  phone: string
  role: string
  bio: string
}

export default function ProfilePage() {
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    bio: "",
  })
  const [stats, setStats] = useState({
    projects: 0,
    tasks: 0,
    documents: 0,
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          const data = await response.json()
          setProfile({
            name: data.user.name || "",
            lastName: data.user.lastName || "",
            email: data.user.email || "",
            phone: data.user.phone || "",
            role: data.user.role || "cliente",
            bio: data.user.bio || "",
          })
        }

        // Fetch stats
        const [projectsRes, tasksRes] = await Promise.all([
          fetch("/api/projects?limit=1000"),
          fetch("/api/tasks?limit=1000"),
        ])

        if (projectsRes.ok) {
          const projectsData = await projectsRes.json()
          setStats((prev) => ({ ...prev, projects: projectsData.projects?.length || 0 }))
        }
        if (tasksRes.ok) {
          const tasksData = await tasksRes.json()
          const completedTasks =
            tasksData.tasks?.filter((t: { status: string }) => t.status === "completada").length || 0
          setStats((prev) => ({ ...prev, tasks: completedTasks }))
        }
      } catch {
        // Error silencioso
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      // Aquí iría la lógica para guardar el perfil
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } catch {
      // Error silencioso
    } finally {
      setSaving(false)
    }
  }

  const roleLabels: Record<string, string> = {
    super_admin: "Super Administrador",
    admin: "Administrador",
    gerente: "Gerente",
    supervisor: "Supervisor",
    trabajador: "Trabajador",
    cliente: "Cliente",
  }

  const getUserInitials = () => {
    const firstInitial = profile.name && profile.name.length > 0 ? profile.name.charAt(0).toUpperCase() : "U"
    const lastInitial = profile.lastName && profile.lastName.length > 0 ? profile.lastName.charAt(0).toUpperCase() : ""
    return firstInitial + lastInitial
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Mi Perfil</h1>
        <p className="text-slate-600">Gestiona tu información personal</p>
      </div>

      {/* Avatar y info básica */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <Avatar className="w-32 h-32">
                <AvatarFallback className="text-3xl bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors">
                <Camera className="w-5 h-5" />
              </button>
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-slate-900">
                {profile.name} {profile.lastName}
              </h2>
              <p className="text-slate-600">{roleLabels[profile.role] || profile.role}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3 text-sm text-slate-500">
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {profile.email}
                </div>
                {profile.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {profile.phone}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información personal */}
      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
          <CardDescription>Actualiza tu información de contacto</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Apellido</Label>
              <Input
                id="lastName"
                value={profile.lastName}
                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={profile.email} disabled className="bg-slate-50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Biografía</Label>
            <Textarea
              id="bio"
              rows={4}
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              placeholder="Cuéntanos sobre ti..."
            />
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Guardar Cambios
          </Button>
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <Card>
        <CardHeader>
          <CardTitle>Mi Actividad</CardTitle>
          <CardDescription>Resumen de tu actividad en la plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg text-center">
              <Briefcase className="w-8 h-8 mx-auto text-blue-500 mb-2" />
              <p className="text-2xl font-bold text-slate-900">{stats.projects}</p>
              <p className="text-sm text-slate-600">Proyectos</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg text-center">
              <Calendar className="w-8 h-8 mx-auto text-green-500 mb-2" />
              <p className="text-2xl font-bold text-slate-900">{stats.tasks}</p>
              <p className="text-sm text-slate-600">Tareas completadas</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg text-center">
              <Mail className="w-8 h-8 mx-auto text-amber-500 mb-2" />
              <p className="text-2xl font-bold text-slate-900">{stats.documents}</p>
              <p className="text-sm text-slate-600">Documentos subidos</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
