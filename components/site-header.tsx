"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
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
  ArrowRight,
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-background/95 backdrop-blur-lg border-b border-border shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center" aria-label="EMPRENOR - Ir a pagina de inicio">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className={cn(
                "font-bold text-xl tracking-tight transition-colors",
                scrolled ? "text-foreground" : "text-background"
              )}>
                EMPRENOR
              </span>
              <span className={cn(
                "text-xs tracking-wider transition-colors",
                scrolled ? "text-muted-foreground" : "text-background/70"
              )}>
                CONSTRUCCIONES
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors",
              scrolled
                ? "text-muted-foreground hover:text-foreground hover:bg-muted"
                : "text-background/80 hover:text-background hover:bg-background/10"
            )}
          >
            Inicio
          </Link>

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-lg transition-colors bg-transparent",
                    scrolled
                      ? "text-muted-foreground hover:text-foreground hover:bg-muted data-[state=open]:bg-muted"
                      : "text-background/80 hover:text-background hover:bg-background/10 data-[state=open]:bg-background/10"
                  )}
                >
                  Servicios
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[500px] gap-2 p-4 md:w-[600px] md:grid-cols-2">
                    <ListItem href="/servicios/construccion" icon={Building2} title="Construccion">
                      Proyectos residenciales, comerciales e industriales
                    </ListItem>
                    <ListItem href="/servicios/remodelacion" icon={Hammer} title="Remodelacion">
                      Renovacion y actualizacion de espacios
                    </ListItem>
                    <ListItem href="/servicios/viviendas-prefabricadas" icon={Home} title="Viviendas Prefabricadas">
                      Construccion rapida y eficiente de viviendas modulares
                    </ListItem>
                    <ListItem href="/servicios/obras-industriales" icon={Factory} title="Obras Industriales">
                      Estructuras metalicas y establecimientos agropecuarios
                    </ListItem>
                    <ListItem href="/servicios/gas" icon={Flame} title="Instalaciones de Gas">
                      Gas natural, envasado y GLP certificado
                    </ListItem>
                    <ListItem href="/servicios/albanileria" icon={Building2} title="Albanileria">
                      Trabajos especializados en mamposteria
                    </ListItem>
                    <ListItem href="/servicios/electricidad" icon={Zap} title="Electricidad">
                      Instalaciones y reparaciones electricas
                    </ListItem>
                    <ListItem href="/servicios/plomeria" icon={Droplets} title="Plomeria">
                      Sistemas hidraulicos y sanitarios
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
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors",
              scrolled
                ? "text-muted-foreground hover:text-foreground hover:bg-muted"
                : "text-background/80 hover:text-background hover:bg-background/10"
            )}
          >
            Proyectos
          </Link>

          <Link
            href="/nosotros"
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors",
              scrolled
                ? "text-muted-foreground hover:text-foreground hover:bg-muted"
                : "text-background/80 hover:text-background hover:bg-background/10"
            )}
          >
            Nosotros
          </Link>

          <Link
            href="/preguntas-frecuentes"
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors",
              scrolled
                ? "text-muted-foreground hover:text-foreground hover:bg-muted"
                : "text-background/80 hover:text-background hover:bg-background/10"
            )}
          >
            FAQ
          </Link>

          <Link
            href="/contacto"
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors",
              scrolled
                ? "text-muted-foreground hover:text-foreground hover:bg-muted"
                : "text-background/80 hover:text-background hover:bg-background/10"
            )}
          >
            Contacto
          </Link>
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className={cn(
              "rounded-lg",
              scrolled
                ? "text-muted-foreground hover:text-foreground"
                : "text-background/80 hover:text-background hover:bg-background/10"
            )}
          >
            <Link href="/login" className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Ingresar
            </Link>
          </Button>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-6">
            <Link href="/contacto" className="flex items-center gap-2">
              Cotizacion Gratis
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "lg:hidden rounded-lg",
            scrolled ? "text-foreground" : "text-background"
          )}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background animate-fade-in">
          <nav className="container px-4 py-6 flex flex-col gap-2">
            <Link
              href="/"
              className="flex items-center gap-3 text-sm font-medium text-foreground hover:text-primary transition-colors py-3 px-4 rounded-lg hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home className="h-5 w-5" />
              Inicio
            </Link>

            <div className="py-2">
              <p className="flex items-center gap-3 text-sm font-semibold text-foreground px-4 py-2">
                <Wrench className="h-5 w-5" />
                Servicios
              </p>
              <div className="ml-8 flex flex-col gap-1 mt-2">
                {[
                  { href: "/servicios/construccion", label: "Construccion" },
                  { href: "/servicios/remodelacion", label: "Remodelacion" },
                  { href: "/servicios/viviendas-prefabricadas", label: "Viviendas Prefabricadas" },
                  { href: "/servicios/obras-industriales", label: "Obras Industriales" },
                  { href: "/servicios/gas", label: "Instalaciones de Gas" },
                  { href: "/servicios/albanileria", label: "Albanileria" },
                  { href: "/servicios/electricidad", label: "Electricidad" },
                  { href: "/servicios/plomeria", label: "Plomeria" },
                  { href: "/servicios/pintura", label: "Pintura" },
                ].map((service) => (
                  <Link
                    key={service.href}
                    href={service.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-muted"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {service.label}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/proyectos"
              className="flex items-center gap-3 text-sm font-medium text-foreground hover:text-primary transition-colors py-3 px-4 rounded-lg hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Images className="h-5 w-5" />
              Proyectos
            </Link>

            <Link
              href="/nosotros"
              className="flex items-center gap-3 text-sm font-medium text-foreground hover:text-primary transition-colors py-3 px-4 rounded-lg hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Users className="h-5 w-5" />
              Nosotros
            </Link>

            <Link
              href="/preguntas-frecuentes"
              className="flex items-center gap-3 text-sm font-medium text-foreground hover:text-primary transition-colors py-3 px-4 rounded-lg hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              <HelpCircle className="h-5 w-5" />
              Preguntas Frecuentes
            </Link>

            <Link
              href="/contacto"
              className="flex items-center gap-3 text-sm font-medium text-foreground hover:text-primary transition-colors py-3 px-4 rounded-lg hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Phone className="h-5 w-5" />
              Contacto
            </Link>

            <div className="border-t border-border pt-4 mt-4 flex flex-col gap-3">
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 text-sm font-medium text-foreground py-3 px-4 rounded-lg border border-border hover:bg-muted transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <LogIn className="h-4 w-4" />
                Ingresar al Sistema
              </Link>
              <Button asChild className="w-full rounded-lg">
                <Link href="/contacto" onClick={() => setMobileMenuOpen(false)}>
                  Solicitar Cotizacion Gratis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
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
            "block select-none space-y-1 rounded-xl p-3 leading-none no-underline outline-none transition-colors",
            "bg-background text-foreground",
            "hover:bg-primary/10 focus:bg-primary/10",
          )}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <div className="text-sm font-medium leading-none">{title}</div>
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-2">{children}</p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}
