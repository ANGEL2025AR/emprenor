"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle2 } from "lucide-react"

export default function SetupPage() {
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<"check" | "create" | "complete">("check")
  const [formData, setFormData] = useState({
    name: "Admin",
    lastName: "Sistema",
    email: "admin@emprenor.com",
    password: "Admin123!",
    phone: "+5491112345678",
  })
  const router = useRouter()
  const { toast } = useToast()

  const handleSetup = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          secretKey: "emprenor-setup-2024",
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const loginResponse = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        })

        if (loginResponse.ok) {
          setStep("complete")
          toast({
            title: "Setup completado",
            description: "Usuario administrador creado exitosamente. Redirigiendo al dashboard...",
          })
          setTimeout(() => router.push("/dashboard"), 2000)
        } else {
          toast({
            title: "Usuario creado",
            description: "Por favor inicia sesión manualmente",
          })
          setTimeout(() => router.push("/login"), 2000)
        }
      } else {
        toast({
          title: "Error",
          description: data.error || "Error al crear el usuario",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al conectar con el servidor",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (step === "complete") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <CardTitle>¡Setup Completado!</CardTitle>
            <CardDescription>El sistema está listo para usar. Serás redirigido al dashboard...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Configuración Inicial - EMPRENOR</CardTitle>
          <CardDescription>Crea el usuario administrador del sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Apellido</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <p className="text-xs text-slate-500">Mínimo 8 caracteres, incluye mayúsculas, minúsculas y números</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <Button onClick={handleSetup} className="w-full" disabled={loading}>
            {loading ? "Creando..." : "Crear Usuario Administrador"}
          </Button>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
            <p className="font-medium text-blue-900 mb-1">Credenciales por defecto:</p>
            <p className="text-blue-700">Email: admin@emprenor.com</p>
            <p className="text-blue-700">Contraseña: Admin123!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
