"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Map, ArrowRight, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WorksMap } from "@/components/map/works-map"
import { ProjectStatusBadge } from "@/components/projects/project-status-badge"
import { ProjectProgressBar } from "@/components/projects/project-progress-bar"
import { STATUS_CONFIG } from "@/lib/site/project-status"
import type { MapProject } from "@/lib/site/project-geo"
import { projectsMapUrl } from "@/lib/site/urls"

export function WorksMapSection() {
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

  const stats = useMemo(() => {
    const counts: Record<string, number> = {}
    projects.forEach((p) => {
      const s = p.status || "Finalizado"
      counts[s] = (counts[s] || 0) + 1
    })
    return counts
  }, [projects])

  const selected = projects.find((p) => p.id === selectedId) || projects[0] || null

  return (
    <section className="py-20 bg-slate-950 text-white overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="grid lg:grid-cols-[1fr_1.15fr] gap-10 lg:gap-14 items-start">
          <div>
            <span className="inline-flex items-center gap-2 text-green-400 font-semibold text-sm tracking-wider uppercase">
              <Map className="w-4 h-4" />
              Mapa de obras
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-3 mb-4 leading-tight">
              Presencia verificable en el <span className="text-green-500">NOA</span>
            </h2>
            <p className="text-white/55 leading-relaxed mb-6 max-w-lg">
              Cada obra publicada con ubicación geográfica se sincroniza automáticamente en el mapa. Consulte el estado y el avance de proyectos en Salta y Jujuy.
            </p>

            {!loading && projects.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {Object.entries(stats).map(([status, count]) => (
                  <span key={status} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/70">
                    <span className="font-bold text-white">{count}</span> {STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]?.label || status}
                  </span>
                ))}
              </div>
            )}

            {selected && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 mb-6">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="font-bold text-white leading-snug">{selected.title}</p>
                    {selected.location && <p className="text-xs text-white/45 mt-1">{selected.location}</p>}
                  </div>
                  <ProjectStatusBadge status={selected.status} />
                </div>
                <ProjectProgressBar progress={selected.progress} status={selected.status} compact />
              </div>
            )}

            <Button className="bg-green-600 hover:bg-green-700 text-white" asChild>
              <Link href={projectsMapUrl()}>
                Ver mapa en proyectos <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          <div className="relative">
            {loading ? (
              <div className="h-[420px] rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white/20 border-t-green-500 rounded-full animate-spin" />
              </div>
            ) : (
              <WorksMap
                projects={projects}
                selectedId={selected?.id}
                onSelect={(p) => setSelectedId(p.id)}
                minHeight={420}
                height={420}
                className="ring-1 ring-white/10"
              />
            )}
            {!loading && projects.length > 0 && (
              <div className="absolute -bottom-3 -right-3 hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl bg-green-600 text-white text-xs font-bold shadow-lg">
                <Layers className="w-3.5 h-3.5" />
                {projects.length} obras en mapa
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
