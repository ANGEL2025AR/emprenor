import { requirePermission } from "@/lib/auth/require-permission"
import { ContactosAdminClient } from "./contactos-admin-client"

export const metadata = {
  title: "Gestión de Contactos | EMPRENOR",
  description: "Administrar consultas recibidas desde el formulario de contacto web",
}

export default async function ContactosAdminPage() {
  const user = await requirePermission("contacts.view")
  return <ContactosAdminClient currentUser={user} />
}
