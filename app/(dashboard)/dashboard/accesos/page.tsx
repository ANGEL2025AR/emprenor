import { requirePermission } from "@/lib/auth/require-permission"
import { PendingAccessClient } from "@/components/dashboard/pending-access-client"

export const metadata = {
  title: "Solicitudes de acceso | EMPRENOR",
  description: "Activar cuentas de clientes registradas desde el sitio web",
}

export default async function AccesosPage() {
  await requirePermission("users.view")
  return <PendingAccessClient />
}
