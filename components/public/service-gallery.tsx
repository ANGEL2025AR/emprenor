"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react"

export function ServiceGallery({ title, images }: { title: string; images: string[] }) {
  const [index, setIndex] = useState(0)
  const current = images[index]
  const hasMultiple = images.length > 1

  const prev = () => setIndex((i) => (i === 0 ? images.length - 1 : i - 1))
  const next = () => setIndex((i) => (i === images.length - 1 ? 0 : i + 1))

  if (!current) {
    return (
      <div className="flex aspect-[16/10] items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <ImageOff className="h-10 w-10" />
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-muted">
        <Image
          src={current}
          alt={`${title} - ${index + 1}`}
          fill
          className="object-cover"
          unoptimized={current.startsWith("http") || current.startsWith("/uploads")}
        />
      </div>
      {hasMultiple ? (
        <div className="absolute inset-y-0 flex w-full items-center justify-between px-2">
          <Button type="button" variant="secondary" size="icon" onClick={prev} aria-label="Anterior">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button type="button" variant="secondary" size="icon" onClick={next} aria-label="Siguiente">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      ) : null}
      {hasMultiple ? (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={`${img}-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 ${
                i === index ? "border-emerald-600" : "border-transparent opacity-70"
              }`}
            >
              <Image src={img} alt="" fill className="object-cover" unoptimized />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
