"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
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
} from "lucide-react"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center" aria-label="EMPRENOR - Ir a página de inicio">
          <Image
            src="/images/logo-emprenor.png"
            alt="EMPRENOR Logo"
            width={180}
            height={48}
            className="h-10 w-auto md:h-12"
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
                    <ListItem href="/servicios/construccion" icon={Building2} title="Construcción">
                      Proyectos residenciales, comerciales e industriales
                    </ListItem>
                    <ListItem href="/servicios/remodelacion" icon={Hammer} title="Remodelación">
                      Renovación y actualización de espacios
                    </ListItem>
                    <ListItem href="/servicios/viviendas-prefabricadas" icon={Home} title="Viviendas Prefabricadas">
                      Construcción rápida y eficiente de viviendas modulares
                    </ListItem>
                    <ListItem href="/servicios/obras-industriales" icon={Factory} title="Obras Industriales">
                      Estructuras metálicas y establecimientos agropecuarios
                    </ListItem>
                    <ListItem href="/servicios/gas" icon={Flame} title="Instalaciones de Gas">
                      Gas natural, envasado y GLP certificado
                    </ListItem>
                    <ListItem href="/servicios/albanileria" icon={Building2} title="Albañilería">
                      Trabajos especializados en mampostería
                    </ListItem>
                    <ListItem href="/servicios/electricidad" icon={Zap} title="Electricidad">
                      Instalaciones y reparaciones eléctricas
                    </ListItem>
                    <ListItem href="/servicios/plomeria" icon={Droplets} title="Plomería">
                      Sistemas hidráulicos y sanitarios
                    </ListItem>
                    <ListItem href="/servicios/pintura" icon={PaintBucket} title="Pintura">
                      Acabados y pintura profesional
                    </ListItem>
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
                href="/servicios/construccion"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Construcción
              </Link>
              <Link
                href="/servicios/remodelacion"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Remodelación
              </Link>
              <Link
                href="/servicios/viviendas-prefabricadas"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Viviendas Prefabricadas
              </Link>
              <Link
                href="/servicios/obras-industriales"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Obras Industriales
              </Link>
              <Link
                href="/servicios/gas"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Instalaciones de Gas
              </Link>
              <Link
                href="/servicios/albanileria"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Albañilería
              </Link>
              <Link
                href="/servicios/electricidad"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Electricidad
              </Link>
              <Link
                href="/servicios/plomeria"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Plomería
              </Link>
              <Link
                href="/servicios/pintura"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pintura
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
