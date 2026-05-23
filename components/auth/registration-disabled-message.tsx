import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LOGO_LIGHT } from "@/lib/brand/logo"
import { EMPRENOR_BRAND } from "@/lib/company/constants"

export function RegistrationDisabledMessage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-green-50 p-4">
      <Card className="w-full max-w-lg border-0 shadow-xl">
        <CardHeader className="text-center space-y-4">
          <Image
            src={LOGO_LIGHT.src}
            alt="EMPRENOR"
            width={LOGO_LIGHT.width}
            height={LOGO_LIGHT.height}
            unoptimized
            className="h-10 w-auto mx-auto"
          />
          <CardTitle>Registro no disponible</CardTitle>
          <CardDescription>
            El alta automática de clientes no está habilitada en este entorno. Solicitá acceso a {EMPRENOR_BRAND.siglas}{" "}
            o contactanos.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
            <Link href="/contacto">Contactar a EMPRENOR</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/login">Volver al inicio de sesión</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
