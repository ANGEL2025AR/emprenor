"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Plus, Zap, Mail, Calendar, FileText, DollarSign, Users } from "lucide-react"
import Link from "next/link"

interface Automation {
  _id: string
  name: string
  description: string
  type: string
  trigger: string
  actions: string[]
  enabled: boolean
  executionCount: number
}

export default function AutomationsClient() {
  const [automations, setAutomations] = useState<Automation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAutomations()
  }, [])

  const fetchAutomations = async () => {
    try {
      const response = await fetch("/api/automations")
      if (response.ok) {
        const data = await response.json()
        setAutomations(data.automations || [])
      }
    } catch (error) {
      console.error("Error fetching automations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleAutomation = async (id: string, enabled: boolean) => {
    try {
      await fetch(`/api/automations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled }),
      })
      setAutomations(automations.map((a) => (a._id === id ? { ...a, enabled } : a)))
    } catch (error) {
      console.error("Error toggling automation:", error)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "quotation":
        return FileText
      case "payment":
        return DollarSign
      case "reminder":
        return Calendar
      case "email":
        return Mail
      case "client":
        return Users
      default:
        return Zap
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "quotation":
        return "bg-blue-100 text-blue-800"
      case "payment":
        return "bg-green-100 text-green-800"
      case "reminder":
        return "bg-orange-100 text-orange-800"
      case "email":
        return "bg-purple-100 text-purple-800"
      case "client":
        return "bg-pink-100 text-pink-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">Cargando automatizaciones...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button asChild>
          <Link href="/dashboard/automatizaciones/nueva">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Automatización
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {automations.map((automation) => {
          const Icon = getTypeIcon(automation.type)
          return (
            <Card key={automation._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{automation.name}</CardTitle>
                      <Badge className={`${getTypeColor(automation.type)} mt-1`}>{automation.type}</Badge>
                    </div>
                  </div>
                  <Switch
                    checked={automation.enabled}
                    onCheckedChange={(checked) => toggleAutomation(automation._id, checked)}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription>{automation.description}</CardDescription>

                <div className="pt-4 border-t">
                  <div className="text-sm text-muted-foreground mb-2">Disparador:</div>
                  <div className="text-sm font-medium">{automation.trigger}</div>
                </div>

                <div className="pt-4 border-t">
                  <div className="text-sm text-muted-foreground mb-2">Acciones:</div>
                  <ul className="text-sm space-y-1">
                    {automation.actions.map((action, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Ejecutada</span>
                  <span className="font-semibold">{automation.executionCount} veces</span>
                </div>

                <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                  <Link href={`/dashboard/automatizaciones/${automation._id}`}>Ver Detalles</Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {automations.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Zap className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay automatizaciones configuradas</h3>
            <p className="text-muted-foreground mb-6">
              Crea flujos automáticos para ahorrar tiempo y mejorar la eficiencia
            </p>
            <Button asChild>
              <Link href="/dashboard/automatizaciones/nueva">
                <Plus className="w-4 h-4 mr-2" />
                Crear Primera Automatización
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
