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
import { AlertCircle, Eye, EyeOff, Loader2, ArrowRight, Shield, Building2, CheckCircle } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Error al iniciar sesión")
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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-50 p-4">
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
            <h1 className="text-4xl font-bold text-slate-900 leading-tight">Sistema de Gestión de Construcción</h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Administra proyectos, equipos y recursos desde una plataforma profesional diseñada para la industria de la
              construcción.
            </p>
          </div>

          <div className="space-y-4 pt-8">
            {[
              { icon: Building2, text: "Gestión completa de proyectos y obras" },
              { icon: Shield, text: "Seguridad empresarial garantizada" },
              { icon: CheckCircle, text: "Control de costos y recursos en tiempo real" },
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
          {/* Borde superior decorativo */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-500" />

          <CardHeader className="text-center space-y-4 pb-6 pt-8">
            {/* Logo móvil */}
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
                Iniciar Sesión
              </CardTitle>
              <CardDescription className="text-slate-600 text-base">Ingresa a tu cuenta para continuar</CardDescription>
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
                  className="h-12 bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200"
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
                    placeholder="Tu contraseña segura"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="h-12 bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500/20 pr-12 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end pt-1">
                <Link
                  href="/recuperar-password"
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
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
                    Ingresando...
                  </>
                ) : (
                  <>
                    Ingresar al Sistema
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>

              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-500">o</span>
                </div>
              </div>

              <p className="text-center text-sm text-slate-600">
                ¿No tienes cuenta?{" "}
                <Link
                  href="/registro"
                  className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
                >
                  Crear una cuenta nueva
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
