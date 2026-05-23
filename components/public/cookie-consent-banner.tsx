"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const STORAGE_KEY = "emprenor_cookie_consent"

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 md:p-6 pointer-events-none">
      <div className="container max-w-4xl mx-auto pointer-events-auto">
        <div className="rounded-xl border bg-background/95 backdrop-blur shadow-lg p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-4">
          <p className="text-sm text-muted-foreground flex-1">
            Usamos cookies esenciales para el portal y métricas para mejorar el sitio. Consulte nuestra{" "}
            <Link href="/cookies" className="text-emerald-700 underline font-medium">
              política de cookies
            </Link>{" "}
            y{" "}
            <Link href="/privacidad" className="text-emerald-700 underline font-medium">
              privacidad
            </Link>
            .
          </p>
          <Button
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 shrink-0"
            onClick={() => {
              localStorage.setItem(STORAGE_KEY, "accepted")
              setVisible(false)
            }}
          >
            Aceptar
          </Button>
        </div>
      </div>
    </div>
  )
}
