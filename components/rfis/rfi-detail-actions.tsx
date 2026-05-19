"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { SerializedRFI } from "@/lib/rfis/serialize-rfi"

export function RfiDetailActions({ rfi }: { rfi: SerializedRFI }) {
  const router = useRouter()
  const { toast } = useToast()
  const [status, setStatus] = useState(rfi.status)
  const [responseText, setResponseText] = useState(rfi.response?.responseText || "")
  const [recommendation, setRecommendation] = useState(rfi.response?.recommendation || "")
  const [comment, setComment] = useState("")
  const [saving, setSaving] = useState(false)

  const saveStatus = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/rfis/${rfi._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error()
      toast({ title: "Estado actualizado" })
      router.refresh()
    } catch {
      toast({ title: "Error", description: "No se pudo actualizar el estado.", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const submitResponse = async () => {
    if (!responseText.trim()) {
      toast({ title: "Escribe la respuesta", variant: "destructive" })
      return
    }
    setSaving(true)
    try {
      const res = await fetch(`/api/rfis/${rfi._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          responseText: responseText.trim(),
          recommendation: recommendation.trim(),
          status: "respondido",
        }),
      })
      if (!res.ok) throw new Error()
      toast({ title: "Respuesta registrada" })
      router.refresh()
    } catch {
      toast({ title: "Error", description: "No se pudo guardar la respuesta.", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const addComment = async () => {
    if (!comment.trim()) return
    setSaving(true)
    try {
      const res = await fetch(`/api/rfis/${rfi._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: comment.trim() }),
      })
      if (!res.ok) throw new Error()
      setComment("")
      toast({ title: "Comentario agregado" })
      router.refresh()
    } catch {
      toast({ title: "Error", description: "No se pudo agregar el comentario.", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Estado del RFI</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-3">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="sm:max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="abierto">Abierto</SelectItem>
              <SelectItem value="en_revision">En revisión</SelectItem>
              <SelectItem value="respondido">Respondido</SelectItem>
              <SelectItem value="cerrado">Cerrado</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={saveStatus} disabled={saving} variant="outline">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Actualizar estado"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Respuesta oficial</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Respuesta</Label>
            <Textarea value={responseText} onChange={(e) => setResponseText(e.target.value)} rows={5} className="mt-1" />
          </div>
          <div>
            <Label>Recomendación</Label>
            <Textarea value={recommendation} onChange={(e) => setRecommendation(e.target.value)} rows={3} className="mt-1" />
          </div>
          <Button onClick={submitResponse} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
            Publicar respuesta
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Comentario</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} placeholder="Nota interna o seguimiento..." />
          <Button onClick={addComment} disabled={saving} variant="secondary">
            Agregar comentario
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}


