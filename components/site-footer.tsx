import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container px-4 py-12 md:px-6 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="/images/logo-emprenor.png"
                alt="EMPRENOR Logo"
                width={160}
                height={42}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Construyendo el futuro con excelencia, calidad y compromiso. Más de 15 años de experiencia en proyectos
              residenciales, comerciales e industriales.
            </p>
            <div className="flex gap-3">
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                aria-label="Síguenos en Facebook"
              >
                <Facebook className="h-4 w-4" />
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                aria-label="Síguenos en Instagram"
              >
                <Instagram className="h-4 w-4" />
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                aria-label="Síguenos en LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Servicios</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/servicios/construccion"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Construcción
                </Link>
              </li>
              <li>
                <Link
                  href="/servicios/remodelacion"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Remodelación
                </Link>
              </li>
              <li>
                <Link
                  href="/servicios/viviendas-prefabricadas"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Viviendas Prefabricadas
                </Link>
              </li>
              <li>
                <Link
                  href="/servicios/obras-industriales"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Obras Industriales
                </Link>
              </li>
              <li>
                <Link href="/servicios/gas" className="text-muted-foreground hover:text-foreground transition-colors">
                  Instalaciones de Gas
                </Link>
              </li>
              <li>
                <Link
                  href="/servicios/albanileria"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Albañilería
                </Link>
              </li>
              <li>
                <Link
                  href="/servicios/electricidad"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Electricidad
                </Link>
              </li>
              <li>
                <Link
                  href="/servicios/plomeria"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Plomería
                </Link>
              </li>
              <li>
                <Link
                  href="/servicios/pintura"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Pintura
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/proyectos" className="text-muted-foreground hover:text-foreground transition-colors">
                  Proyectos
                </Link>
              </li>
              <li>
                <Link href="/nosotros" className="text-muted-foreground hover:text-foreground transition-colors">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link
                  href="/preguntas-frecuentes"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Contacto</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <span className="text-muted-foreground block">Ituzaingó 920, Salta Capital</span>
                  <span className="text-muted-foreground block">Ituzaingó 1279, Tartagal, Salta</span>
                  <span className="text-muted-foreground block">Av. Casiano Casas S/N, Campamento Vespucio, Salta</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <a
                    href="tel:+5491127586521"
                    className="text-muted-foreground hover:text-foreground transition-colors block"
                  >
                    +54 9 11 2758-6521 (Sebastian Romero)
                  </a>
                  <a
                    href="tel:+543873522920"
                    className="text-muted-foreground hover:text-foreground transition-colors block"
                  >
                    +54 9 387 352-2920 (Carlos Guerrero)
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-accent flex-shrink-0" />
                <a
                  href="mailto:info@emprenor.com.ar"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  info@emprenor.com.ar
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} EMPRENOR CONSTRUCCIONES. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
