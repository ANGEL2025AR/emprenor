"use client"

import { useCallback, useId, useRef, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { PublicImageFolder } from "@/lib/uploads/public-image"
import { uploadPublicImageFromPc } from "@/lib/uploads/upload-public-image-client"
import { ImagePlus, Loader2, Upload, X } from "lucide-react"

type ImageUploadFieldProps = {
  value: string
  onChange: (url: string) => void
  label?: string
  hint?: string
  allowEmpty?: boolean
  folder?: PublicImageFolder
  className?: string
  previewClassName?: string
  onUploadingChange?: (uploading: boolean) => void
}

export function ImageUploadField({
  value,
  onChange,
  label = "Imagen",
  hint,
  allowEmpty = false,
  folder = "site",
  className,
  previewClassName,
  onUploadingChange,
}: ImageUploadFieldProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const setBusy = useCallback(
    (busy: boolean) => {
      setUploading(busy)
      onUploadingChange?.(busy)
    },
    [onUploadingChange],
  )

  const processFile = useCallback(
    async (file: File) => {
      setError(null)
      setBusy(true)
      try {
        const url = await uploadPublicImageFromPc(file, folder)
        onChange(url)
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error al subir la imagen")
      } finally {
        setBusy(false)
        if (inputRef.current) inputRef.current.value = ""
      }
    },
    [folder, onChange, setBusy],
  )

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) void processFile(file)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file?.type.startsWith("image/")) void processFile(file)
    else setError("Arrastrá un archivo de imagen (JPG, PNG, WebP o AVIF).")
  }

  const openPicker = () => inputRef.current?.click()

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={inputId}>{label}</Label>
      {hint ? <p className="text-sm text-muted-foreground">{hint}</p> : null}

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="sr-only"
        onChange={onFileInput}
        disabled={uploading}
      />

      {value ? (
        <div className="space-y-3">
          <div
            className={cn(
              "relative overflow-hidden rounded-lg border bg-slate-100",
              previewClassName ?? "max-w-xl aspect-[16/9]",
            )}
          >
            <Image
              src={value}
              alt="Vista previa"
              fill
              unoptimized
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 640px"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={openPicker} disabled={uploading}>
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Subiendo…
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Cambiar desde mi PC
                </>
              )}
            </Button>
            {allowEmpty ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onChange("")}
                disabled={uploading}
              >
                <X className="mr-2 h-4 w-4" />
                Sin imagen
              </Button>
            ) : null}
          </div>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              openPicker()
            }
          }}
          onClick={openPicker}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors",
            dragOver ? "border-primary bg-primary/5" : "border-slate-300 hover:border-primary/50 hover:bg-slate-50",
            uploading && "pointer-events-none opacity-70",
          )}
        >
          {uploading ? (
            <>
              <Loader2 className="mb-3 h-10 w-10 animate-spin text-primary" />
              <p className="text-sm font-medium text-slate-700">Subiendo imagen…</p>
            </>
          ) : (
            <>
              <ImagePlus className="mb-3 h-10 w-10 text-slate-400" />
              <p className="text-sm font-medium text-slate-800">Hacé clic o arrastrá una imagen desde tu PC</p>
              <p className="mt-1 text-xs text-slate-500">JPG, PNG, WebP o AVIF · máximo 10 MB</p>
            </>
          )}
        </div>
      )}

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  )
}
