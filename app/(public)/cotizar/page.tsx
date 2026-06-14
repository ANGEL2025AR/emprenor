"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { contactFormUrl } from "@/lib/site/urls"

export default function CotizarPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace(contactFormUrl())
  }, [router])

  return null
}
