"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"

interface Event {
  _id: string
  title: string
  date: string
  type: "proyecto" | "tarea" | "inspeccion" | "pago"
  projectName?: string
  status?: string
}

export default function CalendarClient() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

  useEffect(() => {
    loadEvents()
  }, [currentDate])

  const loadEvents = async () => {
    try {
      setLoading(true)
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth()
      const response = await fetch(`/api/calendar?year=${year}&month=${month + 1}`)
      if (response.ok) {
        const data = await response.json()
        setEvents(data.events || [])
      }
    } catch (error) {
      console.error("[v0] Error loading events:", error)
    } finally {
      setLoading(false)
    }
  }

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }
    return days
  }

  const getEventsForDay = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return events.filter((event) => event.date.startsWith(dateStr))
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const typeColors = {
    proyecto: "bg-blue-500",
    tarea: "bg-purple-500",
    inspeccion: "bg-amber-500",
    pago: "bg-green-500",
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={previousMonth}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={nextMonth}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
              <div key={day} className="text-center font-semibold text-sm text-slate-600 p-2">
                {day}
              </div>
            ))}

            {getDaysInMonth().map((day, index) => (
              <div
                key={index}
                className={`min-h-[100px] border rounded-lg p-2 ${day ? "bg-white hover:bg-slate-50" : "bg-slate-50"}`}
              >
                {day && (
                  <>
                    <div className="font-semibold text-sm text-slate-700 mb-1">{day}</div>
                    <div className="space-y-1">
                      {getEventsForDay(day)
                        .slice(0, 2)
                        .map((event) => (
                          <div
                            key={event._id}
                            className={`text-xs p-1 rounded text-white ${typeColors[event.type]} truncate`}
                          >
                            {event.title}
                          </div>
                        ))}
                      {getEventsForDay(day).length > 2 && (
                        <div className="text-xs text-slate-500">+{getEventsForDay(day).length - 2} más</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Próximos Eventos</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-slate-600">Cargando eventos...</p>
          ) : events.length === 0 ? (
            <p className="text-slate-600">No hay eventos programados este mes</p>
          ) : (
            <div className="space-y-3">
              {events.slice(0, 5).map((event) => (
                <div key={event._id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${typeColors[event.type]}`} />
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-slate-600">{event.projectName || "General"}</p>
                    </div>
                  </div>
                  <div className="text-sm text-slate-600">{new Date(event.date).toLocaleDateString("es-AR")}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
