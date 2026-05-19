"use client"

import { useState } from "react"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { createPortalListFetcher } from "@/lib/portal/swr"
import { Plus } from "lucide-react"

const fetcher = createPortalListFetcher("announcements")

type AnnouncementRow = { _id: string; title?: string; content?: string; author?: string }

export function AdminAnnouncementsPanel() {
  const { toast } = useToast()
  const { data, mutate } = useSWR("/api/portal/announcements", fetcher)
  const announcements = (data ?? []) as AnnouncementRow[]
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)

  async function publish() {
    if (!title.trim() || !content.trim()) {
      toast({ title: "Complete título y contenido", variant: "destructive" })
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/portal/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, targetRoles: "all", priority: "importante" }),
      })
      if (!res.ok) throw new Error()
      toast({ title: "Comunicado publicado" })
      setTitle("")
      setContent("")
      mutate()
    } catch {
      toast({ title: "Error al publicar", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Comunicaciones internas</h1>
        <p className="text-slate-600">Publique circulares y avisos para el personal</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nuevo comunicado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Título</Label>
            <Input className="mt-1" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <Label>Contenido</Label>
            <Textarea className="mt-1" rows={4} value={content} onChange={(e) => setContent(e.target.value)} />
          </div>
          <Button onClick={publish} disabled={loading}>
            <Plus className="w-4 h-4 mr-2" /> Publicar
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Publicados ({announcements.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {announcements.map((a) => (
            <div key={a._id} className="p-4 rounded-lg border">
              <p className="font-semibold">{a.title}</p>
              <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap">{a.content}</p>
              {a.author && <p className="text-xs text-slate-400 mt-2">Por {a.author}</p>}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
