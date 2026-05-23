import { notFound } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Building2,
  FileText,
  Edit,
  UserPlus,
  FolderKanban,
  ClipboardList,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getClientById } from "@/lib/clients/get-client-by-id"
import { ComplianceSetupChecklist } from "@/components/compliance/compliance-setup-checklist"

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const client = await getClientById(id)

  if (!client) {
    notFound()
  }

  const hasProject = client.linkedProjects.length > 0
  const hasPortalUser = client.portalUsers.length > 0
  const hasActivePortal = client.stats.complianceActive > 0

  const setupSteps = [
    {
      id: "client",
      label: "Cliente registrado con tipo de cumplimiento",
      description: client.complianceLabel,
      done: true,
    },
    {
      id: "project",
      label: "Proyecto vinculado",
      description: "Creá una obra y elegí este cliente en el selector.",
      done: hasProject,
      href: hasProject ? undefined : `/dashboard/proyectos/nuevo?clientId=${id}`,
      hrefLabel: "Nuevo proyecto",
    },
    {
      id: "portal",
      label: "Portal de cumplimiento activado en al menos una obra",
      description: "Configuración → habilitar portal en Portal del cliente.",
      done: hasActivePortal,
      href: hasProject
        ? `/dashboard/proyectos/${client.linkedProjects[0]?._id}/cumplimiento-cliente?tab=config`
        : undefined,
      hrefLabel: "Activar portal",
    },
    {
      id: "user",
      label: "Usuario portal (rol cliente) creado",
      description: "Acceso con email y contraseña. Podés crearlo al dar de alta el cliente o desde aquí.",
      done: hasPortalUser,
      href: `/dashboard/usuarios/nuevo?role=cliente&linkedClientId=${id}&email=${encodeURIComponent(client.email)}&name=${encodeURIComponent(client.name)}`,
      hrefLabel: "Crear usuario",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/clientes">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{client.company || client.name}</h1>
            <p className="text-muted-foreground">{client.company ? client.name : "Cliente"}</p>
            <Badge variant="secondary" className="mt-2">
              {client.complianceLabel}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/usuarios/nuevo?role=cliente&linkedClientId=${id}&email=${encodeURIComponent(client.email)}&name=${encodeURIComponent(client.name)}`}>
              <UserPlus className="w-4 h-4 mr-2" />
              Usuario portal
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/dashboard/clientes/${id}/editar`}>
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Link>
          </Button>
        </div>
      </div>

      <ComplianceSetupChecklist title="Guía EMPRENOR — dejar listo el portal del cliente" steps={setupSteps} />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Información de Contacto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{client.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Teléfono</p>
                <p className="font-medium">{client.phone || "—"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Dirección</p>
                <p className="font-medium">{client.address || "—"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Información Fiscal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">CUIT/CUIL</p>
                <p className="font-medium">{client.cuit || "No especificado"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Condición Fiscal</p>
                <Badge variant="secondary">{client.taxCondition || "No especificado"}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FolderKanban className="h-5 w-5" />
            Obras vinculadas
          </CardTitle>
          <Button size="sm" asChild>
            <Link href={`/dashboard/proyectos/nuevo?clientId=${id}`}>Nueva obra</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {client.linkedProjects.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              Sin proyectos. Creá una obra y seleccioná este cliente para copiar tipo de cumplimiento automáticamente.
            </p>
          ) : (
            <div className="space-y-2">
              {client.linkedProjects.map((p) => (
                <div
                  key={p._id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.code} · {p.status}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={p.complianceEnabled ? "default" : "secondary"}>
                      {p.complianceEnabled ? "Portal activo" : "Portal inactivo"}
                    </Badge>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/proyectos/${p._id}`}>Obra</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/proyectos/${p._id}/cumplimiento-cliente`}>
                        <ClipboardList className="h-3 w-3 mr-1" />
                        Portal
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usuarios portal (acceso cliente)</CardTitle>
        </CardHeader>
        <CardContent>
          {client.portalUsers.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Ningún usuario con rol cliente. Creá uno para que el contratante vea avance y cumplimiento.
            </p>
          ) : (
            <ul className="space-y-2">
              {client.portalUsers.map((u) => (
                <li key={u._id} className="flex justify-between items-center border rounded-lg p-3 text-sm">
                  <span>
                    {u.name} · {u.email}
                  </span>
                  <Badge variant={u.isActive ? "default" : "secondary"}>{u.isActive ? "Activo" : "Inactivo"}</Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Estadísticas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground">Proyectos</p>
              <p className="text-2xl font-bold">{client.stats.projects}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Portales activos</p>
              <p className="text-2xl font-bold">{client.stats.complianceActive}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total facturado</p>
              <p className="text-2xl font-bold">${client.stats.totalInvoiced.toLocaleString("es-AR")}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cliente desde</p>
              <p className="text-xl font-bold">{new Date(client.createdAt).toLocaleDateString("es-AR")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {client.notes ? (
        <Card>
          <CardHeader>
            <CardTitle>Notas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap">{client.notes}</p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
