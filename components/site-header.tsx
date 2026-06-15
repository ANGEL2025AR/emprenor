"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { LOGO_LIGHT } from "@/lib/brand/logo"
import { contactFormUrl } from "@/lib/site/urls"
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
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { ServiceNavItem } from "@/lib/site/get-services"
import { getServiceIcon } from "@/lib/site/service-icons"
import { FOOTER_SERVICE_LINKS } from "@/lib/site/services-catalog"
import { GESTION_EMPRENOR } from "@/lib/site/gestion-emprenor-portal"

const FALLBACK_SERVICES: ServiceNavItem[] = FOOTER_SERVICE_LINKS.map((link, i) => ({
  slug: link.href.replace("/servicios/", ""),
  title: link.label,
  shortDescription: "",
  href: link.href,
  icon: "Building2" as const,
}))

export function SiteHeader({ services = FALLBACK_SERVICES }: { services?: ServiceNavItem[] }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center" aria-label="EMPRENOR - Ir a página de inicio">
          <Image
            src={LOGO_LIGHT.src}
            alt="EMPRENOR Logo"
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
                    <ListItem href="/licitaciones" title="Licitaciones" icon={Building2}>
                      Sector público y documentación
                    </ListItem>
                    <ListItem href="/gestion-documental" title="Gestión documental" icon={Shield}>
                      Trazabilidad y portal de obra
                    </ListItem>
                    <ListItem href={GESTION_EMPRENOR.homeUrl} title={GESTION_EMPRENOR.product} icon={LogIn}>
                      Portal de clientes y equipo en obra
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
            <a href={GESTION_EMPRENOR.loginUrl} className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Iniciar sesión
            </a>
          </Button>
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href={contactFormUrl()}>Solicitar Cotización</Link>
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
              {services.map((service) => (
                <Link
                  key={service.slug}
                  href={service.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {service.title}
                </Link>
              ))}
              <Link
                href="/brochure"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Brochure
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
              <a
                href={GESTION_EMPRENOR.loginUrl}
                className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-accent transition-colors py-2"
              >
                <LogIn className="h-4 w-4" />
                Iniciar sesión
              </a>
              <a
                href={GESTION_EMPRENOR.registerUrl}
                className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-accent transition-colors py-2"
              >
                <UserPlus className="h-4 w-4" />
                Crear cuenta gratis
              </a>
            </div>

            <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href={contactFormUrl()}>Solicitar Cotización</Link>
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
