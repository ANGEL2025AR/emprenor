"use client"

import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  User, FileText, MapPin, Phone, Mail, Calendar,
  Briefcase, Building2, Shield, Clock, CreditCard,
} from "lucide-react"

const fetcher = (url: string) => fetch(url).then(r => r.json())

function formatDate(d: string | undefined) {
  if (!d) return "---"
  return new Date(d).toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" })
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string | undefined }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b last:border-b-0">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium text-foreground truncate">{value || "---"}</p>
      </div>
    </div>
  )
}

export default function LegajoPage() {
  const { data } = useSWR("/api/portal/personnel-file", fetcher)

  const personal = data?.personal
  const employment = data?.employment
  const documents = data?.documents ?? []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mi Legajo Digital</h1>
        <p className="text-muted-foreground">Informacion personal, laboral y documentacion</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Datos Personales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-0">
            <InfoRow icon={User} label="Nombre Completo" value={personal?.fullName} />
            <InfoRow icon={CreditCard} label="DNI / CUIL" value={personal?.dni ? `${personal.dni} / ${personal.cuil || "---"}` : undefined} />
            <InfoRow icon={Calendar} label="Fecha de Nacimiento" value={formatDate(personal?.birthDate)} />
            <InfoRow icon={MapPin} label="Domicilio" value={personal?.address} />
            <InfoRow icon={Phone} label="Telefono" value={personal?.phone} />
            <InfoRow icon={Mail} label="Email" value={personal?.email} />
            <InfoRow icon={Phone} label="Contacto de Emergencia" value={personal?.emergencyContact ? `${personal.emergencyContact.name} - ${personal.emergencyContact.phone}` : undefined} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Datos Laborales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-0">
            <InfoRow icon={Building2} label="Puesto" value={employment?.position} />
            <InfoRow icon={Building2} label="Departamento" value={employment?.department} />
            <InfoRow icon={Calendar} label="Fecha de Ingreso" value={formatDate(employment?.startDate)} />
            <InfoRow icon={Shield} label="Categoria / Convenio" value={employment?.category} />
            <InfoRow icon={Clock} label="Tipo de Contrato" value={employment?.contractType} />
            <InfoRow icon={Shield} label="ART" value={employment?.artProvider} />
            <InfoRow icon={Shield} label="Obra Social" value={employment?.healthInsurance} />
            <div className="flex items-start gap-3 py-3">
              <Briefcase className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Estado</p>
                <Badge variant={employment?.status === "activo" ? "default" : "secondary"}>
                  {employment?.status || "---"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documentacion en Legajo
          </CardTitle>
          <CardDescription>Documentos cargados en tu legajo digital</CardDescription>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p>No hay documentos en tu legajo</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {documents.map((doc: any) => (
                <div key={doc._id || doc.name} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                  <div className="p-2 rounded bg-blue-100 text-blue-600 shrink-0">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">{doc.type || "Documento"} - {formatDate(doc.uploadedAt)}</p>
                  </div>
                  <Badge variant="outline" className="shrink-0 text-xs">{doc.status || "Vigente"}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
