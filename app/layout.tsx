import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"
import { generateOrganizationSchema, generateLocalBusinessSchema } from "@/lib/structured-data"
import { SITE_URL } from "@/lib/site-url"
import { EMPRENOR_BRAND, EMPRENOR_SITE, EMPRENOR_SLOGAN, EMPRENOR_TITULAR } from "@/lib/company/constants"

const googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION

const _geist = Geist({
  subsets: ["latin"],
  display: "swap",
  preload: true,
})

const _geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: EMPRENOR_SITE.defaultTitle,
    template: EMPRENOR_SITE.titleTemplate,
  },
  description: EMPRENOR_SITE.defaultDescription,
  keywords: [
    "construcción Salta",
    "construcción Jujuy",
    "construcción Tucumán",
    "construcción Formosa",
    "remodelación Salta",
    "albañilería Salta",
    "electricidad Salta",
    "plomería Salta",
    "pintura Salta",
    "empresa construcción NOA",
    "construcción Tartagal",
    "obras civiles Salta",
    "EMPRENOR",
    "Campamento Vespucio",
    "construcción Campamento Vespucio",
    "viviendas prefabricadas Salta",
    "obras industriales NOA",
    "instalaciones gas Salta",
  ],
  authors: [{ name: EMPRENOR_TITULAR.nombreCompleto, url: SITE_URL }],
  creator: EMPRENOR_BRAND.nombreExtendido,
  publisher: EMPRENOR_TITULAR.nombreCompleto,
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: SITE_URL,
    siteName: EMPRENOR_SITE.siteName,
    title: EMPRENOR_SITE.defaultTitle,
    description: EMPRENOR_SITE.defaultDescription,
    images: [
      {
        url: "/images/logo-emprenor-large.png",
        width: 1024,
        height: 168,
        alt: `${EMPRENOR_BRAND.siglas} — ${EMPRENOR_SLOGAN}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: EMPRENOR_SITE.defaultTitle,
    description: EMPRENOR_SITE.defaultDescription,
    images: ["/images/logo-emprenor-large.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  ...(googleSiteVerification
    ? { verification: { google: googleSiteVerification } }
    : {}),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2E2A6E" },
    { media: "(prefers-color-scheme: dark)", color: "#2E2A6E" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const organizationSchema = generateOrganizationSchema()
  const localBusinessSchema = generateLocalBusinessSchema()

  return (
    <html lang="es-AR">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="application-name" content="EMPRENOR" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="EMPRENOR" />
        <meta name="mobile-web-app-capable" content="yes" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://vercel-analytics.com" />
      </head>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
