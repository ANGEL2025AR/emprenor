"use client"

import { useCallback, useId, useRef, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { PublicImageFolder } from "@/lib/uploads/public-image"
import { uploadPublicImageFromPc } from "@/lib/uploads/upload-public-image-client"
import { ImagePlus, Loader2, X } from "lucide-react"

type GalleryUploadFieldProps = {
  value: string[]
  onChange: (urls: string[]) => void
  label?: string
  hint?: string
  folder?: PublicImageFolder
  className?: string
  onUploadingChange?: (uploading: boolean) => void
}

export function GalleryUploadField({
  value,
  onChange,
  label = "Galería de imágenes",
  hint,
  folder = "public-projects",
  className,
  onUploadingChange,
}: GalleryUploadFieldProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const setBusy = useCallback(
    (busy: boolean) => {
      setUploading(busy)
      onUploadingChange?.(busy)
    },
    [onUploadingChange],
  )

  const uploadFiles = async (files: File[]) => {
    if (files.length === 0) return
    setError(null)
    setBusy(true)
    const added: string[] = []
    try {
      for (const file of files) {
        const url = await uploadPublicImageFromPc(file, folder)
        added.push(url)
      }
      onChange([...value, ...added])
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al subir imágenes")
      if (added.length > 0) onChange([...value, ...added])
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    void uploadFiles(Array.from(e.target.files || []))
  }

  const removeAt = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={inputId}>{label}</Label>
      {hint ? <p className="text-sm text-muted-foreground">{hint}</p> : null}

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple
        className="sr-only"
        onChange={onFileInput}
        disabled={uploading}
      />

      {value.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {value.map((url, index) => (
            <div key={`${url}-${index}`} className="group relative aspect-[4/3] overflow-hidden rounded-lg border">
              <Image src={url} alt={`Imagen ${index + 1}`} fill unoptimized className="object-cover" sizes="200px" />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute right-2 top-2 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => removeAt(index)}
                aria-label="Quitar imagen"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      ) : null}

      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-colors",
          "border-slate-300 hover:border-primary/50 hover:bg-slate-50 disabled:opacity-60",
        )}
      >
        {uploading ? (
          <>
            <Loader2 className="mb-2 h-8 w-8 animate-spin text-primary" />
            <span className="text-sm text-slate-600">Subiendo imágenes…</span>
          </>
        ) : (
          <>
            <ImagePlus className="mb-2 h-8 w-8 text-slate-400" />
            <span className="text-sm font-medium text-primary">
              {value.length > 0 ? "Agregar más desde mi PC" : "Subir imágenes desde mi PC"}
            </span>
            <span className="mt-1 text-xs text-slate-500">Podés elegir varias a la vez</span>
          </>
        )}
      </button>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  )
}
