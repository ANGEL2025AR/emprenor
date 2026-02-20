"use client"

import type React from "react"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ClientData {
  _id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  province: string
  type: string
  cuit: string
  notes: string
  fiscalCondition: string
}

export default function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [client, setClient] = useState<Partial<ClientData>>({})

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await fetch(`/api/clients/${id}`)
        if (response.ok) {
          const data = await response.json()
          setClient(data)
        } else {
          router.push("/dashboard/clientes")
        }
      } catch {
        router.push("/dashboard/clientes")
      } finally {
        setLoading(false)
      }
    }
    fetchClient()
  }, [id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/clients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: client.name,
          email: client.email,
          phone: client.phone,
          address: client.address,
          city: client.city,
          province: client.province,
          type: client.type,
          cuit: client.cuit,
          notes: client.notes,
          fiscalCondition: client.fiscalCondition,
        }),
      })

      if (response.ok) {
        toast({
          title: "Cliente actualizado",
          description: "Los cambios se han guardado correctamente",
        })
        router.push(`/dashboard/clientes/${id}`)
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: "No se pudo actualizar el cliente",
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: "Error",
        description: "Error de conexion",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/clientes/${id}`}>
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Editar Cliente</h1>
          <p className="text-slate-600">{client.name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Datos Personales</CardTitle>
            <CardDescription>Informacion de contacto del cliente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo *</Label>
                <Input
                  id="name"
                  value={client.name || ""}
                  onChange={(e) => setClient({ ...client, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={client.email || ""}
                  onChange={(e) => setClient({ ...client, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefono *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={client.phone || ""}
                  onChange={(e) => setClient({ ...client, phone: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Cliente</Label>
                <Select
                  value={client.type || "particular"}
                  onValueChange={(value) => setClient({ ...client, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="particular">Particular</SelectItem>
                    <SelectItem value="empresa">Empresa</SelectItem>
                    <SelectItem value="gobierno">Gobierno</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Datos Fiscales y Ubicacion</CardTitle>
            <CardDescription>Informacion fiscal y domicilio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cuit">CUIT / CUIL</Label>
                <Input
                  id="cuit"
                  value={client.cuit || ""}
                  onChange={(e) => setClient({ ...client, cuit: e.target.value })}
                  placeholder="20-12345678-9"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fiscalCondition">Condicion Fiscal</Label>
                <Select
                  value={client.fiscalCondition || "consumidor_final"}
                  onValueChange={(value) => setClient({ ...client, fiscalCondition: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="responsable_inscripto">Responsable Inscripto</SelectItem>
                    <SelectItem value="monotributo">Monotributo</SelectItem>
                    <SelectItem value="exento">Exento</SelectItem>
                    <SelectItem value="consumidor_final">Consumidor Final</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Direccion</Label>
              <Input
                id="address"
                value={client.address || ""}
                onChange={(e) => setClient({ ...client, address: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Ciudad</Label>
                <Input
                  id="city"
                  value={client.city || ""}
                  onChange={(e) => setClient({ ...client, city: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="province">Provincia</Label>
                <Input
                  id="province"
                  value={client.province || ""}
                  onChange={(e) => setClient({ ...client, province: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notas</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={client.notes || ""}
              onChange={(e) => setClient({ ...client, notes: e.target.value })}
              placeholder="Observaciones adicionales sobre el cliente..."
              rows={4}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href={`/dashboard/clientes/${id}`}>Cancelar</Link>
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Guardar Cambios
          </Button>
        </div>
      </form>
    </div>
  )
}
