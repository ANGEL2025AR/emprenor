"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FileText, Upload, Download, Eye, Trash2, FileImage, FileVideo, File, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Document } from "@/lib/db/models"

const DOCUMENT_TYPES = [
  { value: "plano", label: "Plano" },
  { value: "contrato", label: "Contrato" },
  { value: "factura", label: "Factura" },
  { value: "certificado", label: "Certificado" },
  { value: "informe", label: "Informe" },
  { value: "foto", label: "Foto" },
  { value: "video", label: "Video" },
  { value: "otro", label: "Otro" },
]

interface ProjectDocumentsClientProps {
  projectId: string
}

export function ProjectDocumentsClient({ projectId }: ProjectDocumentsClientProps) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const { toast } = useToast()

  // Form state
  const [file, setFile] = useState<File | null>(null)
  const [documentType, setDocumentType] = useState("otro")
  const [documentName, setDocumentName] = useState("")
  const [description, setDescription] = useState("")

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/documents?projectId=${projectId}`)
      if (response.ok) {
        const data = await response.json()
        setDocuments(data.documents || [])
      }
    } catch (error) {
      console.error("Error fetching documents:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los documentos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [projectId])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      if (!documentName) {
        setDocumentName(selectedFile.name)
      }
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      toast({
        title: "Error",
        description: "Selecciona un archivo para subir",
        variant: "destructive",
      })
      return
    }

    try {
      setUploading(true)

      const formData = new FormData()
      formData.append("file", file)
      formData.append("projectId", projectId)
      formData.append("type", documentType)
      formData.append("name", documentName)
      formData.append("description", description)

      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        toast({
          title: "Éxito",
          description: "Documento subido correctamente",
        })
        // Reset form
        setFile(null)
        setDocumentName("")
        setDescription("")
        setDocumentType("otro")
        setDialogOpen(false)
        // Refresh documents
        await fetchDocuments()
      } else {
        const error = await response.json()
        throw new Error(error.error || "Error al subir documento")
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo subir el documento",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (documentId: string) => {
    if (!confirm("¿Estás seguro de eliminar este documento?")) return

    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Éxito",
          description: "Documento eliminado correctamente",
        })
        await fetchDocuments()
      } else {
        throw new Error("Error al eliminar documento")
      }
    } catch (error) {
      console.error("Delete error:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el documento",
        variant: "destructive",
      })
    }
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return <FileImage className="w-8 h-8 text-blue-500" />
    if (mimeType.startsWith("video/")) return <FileVideo className="w-8 h-8 text-purple-500" />
    if (mimeType.includes("pdf")) return <FileText className="w-8 h-8 text-red-500" />
    return <File className="w-8 h-8 text-slate-500" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-600">
          {documents.length} documento{documents.length !== 1 ? "s" : ""}
        </p>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              Subir Documento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Subir Documento</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <Label htmlFor="file">Archivo</Label>
                <Input id="file" type="file" onChange={handleFileChange} required disabled={uploading} />
              </div>

              <div>
                <Label htmlFor="type">Tipo de Documento</Label>
                <Select value={documentType} onValueChange={setDocumentType} disabled={uploading}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DOCUMENT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="name">Nombre del Documento</Label>
                <Input
                  id="name"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  required
                  disabled={uploading}
                  placeholder="Ej: Plano eléctrico piso 1"
                />
              </div>

              <div>
                <Label htmlFor="description">Descripción (opcional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={uploading}
                  rows={3}
                  placeholder="Información adicional sobre el documento..."
                />
              </div>

              <Button type="submit" className="w-full" disabled={uploading}>
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Subir Documento
                  </>
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {documents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="w-12 h-12 text-slate-300 mb-4" />
            <p className="text-slate-600 text-center">
              No hay documentos asociados a este proyecto.
              <br />
              Sube planos, fotos, contratos y más.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <Card key={doc._id?.toString()} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">{getFileIcon(doc.file.mimeType)}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">{doc.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {DOCUMENT_TYPES.find((t) => t.value === doc.type)?.label || doc.type}
                      </Badge>
                      <span className="text-xs text-slate-500">{formatFileSize(doc.file.size)}</span>
                    </div>
                    {doc.description && <p className="text-xs text-slate-600 mt-2 line-clamp-2">{doc.description}</p>}
                    <div className="flex items-center gap-1 mt-3">
                      <Button variant="ghost" size="sm" onClick={() => window.open(doc.file.url, "_blank")} title="Ver">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(doc.file.url, "_blank")}
                        title="Descargar"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(doc._id!.toString())}
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
