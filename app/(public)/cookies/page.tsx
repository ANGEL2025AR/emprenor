import type { Metadata } from "next"
import { InstitutionalPage } from "@/components/public/institutional-page"

export const metadata: Metadata = {
  title: "Política de cookies | EMPRENOR",
  description: "Uso de cookies y tecnologías similares en emprenor.com.ar",
}

export default function CookiesPage() {
  return (
    <InstitutionalPage
      slug="cookies"
      title="Política de cookies"
      subtitle="Información sobre cookies y preferencias en nuestro sitio web."
      sections={[
        {
          title: "¿Qué son las cookies?",
          content: (
            <p>
              Son archivos pequeños que el navegador guarda para recordar preferencias, mantener sesiones seguras en el
              portal y medir el rendimiento del sitio.
            </p>
          ),
        },
        {
          title: "Cookies que utilizamos",
          content: (
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Esenciales:</strong> sesión de usuario (`emprenor_session`) para acceder al dashboard y portales.
              </li>
              <li>
                <strong>Analíticas:</strong> métricas agregadas de uso (por ejemplo Vercel Analytics) para mejorar el sitio.
              </li>
              <li>
                <strong>Preferencias:</strong> idioma y configuración de interfaz cuando aplique.
              </li>
            </ul>
          ),
        },
        {
          title: "Cómo gestionarlas",
          content: (
            <p>
              Puede bloquear o eliminar cookies desde la configuración de su navegador. Si desactiva cookies esenciales,
              algunas funciones del portal (login, seguimiento de obra) podrían no funcionar correctamente.
            </p>
          ),
        },
      ]}
      cta={{ label: "Volver al inicio", href: "/" }}
    />
  )
}
