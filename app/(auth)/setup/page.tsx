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
  const [step, setStep] = useState<"form" | "complete">("form")
  const [secretKey, setSecretKey] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
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
          secretKey,
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
            title: "Configuración completada",
            description: "Administrador creado. Redirigiendo al panel...",
          })
          setTimeout(() => router.push("/dashboard"), 2000)
        } else {
          toast({
            title: "Usuario creado",
            description: "Inicia sesión con las credenciales que definiste.",
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
    } catch {
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
            <CardTitle>Configuración completada</CardTitle>
            <CardDescription>El sistema está listo. Redirigiendo al panel...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Configuración inicial — EMPRENOR</CardTitle>
          <CardDescription>
            Solo para el primer administrador. Usa la clave definida en ADMIN_SETUP_KEY del servidor.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="secretKey">Clave de configuración *</Label>
            <Input
              id="secretKey"
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Apellido *</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña *</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <p className="text-xs text-slate-500">Mínimo 10 caracteres, mayúsculas, minúsculas y números</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <Button onClick={handleSetup} className="w-full" disabled={loading || !secretKey}>
            {loading ? "Creando..." : "Crear administrador"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
