"use client"

import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  User, MapPin, Phone, Mail, Calendar,
  Briefcase, Building2, Shield,
} from "lucide-react"
import EmployeeDocumentsManager from "@/components/employees/employee-documents-manager"
import { usePermissions } from "@/lib/auth/access-control"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function formatDate(d: string | undefined) {
  if (!d) return "—"
  return new Date(d).toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" })
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | undefined }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b last:border-b-0">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium text-foreground truncate">{value || "—"}</p>
      </div>
    </div>
  )
}

export default function LegajoPage() {
  const { user } = usePermissions()
  const { data } = useSWR("/api/portal/personnel-file", fetcher)

  const personal = data?.personal
  const employment = data?.employment

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mi Legajo Digital</h1>
        <p className="text-muted-foreground">
          Datos personales, laborales y toda tu documentación (ART, certificados, EPP, antecedentes, etc.)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Datos personales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-0">
            <InfoRow
              icon={User}
              label="Nombre completo"
              value={personal?.fullName || (user ? `${user.name} ${user.lastName}` : undefined)}
            />
            <InfoRow icon={User} label="DNI / CUIL" value={personal?.dni ? `${personal.dni} / ${personal.cuil || "—"}` : personal?.cuil} />
            <InfoRow icon={Calendar} label="Fecha de nacimiento" value={formatDate(personal?.birthDate)} />
            <InfoRow icon={MapPin} label="Domicilio" value={personal?.address} />
            <InfoRow icon={Phone} label="Teléfono" value={personal?.phone || user?.phone} />
            <InfoRow icon={Mail} label="Email" value={personal?.email || user?.email} />
            <InfoRow
              icon={Phone}
              label="Contacto de emergencia"
              value={
                personal?.emergencyContact
                  ? `${personal.emergencyContact.name} — ${personal.emergencyContact.phone}`
                  : undefined
              }
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Datos laborales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-0">
            <InfoRow icon={Building2} label="Puesto" value={employment?.position} />
            <InfoRow icon={Building2} label="Departamento" value={employment?.department} />
            <InfoRow icon={Calendar} label="Fecha de ingreso" value={formatDate(employment?.startDate)} />
            <InfoRow icon={Shield} label="Categoría / convenio" value={employment?.category} />
            <InfoRow icon={Briefcase} label="Tipo de contrato" value={employment?.contractType} />
            <InfoRow icon={Shield} label="ART" value={employment?.artProvider} />
            <InfoRow icon={Shield} label="Obra social" value={employment?.healthInsurance} />
            <div className="flex items-start gap-3 py-3">
              <Briefcase className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Estado</p>
                <Badge variant={employment?.status === "activo" ? "default" : "secondary"}>
                  {employment?.status || "—"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <EmployeeDocumentsManager mode="own" />
    </div>
  )
}
