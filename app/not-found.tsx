import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-16">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-8xl font-bold text-accent">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">Página no encontrada</h2>
          <p className="text-muted-foreground leading-relaxed">
            Lo sentimos, la página que está buscando no existe o ha sido movida.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Volver al Inicio
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/contacto">
              Contacto
            </Link>
          </Button>
        </div>

        <div className="pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">¿Busca alguno de nuestros servicios?</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Button asChild variant="link" size="sm">
              <Link href="/servicios/construccion">Construcción</Link>
            </Button>
            <Button asChild variant="link" size="sm">
              <Link href="/servicios/remodelacion">Remodelación</Link>
            </Button>
            <Button asChild variant="link" size="sm">
              <Link href="/proyectos">Proyectos</Link>
            </Button>
            <Button asChild variant="link" size="sm">
              <Link href="/nosotros">Nosotros</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
