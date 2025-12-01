"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileText, ImageIcon, File, Loader2, Download, Eye, Filter } from "lucide-react"
import type { Document } from "@/lib/db/models"

const TYPE_ICONS: Record<string, React.ElementType> = {
  plano: FileText,
  contrato: FileText,
  factura: FileText,
  certificado: FileText,
  informe: FileText,
  foto: ImageIcon,
  video: File,
  otro: File,
}

const TYPE_COLORS: Record<string, string> = {
  plano: "bg-blue-100 text-blue-700",
  contrato: "bg-purple-100 text-purple-700",
  factura: "bg-green-100 text-green-700",
  certificado: "bg-amber-100 text-amber-700",
  informe: "bg-slate-100 text-slate-700",
  foto: "bg-pink-100 text-pink-700",
  video: "bg-red-100 text-red-700",
  otro: "bg-gray-100 text-gray-700",
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [typeFilter, setTypeFilter] = useState("")

  const fetchDocuments = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (typeFilter && typeFilter !== "all") params.append("type", typeFilter)

      const response = await fetch(`/api/documents?${params}`)
      const data = await response.json()
      setDocuments(data.documents || [])
    } catch {
      // Error silencioso en producción
    } finally {
      setLoading(false)
    }
  }, [typeFilter])

  useEffect(() => {
    fetchDocuments()
  }, [fetchDocuments])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", "otro")
      formData.append("name", file.name)

      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        fetchDocuments()
      }
    } catch {
      // Error silencioso en producción
    } finally {
      setUploading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Documentos</h1>
          <p className="text-slate-600">Gestiona planos, contratos y archivos del proyecto</p>
        </div>
        <div className="relative">
          <Input
            type="file"
            onChange={handleUpload}
            className="absolute inset-0 opacity-0 cursor-pointer"
            disabled={uploading}
          />
          <Button disabled={uploading}>
            {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
            Subir Documento
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Tipo de documento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="plano">Planos</SelectItem>
              <SelectItem value="contrato">Contratos</SelectItem>
              <SelectItem value="factura">Facturas</SelectItem>
              <SelectItem value="certificado">Certificados</SelectItem>
              <SelectItem value="informe">Informes</SelectItem>
              <SelectItem value="foto">Fotos</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
              <SelectItem value="otro">Otros</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Documents grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      ) : documents.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No hay documentos</h3>
            <p className="text-slate-600 mb-4">Sube tu primer documento para comenzar</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {documents.map((doc) => {
            const Icon = TYPE_ICONS[doc.type] || File
            return (
              <Card key={doc._id?.toString()} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${TYPE_COLORS[doc.type]}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate" title={doc.name}>
                        {doc.name}
                      </p>
                      <p className="text-sm text-slate-500">{formatFileSize(doc.file.size)}</p>
                      <Badge variant="outline" className="mt-2 text-xs">
                        {doc.type}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                      <a href={doc.file.url} target="_blank" rel="noopener noreferrer">
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                      <a href={doc.file.url} download={doc.file.originalName}>
                        <Download className="w-4 h-4 mr-1" />
                        Descargar
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
