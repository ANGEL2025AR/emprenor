import { requirePermission } from "@/lib/auth/require-permission"
import { RolesAdminClient } from "./roles-admin-client"

export const metadata = {
  title: "Gestión de Roles y Permisos | EMPRENOR",
  description: "Administrar roles y permisos del sistema",
}

export default async function RolesAdminPage() {
  await requirePermission("admin.roles")
  return <RolesAdminClient />
}
