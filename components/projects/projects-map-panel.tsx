"use client"

import { useEffect, useState } from "react"
import { WorksMap } from "@/components/map/works-map"
import { ProjectStatusBadge } from "@/components/projects/project-status-badge"
import { ProjectProgressBar } from "@/components/projects/project-progress-bar"
import type { MapProject } from "@/lib/site/project-geo"
import { MapPin } from "lucide-react"

export function ProjectsMapPanel() {
  const [projects, setProjects] = useState<MapProject[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/public-projects/map")
      .then((r) => r.json())
      .then((data) => setProjects(data.projects || []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false))
  }, [])

  const selected = projects.find((p) => p.id === selectedId) || null

  if (loading) {
    return (
      <div className="h-[480px] rounded-2xl bg-muted flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-muted-foreground/20 border-t-green-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (!projects.length) {
    return (
      <div className="rounded-2xl border border-border bg-muted/30 p-12 text-center">
        <MapPin className="w-10 h-10 mx-auto mb-4 text-muted-foreground/40" />
        <p className="text-muted-foreground">Aún no hay obras geolocalizadas publicadas. Consulte el portafolio de proyectos abajo.</p>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 items-start">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Seleccione una obra en el mapa para ver su estado operativo y avance. Los datos se sincronizan con el panel de administración.
        </p>
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
          {projects.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedId(p.id)}
              className={`w-full text-left p-4 rounded-xl border transition-colors ${selectedId === p.id ? "border-green-500 bg-green-50/50" : "border-border hover:border-green-200"}`}
            >
              <p className="font-semibold text-sm">{p.title}</p>
              {p.location && <p className="text-xs text-muted-foreground mt-1">{p.location}</p>}
              <div className="mt-2 flex items-center gap-2">
                <ProjectStatusBadge status={p.status} />
              </div>
            </button>
          ))}
        </div>
        {selected && (
          <div className="p-5 rounded-xl border border-border bg-background">
            <p className="font-bold">{selected.title}</p>
            <ProjectProgressBar progress={selected.progress} status={selected.status} className="mt-3" />
          </div>
        )}
      </div>
      <WorksMap projects={projects} selectedId={selectedId || projects[0]?.id} onSelect={(p) => setSelectedId(p.id)} minHeight={480} height={480} />
    </div>
  )
}
