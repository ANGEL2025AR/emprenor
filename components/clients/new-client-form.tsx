"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, ArrowLeft, Eye, EyeOff, Loader2, Save } from "lucide-react"
import {
  PUBLIC_REGISTRATION_TYPE_OPTIONS,
  getPublicRegistrationTypeOption,
  showsCuitField,
  type PublicClientType,
} from "@/lib/clients/public-registration-types"
import { cn } from "@/lib/utils"

export default function NewClientForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    publicClientType: "persona" as PublicClientType,
    contactName: "",
    contactLastName: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    city: "",
    province: "",
    cuit: "",
    taxCondition: "consumidor_final",
    status: "activo",
    notes: "",
    portalAccess: {
      enabled: true,
      password: "",
      confirmPassword: "",
      isActive: true,
    },
  })

  const selectedType = getPublicRegistrationTypeOption(formData.publicClientType)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Error al crear cliente")
        return
      }

      router.push(`/dashboard/clientes/${data.client._id}`)
      router.refresh()
    } catch {
      setError("Error de conexión")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error ? (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Tipo de cliente</CardTitle>
          <CardDescription>
            Elegí el perfil para adaptar los datos y el cumplimiento de obra del portal.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {PUBLIC_REGISTRATION_TYPE_OPTIONS.map((opt) => {
              const selected = formData.publicClientType === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      publicClientType: opt.value,
                      company: opt.value === "persona" ? "" : prev.company,
                    }))
                  }
                  className={cn(
                    "rounded-lg border p-3 text-left text-sm transition-all",
                    selected
                      ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/20"
                      : "border-slate-200 hover:border-emerald-300",
                  )}
                >
                  <p className="font-medium text-slate-900">{opt.shortLabel}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{opt.examples}</p>
                </button>
              )
            })}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">{selectedType.description}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contacto principal</CardTitle>
          <CardDescription>Persona que accederá al portal con email y contraseña.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactName">Nombre *</Label>
              <Input
                id="contactName"
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactLastName">Apellido *</Label>
              <Input
                id="contactLastName"
                value={formData.contactLastName}
                onChange={(e) => setFormData({ ...formData, contactLastName: e.target.value })}
                required
              />
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email (usuario de acceso) *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dirección</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Dirección *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Ciudad *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="province">Provincia *</Label>
              <Input
                id="province"
                value={formData.province}
                onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Información fiscal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {showsCuitField(formData.publicClientType) ? (
              <div className="space-y-2">
                <Label htmlFor="cuit">CUIT/CUIL</Label>
                <Input
                  id="cuit"
                  value={formData.cuit}
                  onChange={(e) => setFormData({ ...formData, cuit: e.target.value })}
                  placeholder="20-12345678-9"
                />
              </div>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="taxCondition">Condición fiscal *</Label>
              <Select
                value={formData.taxCondition}
                onValueChange={(value) => setFormData({ ...formData, taxCondition: value })}
              >
                <SelectTrigger id="taxCondition">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consumidor_final">Consumidor final</SelectItem>
                  <SelectItem value="responsable_inscripto">Responsable inscripto</SelectItem>
                  <SelectItem value="monotributo">Monotributo</SelectItem>
                  <SelectItem value="exento">Exento</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Acceso al portal del cliente</CardTitle>
          <CardDescription>
            Creá usuario y contraseña para que el cliente ingrese al dashboard y vea sus obras.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 rounded-lg border p-4">
            <Checkbox
              id="portalEnabled"
              checked={formData.portalAccess.enabled}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  portalAccess: { ...formData.portalAccess, enabled: checked === true },
                })
              }
            />
            <div className="space-y-1">
              <Label htmlFor="portalEnabled" className="cursor-pointer font-medium">
                Crear usuario portal con contraseña
              </Label>
              <p className="text-xs text-muted-foreground">
                El cliente podrá ingresar con su email y la clave que definas aquí.
              </p>
            </div>
          </div>

          {formData.portalAccess.enabled ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      minLength={8}
                      value={formData.portalAccess.password}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          portalAccess: { ...formData.portalAccess, password: e.target.value },
                        })
                      }
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar contraseña *</Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    minLength={8}
                    value={formData.portalAccess.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        portalAccess: { ...formData.portalAccess, confirmPassword: e.target.value },
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="portalActive"
                  checked={formData.portalAccess.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      portalAccess: { ...formData.portalAccess, isActive: checked === true },
                    })
                  }
                />
                <Label htmlFor="portalActive" className="cursor-pointer text-sm">
                  Activar acceso inmediatamente
                </Label>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Podés crear el acceso más tarde desde la ficha del cliente → Usuario portal.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Información adicional</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">Estado *</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prospecto">Prospecto</SelectItem>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="inactivo">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              placeholder="Información adicional sobre el cliente..."
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" asChild>
          <Link href="/dashboard/clientes">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Cancelar
          </Link>
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              {formData.portalAccess.enabled ? "Crear cliente y acceso" : "Guardar cliente"}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
