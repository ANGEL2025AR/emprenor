import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"
import { generateOrganizationSchema, generateLocalBusinessSchema } from "@/lib/structured-data"

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
  metadataBase: new URL("https://www.emprenor.com"),
  title: {
    default: "EMPRENOR - Construcción y Servicios en Salta, Jujuy, Tucumán y Formosa",
    template: "%s | EMPRENOR Construcciones",
  },
  description:
    "Empresa líder en construcción, remodelación, albañilería, electricidad, plomería y pintura. Más de 15 años de experiencia. Oficinas en Salta Capital, Tartagal y Campamento Vespucio. Servicios en Salta, Jujuy, Tucumán y Formosa. Cotización gratuita.",
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
  authors: [{ name: "EMPRENOR Construcciones", url: "https://www.emprenor.com" }],
  creator: "EMPRENOR Construcciones",
  publisher: "EMPRENOR Construcciones",
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://www.emprenor.com",
    siteName: "EMPRENOR Construcciones",
    title: "EMPRENOR - Construcción y Servicios Profesionales en el NOA",
    description:
      "Empresa líder en construcción y servicios en el NOA. Más de 15 años transformando espacios. Oficinas en Salta Capital, Tartagal y Campamento Vespucio. Cobertura en Salta, Jujuy, Tucumán y Formosa.",
    images: [
      {
        url: "/emprenor-construction-company-logo-green.jpg",
        width: 1200,
        height: 630,
        alt: "EMPRENOR Construcciones - Servicios profesionales en el NOA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EMPRENOR - Construcción y Servicios Profesionales",
    description: "Empresa líder en construcción en el NOA. Servicios en Salta, Jujuy, Tucumán y Formosa.",
    images: ["/emprenor-construction-company-logo-green.jpg"],
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
    canonical: "https://www.emprenor.com",
  },
  verification: {
    google: "google-site-verification-code",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
    generator: 'v0.app'
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#22c55e" },
    { media: "(prefers-color-scheme: dark)", color: "#10b981" },
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
