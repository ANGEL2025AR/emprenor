export function currentPeriod(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, "0")
  return `${y}-${m}`
}

export function periodLabel(period: string): string {
  const [y, m] = period.split("-")
  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
  ]
  const idx = Number.parseInt(m || "1", 10) - 1
  return `${months[idx] ?? m} ${y}`
}
