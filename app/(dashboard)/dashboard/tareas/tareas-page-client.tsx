"use client"

import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { TasksClient } from "@/components/tasks/tasks-client"
import Link from "next/link"
import { Plus } from "lucide-react"

export function TareasPageClient() {
  return (
    <div className="flex-1 space-y-6 p-6 pt-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tareas</h2>
          <p className="text-muted-foreground mt-1">Gestiona tareas y asignaciones de proyectos</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/tareas/nueva">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Tarea
          </Link>
        </Button>
      </div>

      <Suspense fallback={<div>Cargando...</div>}>
        <TasksClient />
      </Suspense>
    </div>
  )
}
