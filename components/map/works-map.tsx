"use client"

import { useEffect, useMemo, useRef } from "react"
import Link from "next/link"
import { MapPin, ArrowRight } from "lucide-react"
import type { MapProject } from "@/lib/site/project-geo"
import { NOA_MAP_DEFAULT } from "@/lib/site/project-geo"
import { STATUS_CONFIG, STATUS_MARKER_COLORS, normalizeProjectStatus } from "@/lib/site/project-status"
import { ProjectStatusBadge } from "@/components/projects/project-status-badge"
import { ProjectProgressBar } from "@/components/projects/project-progress-bar"
import { projectsMapUrl } from "@/lib/site/urls"
import "leaflet/dist/leaflet.css"

type Props = {
  projects?: MapProject[]
  selectedId?: string | null
  onSelect?: (project: MapProject) => void
  height?: number | string
  minHeight?: number
  showLegend?: boolean
  interactive?: boolean
  className?: string
}

function createStatusIcon(L: typeof import("leaflet"), status: string, selected = false) {
  const key = normalizeProjectStatus(status)
  const color = STATUS_MARKER_COLORS[key] || STATUS_MARKER_COLORS.Finalizado
  const size = selected ? 18 : 14
  const ring = selected ? "0 0 0 3px rgba(34,197,94,0.45)" : "0 2px 8px rgba(0,0,0,0.35)"
  return L.divIcon({
    className: "",
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2.5px solid white;box-shadow:${ring}"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  })
}

export function WorksMap({
  projects = [],
  selectedId = null,
  onSelect,
  height = "100%",
  minHeight = 420,
  showLegend = true,
  interactive = true,
  className = "",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<import("leaflet").Map | null>(null)
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect

  const validProjects = useMemo(
    () => projects.filter((p) => p.coordinates?.lat != null && p.coordinates?.lng != null),
    [projects],
  )

  const selected = validProjects.find((p) => p.id === selectedId) || null

  useEffect(() => {
    if (!containerRef.current || validProjects.length === 0) return

    let cancelled = false

    ;(async () => {
      const L = (await import("leaflet")).default

      if (cancelled || !containerRef.current) return

      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }

      const map = L.map(containerRef.current, {
        center: [NOA_MAP_DEFAULT.center.lat, NOA_MAP_DEFAULT.center.lng],
        zoom: NOA_MAP_DEFAULT.zoom,
        scrollWheelZoom: interactive,
        dragging: interactive,
        zoomControl: interactive,
      })

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map)

      validProjects.forEach((project) => {
        const marker = L.marker([project.coordinates!.lat, project.coordinates!.lng], {
          icon: createStatusIcon(L, project.status || "Finalizado", project.id === selectedId),
        })
        marker.on("click", () => onSelectRef.current?.(project))
        marker.bindPopup(`
          <div style="min-width:200px">
            <p style="font-weight:700;font-size:14px;margin:0 0 4px">${project.title}</p>
            ${project.location ? `<p style="font-size:12px;color:#64748b;margin:0">${project.location}</p>` : ""}
          </div>
        `)
        marker.addTo(map)
      })

      if (validProjects.length === 1) {
        map.setView([validProjects[0].coordinates!.lat, validProjects[0].coordinates!.lng], 10)
      } else {
        const bounds = L.latLngBounds(validProjects.map((p) => [p.coordinates!.lat, p.coordinates!.lng] as [number, number]))
        map.fitBounds(bounds, { padding: [48, 48], maxZoom: 11 })
      }

      mapRef.current = map
      setTimeout(() => map.invalidateSize(), 100)
    })()

    return () => {
      cancelled = true
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [validProjects, interactive, selectedId])

  useEffect(() => {
    if (!selected?.coordinates || !mapRef.current) return
    mapRef.current.flyTo([selected.coordinates.lat, selected.coordinates.lng], Math.max(mapRef.current.getZoom(), 11), { duration: 0.6 })
  }, [selected?.id, selected?.coordinates?.lat, selected?.coordinates?.lng])

  if (!validProjects.length) {
    return (
      <div
        className={`flex items-center justify-center bg-muted rounded-2xl border border-border text-muted-foreground text-sm ${className}`}
        style={{ height, minHeight }}
      >
        <div className="text-center px-6">
          <MapPin className="w-8 h-8 mx-auto mb-3 text-muted-foreground/40" />
          <p>No hay obras geolocalizadas para mostrar en el mapa.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-border shadow-inner ${className}`} style={{ height, minHeight }}>
      <div ref={containerRef} className="h-full w-full z-0" style={{ height: "100%", minHeight }} />

      {showLegend && (
        <div className="absolute bottom-4 left-4 z-[1000] bg-background/95 backdrop-blur-sm rounded-xl border border-border px-3 py-2.5 shadow-lg">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Estado de obra</p>
          <div className="flex flex-wrap gap-x-3 gap-y-1.5">
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <span key={key} className="inline-flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium">
                <span className="w-2.5 h-2.5 rounded-full border border-white shadow-sm" style={{ background: STATUS_MARKER_COLORS[key as keyof typeof STATUS_MARKER_COLORS] }} />
                {cfg.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {selected && onSelect && (
        <div className="absolute top-4 right-4 z-[1000] max-w-xs bg-background/95 backdrop-blur-sm rounded-xl border border-border p-4 shadow-xl hidden md:block">
          <p className="font-bold text-sm leading-snug mb-1">{selected.title}</p>
          {selected.location && <p className="text-xs text-muted-foreground mb-3">{selected.location}</p>}
          <ProjectStatusBadge status={selected.status} className="mb-3" />
          <ProjectProgressBar progress={selected.progress} status={selected.status} compact />
          <Link href={projectsMapUrl()} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-green-600 hover:text-green-700">
            Ver portafolio <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}
    </div>
  )
}
