"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { LOGO_LIGHT } from "@/lib/brand/logo"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  Menu,
  X,
  Home,
  Wrench,
  Building2,
  Images,
  Phone,
  Users,
  HelpCircle,
  Flame,
  Factory,
  Hammer,
  Zap,
  Droplets,
  PaintBucket,
  LogIn,
  UserPlus,
  Shield,
  FileCheck,
  ClipboardList,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { ServiceNavItem } from "@/lib/site/get-services"
import { getServiceIcon } from "@/lib/site/service-icons"
import { EMPRENOR_BRAND } from "@/lib/company/constants"

const FALLBACK_SERVICES: ServiceNavItem[] = [
  { slug: "construccion", title: "Construcción", shortDescription: "", href: "/servicios/construccion", icon: "Building2" },
  { slug: "remodelacion", title: "Remodelación", shortDescription: "", href: "/servicios/remodelacion", icon: "Hammer" },
]

export function SiteHeader({ services = FALLBACK_SERVICES }: { services?: ServiceNavItem[] }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="public-header sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/65 shadow-[0_1px_0_rgba(255,255,255,0.8)_inset,0_8px_32px_-12px_rgba(15,23,42,0.08)]">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center" aria-label={`${EMPRENOR_BRAND.siglas} — Ir a inicio`}>
          <Image
            src={LOGO_LIGHT.src}
            alt={`${EMPRENOR_BRAND.siglas} Logo`}
            width={LOGO_LIGHT.width}
            height={LOGO_LIGHT.height}
            unoptimized
            className="h-8 sm:h-10 md:h-12 w-auto"
            style={{ width: "auto" }}
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="h-4 w-4" />
            Inicio
          </Link>

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="flex items-center gap-2">
                  <Wrench className="h-4 w-4" />
                  Servicios
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[500px] gap-3 p-4 md:w-[600px] md:grid-cols-2">
                    <ListItem href="/servicios" icon={Wrench} title="Todos los servicios">
                      Ver catálogo completo
                    </ListItem>
                    {services.map((s) => {
                      const Icon = getServiceIcon(s.icon)
                      return (
                        <ListItem key={s.slug} href={s.href} icon={Icon} title={s.title}>
                          {s.shortDescription}
                        </ListItem>
                      )
                    })}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <Link
            href="/proyectos"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <Images className="h-4 w-4" />
            Proyectos
          </Link>

          <Link
            href="/nosotros"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <Users className="h-4 w-4" />
            Nosotros
          </Link>

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="flex items-center gap-2 text-sm font-medium">
                  <Shield className="h-4 w-4" />
                  Empresa
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[280px] gap-1 p-3">
                    <ListItem href="/politica-calidad" title="Política de calidad" icon={FileCheck}>
                      Compromisos verificables en obra
                    </ListItem>
                    <ListItem href="/gestion-documental" title="Gestión documental" icon={ClipboardList}>
                      Entregables y trazabilidad
                    </ListItem>
                    <ListItem href="/licitaciones" title="Licitaciones" icon={Building2}>
                      Sector público y documentación
                    </ListItem>
                    <ListItem href="/seguridad-y-salud" title="Seguridad y salud" icon={Shield}>
                      Política SST y ART
                    </ListItem>
                    <ListItem href="/sostenibilidad" title="Sostenibilidad" icon={Factory}>
                      Comunidad y medio ambiente
                    </ListItem>
                    <ListItem href="/linea-etica" title="Línea de ética" icon={HelpCircle}>
                      Reporte confidencial
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <Link
            href="/preguntas-frecuentes"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <HelpCircle className="h-4 w-4" />
            FAQ
          </Link>

          <Link
            href="/contacto"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <Phone className="h-4 w-4" />
            Contacto
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login" className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Ingresar
            </Link>
          </Button>
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/contacto">Solicitar Cotización</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="container px-4 py-4 flex flex-col gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-accent transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home className="h-4 w-4" />
              Inicio
            </Link>

            <div className="flex flex-col gap-2 pl-6">
              <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Wrench className="h-4 w-4" />
                Servicios
              </p>
              <Link
                href="/servicios"
                className="text-sm font-medium text-accent hover:text-accent/80 transition-colors py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Ver todos los servicios
              </Link>
              {services.map((s) => (
                <Link
                  key={s.slug}
                  href={s.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {s.title}
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-2 pl-6 border-t border-border pt-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Shield className="h-4 w-4" />
                Empresa
              </p>
              <Link
                href="/politica-calidad"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Política de calidad
              </Link>
              <Link
                href="/gestion-documental"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Gestión documental
              </Link>
              <Link
                href="/licitaciones"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Licitaciones
              </Link>
              <Link
                href="/seguridad-y-salud"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Seguridad y salud
              </Link>
              <Link
                href="/sostenibilidad"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sostenibilidad
              </Link>
              <Link
                href="/linea-etica"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Línea de ética
              </Link>
            </div>

            <Link
              href="/proyectos"
              className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-accent transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Images className="h-4 w-4" />
              Proyectos
            </Link>

            <Link
              href="/nosotros"
              className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-accent transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Users className="h-4 w-4" />
              Nosotros
            </Link>

            <Link
              href="/preguntas-frecuentes"
              className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-accent transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <HelpCircle className="h-4 w-4" />
              Preguntas Frecuentes
            </Link>

            <Link
              href="/contacto"
              className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-accent transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Phone className="h-4 w-4" />
              Contacto
            </Link>

            <div className="border-t border-border pt-4 mt-2">
              <Link
                href="/login"
                className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-accent transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <LogIn className="h-4 w-4" />
                Ingresar
              </Link>
              <Link
                href="/registro"
                className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-accent transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <UserPlus className="h-4 w-4" />
                Registrarse
              </Link>
            </div>

            <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/contacto">Solicitar Cotización</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}

interface ListItemProps {
  href: string
  title: string
  children: React.ReactNode
  icon: React.ComponentType<{ className?: string }>
}

function ListItem({ href, title, children, icon: Icon }: ListItemProps) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors",
            "bg-white text-gray-900",
            "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          )}
        >
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-current" />
            <div className="text-sm font-medium leading-none">{title}</div>
          </div>
          <p className="line-clamp-2 text-sm leading-snug opacity-70">{children}</p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}
