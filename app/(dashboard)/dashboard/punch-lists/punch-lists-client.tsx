"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, CheckCircle2, Clock, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface PunchList {
  _id: string
  listNumber: string
  listName: string
  projectId: string
  status: string
  summary: {
    totalItems: number
    openItems: number
    inProgressItems: number
    resolvedItems: number
    closedItems: number
    criticalItems: number
  }
  createdAt: string
}

interface PunchListsClientProps {
  initialLists: PunchList[]
}

export function PunchListsClient({ initialLists }: PunchListsClientProps) {
  const [lists] = useState<PunchList[]>(initialLists)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "abierta":
        return "bg-blue-100 text-blue-700"
      case "en_progreso":
        return "bg-amber-100 text-amber-700"
      case "completada":
        return "bg-green-100 text-green-700"
      case "cerrada":
        return "bg-slate-100 text-slate-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "abierta":
        return <Clock className="w-4 h-4" />
      case "en_progreso":
        return <AlertTriangle className="w-4 h-4" />
      case "completada":
        return <CheckCircle2 className="w-4 h-4" />
      case "cerrada":
        return <CheckCircle2 className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  if (lists.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <CheckCircle2 className="w-16 h-16 text-slate-300 mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No hay punch lists registradas</h3>
          <p className="text-slate-600 text-center mb-6">
            Comienza a crear listas de pendientes y defectos de tus proyectos
          </p>
          <Button asChild>
            <Link href="/dashboard/punch-lists/nueva">Crear primera punch list</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {lists.map((list) => (
        <Card key={list._id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="outline" className="font-mono">
                    {list.listNumber}
                  </Badge>
                  <Badge className={getStatusColor(list.status)}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(list.status)}
                      {list.status.replace("_", " ")}
                    </span>
                  </Badge>
                </div>

                <h3 className="text-lg font-semibold text-slate-900 mb-1">{list.listName}</h3>
                <p className="text-sm text-slate-600">
                  Creado el {format(new Date(list.createdAt), "dd 'de' MMMM, yyyy", { locale: es })}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4 pt-4 border-t border-slate-200">
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Total Items</p>
                    <p className="text-xl font-bold text-slate-900">{list.summary?.totalItems || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Abiertos</p>
                    <p className="text-xl font-bold text-blue-600">{list.summary?.openItems || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">En Progreso</p>
                    <p className="text-xl font-bold text-amber-600">{list.summary?.inProgressItems || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Resueltos</p>
                    <p className="text-xl font-bold text-green-600">{list.summary?.resolvedItems || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Críticos</p>
                    <p className="text-xl font-bold text-red-600">{list.summary?.criticalItems || 0}</p>
                  </div>
                </div>
              </div>

              <Button variant="outline" size="sm" asChild className="ml-4 bg-transparent">
                <Link href={`/dashboard/punch-lists/${list._id}`}>
                  <Eye className="w-4 h-4 mr-2" />
                  Ver detalles
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
