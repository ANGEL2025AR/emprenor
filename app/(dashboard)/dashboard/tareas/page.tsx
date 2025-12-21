import { getCurrentUser } from "@/lib/auth/session"
import { redirect } from "next/navigation"
import { TareasPageClient } from "./tareas-page-client"

export const metadata = {
  title: "Tareas | EMPRENOR",
  description: "Gestión de tareas y asignaciones",
}

export default async function TasksPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return <TareasPageClient />
}
