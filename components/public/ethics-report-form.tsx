"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Shield } from "lucide-react"

export function EthicsReportForm() {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")
  const [anonymous, setAnonymous] = useState(false)
  const [category, setCategory] = useState("conducta")
  const [message, setMessage] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/ethics-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          message,
          anonymous,
          name: anonymous ? undefined : name,
          email: anonymous ? undefined : email,
          phone: anonymous ? undefined : phone,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "No se pudo enviar el reporte")
        return
      }
      setDone(true)
      setMessage("")
    } catch {
      setError("Error de conexión. Intente nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center space-y-2">
        <Shield className="h-10 w-10 text-emerald-600 mx-auto" />
        <p className="font-semibold text-emerald-900">Reporte recibido</p>
        <p className="text-sm text-emerald-800">
          Referencia: se analizará con confidencialidad. Si dejó contacto, responderemos dentro del plazo corporativo.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border bg-card p-6 shadow-sm">
      <div className="space-y-2">
        <Label>Tipo de reporte</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="conducta">Conducta ética / acoso</SelectItem>
            <SelectItem value="corrupcion">Corrupción / soborno</SelectItem>
            <SelectItem value="seguridad">Seguridad y salud</SelectItem>
            <SelectItem value="medioambiente">Medio ambiente</SelectItem>
            <SelectItem value="otro">Otro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Descripción *</Label>
        <Textarea
          id="message"
          required
          minLength={20}
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describa los hechos con el mayor detalle posible (obra, fechas, personas involucradas si las conoce)."
        />
      </div>

      <div className="flex items-start gap-3">
        <Checkbox id="anon" checked={anonymous} onCheckedChange={(v) => setAnonymous(v === true)} />
        <Label htmlFor="anon" className="text-sm leading-snug cursor-pointer">
          Quiero reportar de forma anónima (no guardaremos nombre ni email)
        </Label>
      </div>

      {!anonymous && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="phone">Teléfono (opcional)</Label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
        </div>
      )}

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <Button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700">
        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Shield className="h-4 w-4 mr-2" />}
        Enviar reporte confidencial
      </Button>
    </form>
  )
}
