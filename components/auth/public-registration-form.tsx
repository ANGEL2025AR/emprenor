"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Shield,
  Building2,
  User,
  Users,
  Landmark,
  Home,
  Globe,
  HelpCircle,
  MessageSquare,
  FileText,
  HardHat,
} from "lucide-react"
import { LOGO_LIGHT } from "@/lib/brand/logo"
import {
  PUBLIC_REGISTRATION_TYPE_OPTIONS,
  REGISTRATION_INTENT_OPTIONS,
  getPublicRegistrationTypeOption,
  showsCuitField,
  type PublicClientType,
  type RegistrationIntent,
} from "@/lib/clients/public-registration-types"
import { cn } from "@/lib/utils"

const TYPE_ICONS: Record<PublicClientType, React.ComponentType<{ className?: string }>> = {
  persona: User,
  empresa: Building2,
  cooperativa: Users,
  gobierno: Landmark,
  consorcio: Building2,
  barrio_privado: Home,
  inmobiliaria: Building2,
  organismo_internacional: Globe,
  otro: HelpCircle,
}

const INTENT_ICONS: Record<RegistrationIntent, React.ComponentType<{ className?: string }>> = {
  consulta: MessageSquare,
  cotizacion: FileText,
  seguimiento_obra: HardHat,
}

type Step = "intent" | "type" | "details"

export function PublicRegistrationForm() {
  const router = useRouter()
  const [step, setStep] = useState<Step>("intent")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    registrationIntent: "consulta" as RegistrationIntent,
    publicClientType: "" as PublicClientType | "",
    name: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    cuit: "",
    address: "",
    city: "",
    province: "",
    message: "",
    password: "",
    confirmPassword: "",
  })

  const selectedType = formData.publicClientType
    ? getPublicRegistrationTypeOption(formData.publicClientType)
    : null

  const passwordRequirements = [
    { text: "Mínimo 8 caracteres", met: formData.password.length >= 8 },
    { text: "Una mayúscula", met: /[A-Z]/.test(formData.password) },
    { text: "Un número", met: /[0-9]/.test(formData.password) },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.publicClientType) return

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

      const params = new URLSearchParams({
        registered: "pending",
        tipo: formData.publicClientType,
        motivo: formData.registrationIntent,
      })
      router.push(`/login?${params.toString()}`)
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

      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-start relative z-10">
        <div className="hidden lg:block space-y-8 px-8 sticky top-12">
          <div className="space-y-4">
            <Image
              src={LOGO_LIGHT.src}
              alt="EMPRENOR Logo"
              width={LOGO_LIGHT.width}
              height={LOGO_LIGHT.height}
              unoptimized
              className="h-12 w-auto"
              priority
            />
            <h1 className="text-4xl font-bold text-slate-900 leading-tight">Registrate en EMPRENOR</h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Creá tu cuenta según tu perfil — particular, empresa, gobierno, consorcio o barrio privado — para
              consultas, cotizaciones y seguimiento de obra.
            </p>
          </div>

          <div className="space-y-4 pt-4">
            {[
              { icon: MessageSquare, text: "Consultas y presupuestos sin llamadas innecesarias" },
              { icon: HardHat, text: "Portal de seguimiento de obra para clientes activos" },
              { icon: Shield, text: "Cuenta revisada por EMPRENOR antes de activarse" },
            ].map((feature, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-slate-700 font-medium pt-2">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>

        <Card className="w-full max-w-2xl mx-auto border-0 shadow-2xl shadow-slate-900/10 bg-white/80 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-500" />

          <CardHeader className="text-center space-y-3 pb-4 pt-8">
            <div className="lg:hidden flex justify-center">
              <Image
                src={LOGO_LIGHT.src}
                alt="EMPRENOR Logo"
                width={LOGO_LIGHT.width}
                height={LOGO_LIGHT.height}
                unoptimized
                className="h-10 w-auto"
                priority
              />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-green-700 bg-clip-text text-transparent">
              {step === "intent" && "¿Qué necesitás?"}
              {step === "type" && "¿Quién sos?"}
              {step === "details" && "Tus datos"}
            </CardTitle>
            <CardDescription className="text-slate-600">
              {step === "intent" && "Elegí el motivo del registro"}
              {step === "type" && "Seleccioná el tipo de cliente para adaptar el formulario"}
              {step === "details" && selectedType?.label}
            </CardDescription>
            <div className="flex justify-center gap-2 pt-1">
              {(["intent", "type", "details"] as Step[]).map((s, i) => (
                <div
                  key={s}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    step === s ? "w-8 bg-emerald-600" : i < ["intent", "type", "details"].indexOf(step) ? "w-2 bg-emerald-400" : "w-2 bg-slate-200",
                  )}
                />
              ))}
            </div>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5 px-6 sm:px-8">
              {error ? (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{error}</span>
                </div>
              ) : null}

              {step === "intent" ? (
                <div className="grid gap-3">
                  {REGISTRATION_INTENT_OPTIONS.map((opt) => {
                    const Icon = INTENT_ICONS[opt.value]
                    const selected = formData.registrationIntent === opt.value
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, registrationIntent: opt.value })}
                        className={cn(
                          "flex items-start gap-4 p-4 rounded-xl border text-left transition-all",
                          selected
                            ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/20"
                            : "border-slate-200 hover:border-emerald-300 hover:bg-slate-50",
                        )}
                      >
                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", selected ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600")}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{opt.label}</p>
                          <p className="text-sm text-slate-600">{opt.description}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              ) : null}

              {step === "type" ? (
                <div className="grid sm:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
                  {PUBLIC_REGISTRATION_TYPE_OPTIONS.map((opt) => {
                    const Icon = TYPE_ICONS[opt.value]
                    const selected = formData.publicClientType === opt.value
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, publicClientType: opt.value, company: opt.value === "persona" ? "" : formData.company })}
                        className={cn(
                          "flex flex-col items-start gap-2 p-4 rounded-xl border text-left transition-all h-full",
                          selected
                            ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/20"
                            : "border-slate-200 hover:border-emerald-300 hover:bg-slate-50",
                        )}
                      >
                        <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", selected ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600")}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <p className="font-semibold text-sm text-slate-900">{opt.label}</p>
                        <p className="text-xs text-slate-500 line-clamp-2">{opt.description}</p>
                      </button>
                    )
                  })}
                </div>
              ) : null}

              {step === "details" && selectedType ? (
                <div className="space-y-4">
                  <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-3 text-sm text-emerald-900">
                    <strong>Perfil detectado:</strong> {selectedType.label} — el sistema clasificará su cuenta como{" "}
                    <strong>{selectedType.shortLabel}</strong> para cotizaciones y cumplimiento de obra.
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre *</Label>
                      <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Apellido *</Label>
                      <Input id="lastName" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} required />
                    </div>
                  </div>

                  {formData.publicClientType !== "persona" ? (
                    <div className="space-y-2">
                      <Label htmlFor="company">{selectedType.organizationLabel} *</Label>
                      <Input
                        id="company"
                        placeholder={selectedType.organizationPlaceholder}
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        required
                      />
                    </div>
                  ) : null}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono *</Label>
                      <Input id="phone" type="tel" placeholder="+54 388 ..." value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
                    </div>
                  </div>

                  {formData.publicClientType && showsCuitField(formData.publicClientType) ? (
                    <div className="space-y-2">
                      <Label htmlFor="cuit">CUIT / CUIL (opcional)</Label>
                      <Input id="cuit" value={formData.cuit} onChange={(e) => setFormData({ ...formData, cuit: e.target.value })} placeholder="20-12345678-9" />
                    </div>
                  ) : null}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2 sm:col-span-3">
                      <Label htmlFor="address">Dirección</Label>
                      <Input id="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">Ciudad</Label>
                      <Input id="city" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="province">Provincia</Label>
                      <Input id="province" value={formData.province} onChange={(e) => setFormData({ ...formData, province: e.target.value })} placeholder="Jujuy" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">
                      {formData.registrationIntent === "cotizacion" ? "Detalle de la obra / cotización" : "Mensaje (opcional)"}
                    </Label>
                    <Textarea
                      id="message"
                      rows={3}
                      placeholder={
                        formData.registrationIntent === "cotizacion"
                          ? "Describa la obra, ubicación, plazos estimados..."
                          : "Consulta adicional para EMPRENOR"
                      }
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <div className="border-t pt-4 space-y-4">
                    <p className="text-sm font-medium text-slate-700">Credenciales de acceso</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="password">Contraseña *</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            className="pr-10"
                          />
                          <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmar *</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    {formData.password ? (
                      <div className="space-y-1">
                        {passwordRequirements.map((req, index) => (
                          <div key={index} className={cn("flex items-center gap-2 text-xs", req.met ? "text-emerald-600" : "text-slate-400")}>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {req.text}
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </CardContent>

            <CardFooter className="flex flex-col gap-4 px-6 sm:px-8 pb-8">
              <div className="flex gap-3 w-full">
                {step !== "intent" ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep(step === "details" ? "type" : "intent")}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Atrás
                  </Button>
                ) : null}

                {step === "intent" ? (
                  <Button type="button" className="flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={() => setStep("type")}>
                    Continuar
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : null}

                {step === "type" ? (
                  <Button
                    type="button"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    disabled={!formData.publicClientType}
                    onClick={() => setStep("details")}
                  >
                    Continuar
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : null}

                {step === "details" ? (
                  <Button type="submit" disabled={isLoading} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        Crear cuenta
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                ) : null}
              </div>

              <p className="text-center text-sm text-slate-600">
                ¿Ya tenés cuenta?{" "}
                <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                  Iniciá sesión
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
