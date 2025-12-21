"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Eye, EyeOff, Loader2, ArrowRight, CheckCircle2, Shield, Building2, Users } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  const passwordRequirements = [
    { text: "Mínimo 8 caracteres", met: formData.password.length >= 8 },
    { text: "Una mayúscula", met: /[A-Z]/.test(formData.password) },
    { text: "Un número", met: /[0-9]/.test(formData.password) },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Error al registrar")
        return
      }

      router.push("/dashboard")
      router.refresh()
    } catch {
      setError("Error de conexión. Intenta nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-50 p-4 py-12">
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] bg-[size:40px_40px]" />

      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-200/30 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-emerald-100/20 to-green-100/20 rounded-full blur-3xl" />

      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center relative z-10">
        <div className="hidden lg:block space-y-8 px-8">
          <div className="space-y-4">
            <Image
              src="/images/logo-emprenor.png"
              alt="EMPRENOR Logo"
              width={200}
              height={60}
              className="h-12 w-auto"
              priority
            />
            <h1 className="text-4xl font-bold text-slate-900 leading-tight">Únete a EMPRENOR</h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Crea tu cuenta y comienza a gestionar tus proyectos de construcción de manera profesional y eficiente.
            </p>
          </div>

          <div className="space-y-4 pt-8">
            {[
              { icon: Building2, text: "Gestión integral de obras y proyectos" },
              { icon: Users, text: "Colaboración en equipo en tiempo real" },
              { icon: Shield, text: "Datos seguros y respaldados" },
            ].map((feature, index) => (
              <div key={index} className="flex items-start gap-4 group">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all duration-300 group-hover:scale-110">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div className="pt-2">
                  <p className="text-slate-700 font-medium">{feature.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Card className="w-full max-w-md mx-auto border-0 shadow-2xl shadow-slate-900/10 bg-white/70 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-500" />

          <CardHeader className="text-center space-y-4 pb-6 pt-8">
            <div className="lg:hidden flex justify-center">
              <Image
                src="/images/logo-emprenor.png"
                alt="EMPRENOR Logo"
                width={180}
                height={54}
                className="h-10 w-auto"
                priority
              />
            </div>

            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-green-700 bg-clip-text text-transparent">
                Crear Cuenta
              </CardTitle>
              <CardDescription className="text-slate-600 text-base">Completa tus datos para comenzar</CardDescription>
            </div>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5 px-8">
              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-700 font-medium">
                    Nombre
                  </Label>
                  <Input
                    id="name"
                    placeholder="Juan"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="h-11 bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-slate-700 font-medium">
                    Apellido
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Pérez"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                    className="h-11 bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">
                  Correo Electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@empresa.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="h-11 bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-700 font-medium">
                  Teléfono
                  <span className="text-slate-400 font-normal ml-1">(opcional)</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+54 9 11 1234-5678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="h-11 bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 font-medium">
                  Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Contraseña segura"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="h-11 bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500/20 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {formData.password && (
                  <div className="space-y-2 pt-2">
                    {passwordRequirements.map((req, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-2 text-xs transition-colors ${
                          req.met ? "text-emerald-600" : "text-slate-400"
                        }`}
                      >
                        <CheckCircle2 className={`w-4 h-4 ${req.met ? "opacity-100" : "opacity-30"}`} />
                        {req.text}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-700 font-medium">
                  Confirmar Contraseña
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repite tu contraseña"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  className="h-11 bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500/20"
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-5 px-8 pb-8">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold text-base shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/40 transition-all duration-200 group"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creando cuenta...
                  </>
                ) : (
                  <>
                    Crear Mi Cuenta
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>

              <p className="text-center text-sm text-slate-600">
                ¿Ya tienes cuenta?{" "}
                <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors">
                  Inicia sesión aquí
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
