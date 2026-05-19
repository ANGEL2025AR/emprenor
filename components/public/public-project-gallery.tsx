"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react"

type Props = {
  title: string
  image: string
  gallery?: string[]
}

export function PublicProjectGallery({ title, image, gallery = [] }: Props) {
  const images = [image, ...gallery.filter(Boolean)]
  const [index, setIndex] = useState(0)

  const current = images[index]
  const hasMultiple = images.length > 1

  const prev = () => setIndex((i) => (i === 0 ? images.length - 1 : i - 1))
  const next = () => setIndex((i) => (i === images.length - 1 ? 0 : i + 1))

  return (
    <div className="relative">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-muted">
        {current ? (
          <Image
            src={current}
            alt={`${title} - ${index + 1}`}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 896px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <ImageOff className="h-16 w-16 text-muted-foreground" />
          </div>
        )}
        {hasMultiple && (
          <>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute left-3 top-1/2 -translate-y-1/2"
              onClick={prev}
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute right-3 top-1/2 -translate-y-1/2"
              onClick={next}
              aria-label="Imagen siguiente"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-background/90 px-3 py-1 text-sm backdrop-blur-sm">
              {index + 1} / {images.length}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
