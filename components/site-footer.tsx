import Link from "next/link"
import Image from "next/image"
import { LOGO_LIGHT } from "@/lib/brand/logo"
import {
  EMPRENOR_BRAND,
  EMPRENOR_CONTACTOS,
  EMPRENOR_FOOTER_TAGLINE,
  EMPRENOR_LEGAL,
  EMPRENOR_SOCIAL,
  FOOTER_LEGAL_LINKS,
} from "@/lib/company/constants"
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container px-4 py-12 md:px-6 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src={LOGO_LIGHT.src}
                alt="EMPRENOR Logo"
                width={LOGO_LIGHT.width}
                height={LOGO_LIGHT.height}
                unoptimized
                className="h-9 w-auto"
              />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Construyendo el futuro con excelencia, calidad y compromiso. Más de 15 años de experiencia en proyectos
              residenciales, comerciales e industriales.
            </p>
            <p className="text-xs text-muted-foreground">{EMPRENOR_FOOTER_TAGLINE}</p>
            <div className="flex gap-3">
              <Link
                href={EMPRENOR_SOCIAL.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                aria-label="Síguenos en Facebook"
              >
                <Facebook className="h-4 w-4" />
              </Link>
              <Link
                href={EMPRENOR_SOCIAL.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                aria-label="Síguenos en Instagram"
              >
                <Instagram className="h-4 w-4" />
              </Link>
              <Link
                href={EMPRENOR_SOCIAL.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                aria-label="Síguenos en LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </Link>
            </div>
          </div>

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
              <li>
                <Link href="/licitaciones" className="text-muted-foreground hover:text-foreground transition-colors">
                  Licitaciones
                </Link>
              </li>
              <li>
                <Link href="/trabaja-con-nosotros" className="text-muted-foreground hover:text-foreground transition-colors">
                  Trabajá con nosotros
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Legal y ética</h3>
            <ul className="space-y-2 text-sm">
              {FOOTER_LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Contacto</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  {EMPRENOR_LEGAL.oficinasOperativas.map((oficina) => (
                    <span key={oficina.nombre} className="text-muted-foreground block">
                      {oficina.direccion.split(",")[0]}
                    </span>
                  ))}
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  {EMPRENOR_CONTACTOS.map((contacto) => (
                    <a
                      key={contacto.telHref}
                      href={`tel:${contacto.telHref}`}
                      className="text-muted-foreground hover:text-foreground transition-colors block"
                    >
                      {contacto.telefono} ({contacto.nombre})
                    </a>
                  ))}
                </div>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-accent flex-shrink-0" />
                <a
                  href={`mailto:${EMPRENOR_LEGAL.emailGeneral}`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {EMPRENOR_LEGAL.emailGeneral}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} {EMPRENOR_BRAND.nombreExtendido}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
