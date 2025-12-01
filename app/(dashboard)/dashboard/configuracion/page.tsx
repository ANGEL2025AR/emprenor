"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Bell, Shield, Palette, Building2, Save, Loader2 } from "lucide-react"

export default function ConfigurationPage() {
  const [saving, setSaving] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    taskAssigned: true,
    projectUpdates: true,
    paymentAlerts: true,
  })

  const handleSave = async () => {
    setSaving(true)
    // Simular guardado
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Configuración</h1>
        <p className="text-slate-600">Personaliza tu experiencia en la plataforma</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="general" className="gap-2">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notificaciones</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Seguridad</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="w-4 h-4" />
            <span className="hidden sm:inline">Apariencia</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Información de la Empresa
              </CardTitle>
              <CardDescription>Configura los datos de tu empresa</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nombre de la Empresa</Label>
                  <Input id="companyName" defaultValue="EMPRENOR Construcciones" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cuit">CUIT</Label>
                  <Input id="cuit" defaultValue="30-12345678-9" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email de Contacto</Label>
                  <Input id="email" type="email" defaultValue="info@emprenor.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" defaultValue="+54 9 11 2758-6521" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Input id="address" defaultValue="Salta Capital, Argentina" />
              </div>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Guardar Cambios
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Preferencias de Notificaciones
              </CardTitle>
              <CardDescription>Elige cómo y cuándo recibir notificaciones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium text-slate-900">Canales de Notificación</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notif">Notificaciones por Email</Label>
                      <p className="text-sm text-slate-500">Recibe actualizaciones por correo electrónico</p>
                    </div>
                    <Switch
                      id="email-notif"
                      checked={notifications.email}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push-notif">Notificaciones Push</Label>
                      <p className="text-sm text-slate-500">Recibe alertas en tu navegador</p>
                    </div>
                    <Switch
                      id="push-notif"
                      checked={notifications.push}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-slate-900">Tipos de Notificaciones</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="task-notif">Tareas Asignadas</Label>
                      <p className="text-sm text-slate-500">Cuando te asignen una nueva tarea</p>
                    </div>
                    <Switch
                      id="task-notif"
                      checked={notifications.taskAssigned}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, taskAssigned: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="project-notif">Actualizaciones de Proyectos</Label>
                      <p className="text-sm text-slate-500">Cambios importantes en tus proyectos</p>
                    </div>
                    <Switch
                      id="project-notif"
                      checked={notifications.projectUpdates}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, projectUpdates: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="payment-notif">Alertas de Pagos</Label>
                      <p className="text-sm text-slate-500">Pagos pendientes y vencimientos</p>
                    </div>
                    <Switch
                      id="payment-notif"
                      checked={notifications.paymentAlerts}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, paymentAlerts: checked })}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Guardar Preferencias
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Seguridad de la Cuenta
              </CardTitle>
              <CardDescription>Gestiona la seguridad de tu cuenta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium text-slate-900">Cambiar Contraseña</h4>
                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Contraseña Actual</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nueva Contraseña</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar Nueva Contraseña</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  <Button>Actualizar Contraseña</Button>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-medium text-slate-900">Sesiones Activas</h4>
                <p className="text-sm text-slate-500">
                  Gestiona las sesiones activas de tu cuenta en diferentes dispositivos.
                </p>
                <Button variant="outline">Ver Sesiones Activas</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Apariencia
              </CardTitle>
              <CardDescription>Personaliza la apariencia de la plataforma</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium text-slate-900">Tema</h4>
                <div className="grid grid-cols-3 gap-4 max-w-md">
                  <button className="p-4 border-2 border-green-500 rounded-lg bg-white text-center">
                    <div className="w-8 h-8 mx-auto bg-slate-100 rounded-full mb-2" />
                    <span className="text-sm font-medium">Claro</span>
                  </button>
                  <button className="p-4 border rounded-lg bg-slate-900 text-white text-center">
                    <div className="w-8 h-8 mx-auto bg-slate-700 rounded-full mb-2" />
                    <span className="text-sm font-medium">Oscuro</span>
                  </button>
                  <button className="p-4 border rounded-lg text-center">
                    <div className="w-8 h-8 mx-auto bg-gradient-to-r from-white to-slate-900 rounded-full mb-2" />
                    <span className="text-sm font-medium">Sistema</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-medium text-slate-900">Densidad de la Interfaz</h4>
                <div className="flex gap-4">
                  <Button variant="outline" size="sm">
                    Compacta
                  </Button>
                  <Button variant="default" size="sm">
                    Normal
                  </Button>
                  <Button variant="outline" size="sm">
                    Espaciada
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
