"use client"

import { toast } from "@/hooks/use-toast"

export interface DeleteOptions {
  endpoint: string
  entityName: string
  onSuccess?: () => void
  confirmTitle?: string
  confirmDescription?: string
}

export async function handleDeleteWithConfirmation(id: string, options: DeleteOptions): Promise<boolean> {
  const {
    endpoint,
    entityName,
    onSuccess,
    confirmTitle = `¿Eliminar ${entityName}?`,
    confirmDescription = `Esta acción no se puede deshacer. Se eliminará permanentemente este ${entityName}.`,
  } = options

  const confirmed = window.confirm(`${confirmTitle}\n\n${confirmDescription}`)

  if (!confirmed) return false

  try {
    const response = await fetch(`${endpoint}/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error(`Error al eliminar ${entityName}`)
    }

    toast({
      title: "Éxito",
      description: `${entityName} eliminado correctamente`,
    })

    if (onSuccess) {
      onSuccess()
    }

    return true
  } catch (error) {
    console.error(`Error deleting ${entityName}:`, error)
    toast({
      title: "Error",
      description: `No se pudo eliminar el ${entityName}`,
      variant: "destructive",
    })
    return false
  }
}

export function formatCurrency(amount: number, currency = "ARS"): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date))
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}
