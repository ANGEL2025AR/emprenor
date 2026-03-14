import Link from "next/link"
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Building2, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-foreground">
      {/* Main Footer */}
      <div className="container px-4 py-16 md:px-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-6">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl text-background tracking-tight">EMPRENOR</span>
                <span className="text-xs text-background/60 tracking-wider">CONSTRUCCIONES</span>
              </div>
            </Link>
            <p className="text-sm text-background/70 leading-relaxed">
              Construyendo el futuro con excelencia, calidad y compromiso. Mas de 15 anos de experiencia en proyectos
              residenciales, comerciales e industriales en el NOA argentino.
            </p>
            <div className="flex gap-3">
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/10 hover:bg-primary text-background transition-colors"
                aria-label="Siguenos en Facebook"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/10 hover:bg-primary text-background transition-colors"
                aria-label="Siguenos en Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/10 hover:bg-primary text-background transition-colors"
                aria-label="Siguenos en LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-background uppercase tracking-wider">Servicios</h3>
            <ul className="space-y-3 text-sm">
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
                <li key={service.href}>
                  <Link
                    href={service.href}
                    className="text-background/70 hover:text-primary transition-colors inline-flex items-center gap-1 group"
                  >
                    {service.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-background uppercase tracking-wider">Enlaces</h3>
            <ul className="space-y-3 text-sm">
              {[
                { href: "/", label: "Inicio" },
                { href: "/proyectos", label: "Proyectos" },
                { href: "/nosotros", label: "Nosotros" },
                { href: "/preguntas-frecuentes", label: "Preguntas Frecuentes" },
                { href: "/contacto", label: "Contacto" },
                { href: "/login", label: "Acceso Clientes" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-background/70 hover:text-primary transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-background uppercase tracking-wider">Contacto</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <span className="text-background/70 block">Ituzaingo 920, Salta Capital</span>
                  <span className="text-background/70 block">Ituzaingo 1279, Tartagal</span>
                  <span className="text-background/70 block">Av. Casiano Casas S/N, Campamento Vespucio</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <a
                    href="tel:+5491127586521"
                    className="text-background/70 hover:text-primary transition-colors block"
                  >
                    +54 9 11 2758-6521
                  </a>
                  <a
                    href="tel:+543873522920"
                    className="text-background/70 hover:text-primary transition-colors block"
                  >
                    +54 9 387 352-2920
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <a
                  href="mailto:info@emprenor.com.ar"
                  className="text-background/70 hover:text-primary transition-colors"
                >
                  info@emprenor.com.ar
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container px-4 py-6 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-background/60 text-center md:text-left">
              {new Date().getFullYear()} EMPRENOR CONSTRUCCIONES. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6 text-sm text-background/60">
              <Link href="/privacidad" className="hover:text-primary transition-colors">
                Privacidad
              </Link>
              <Link href="/terminos" className="hover:text-primary transition-colors">
                Terminos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
