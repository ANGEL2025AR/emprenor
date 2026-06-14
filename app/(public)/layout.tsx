import type React from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { CookieConsentBanner } from "@/components/public/cookie-consent-banner"
import { ScrollManager } from "@/components/routing/scroll-manager"
import { getPublishedServices, toServiceNavItem } from "@/lib/site/get-services"

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const services = (await getPublishedServices()).map(toServiceNavItem)

  return (
    <>
      <ScrollManager />
      <SiteHeader services={services} />
      {children}
      <SiteFooter />
      <WhatsAppFloat />
      <CookieConsentBanner />
    </>
  )
}
