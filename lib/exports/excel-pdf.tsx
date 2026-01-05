import { format } from "date-fns"
import { es } from "date-fns/locale"

export interface ExportColumn {
  key: string
  header: string
  width?: number
  format?: "text" | "number" | "currency" | "date" | "percentage"
}

export interface ExportOptions {
  title: string
  subtitle?: string
  columns: ExportColumn[]
  data: Record<string, unknown>[]
  filename: string
  companyName?: string
  generatedBy?: string
}

export function exportToCSV(options: ExportOptions): void {
  const { title, columns, data, filename } = options

  const headers = columns.map((col) => col.header).join(",")
  const rows = data.map((row) =>
    columns
      .map((col) => {
        const value = row[col.key]
        if (value === null || value === undefined) return ""
        if (typeof value === "string" && value.includes(",")) return `"${value}"`
        return String(value)
      })
      .join(","),
  )

  const csvContent = [
    `# ${title}`,
    `# Generado: ${format(new Date(), "PPpp", { locale: es })}`,
    "",
    headers,
    ...rows,
  ].join("\n")

  const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = `${filename}-${format(new Date(), "yyyy-MM-dd")}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function exportToExcel(options: ExportOptions): void {
  const { title, columns, data, filename, companyName, generatedBy } = options

  // Crear contenido HTML que Excel puede abrir
  let html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
    <head>
      <meta charset="UTF-8">
      <style>
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #22c55e; color: white; font-weight: bold; }
        .header { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
        .subheader { font-size: 12px; color: #666; margin-bottom: 20px; }
        .currency { text-align: right; }
        .number { text-align: right; }
        tr:nth-child(even) { background-color: #f9f9f9; }
      </style>
    </head>
    <body>
      ${companyName ? `<div class="header">${companyName}</div>` : ""}
      <div class="header">${title}</div>
      <div class="subheader">
        Generado: ${format(new Date(), "PPpp", { locale: es })}
        ${generatedBy ? ` | Por: ${generatedBy}` : ""}
      </div>
      <table>
        <thead>
          <tr>
            ${columns.map((col) => `<th>${col.header}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
  `

  data.forEach((row) => {
    html += "<tr>"
    columns.forEach((col) => {
      const value = row[col.key]
      let displayValue = ""
      let className = ""

      if (value !== null && value !== undefined) {
        switch (col.format) {
          case "currency":
            displayValue = `$${Number(value).toLocaleString("es-AR", { minimumFractionDigits: 2 })}`
            className = "currency"
            break
          case "number":
            displayValue = Number(value).toLocaleString("es-AR")
            className = "number"
            break
          case "percentage":
            displayValue = `${Number(value).toFixed(1)}%`
            className = "number"
            break
          case "date":
            displayValue =
              value instanceof Date
                ? format(value, "dd/MM/yyyy", { locale: es })
                : format(new Date(String(value)), "dd/MM/yyyy", { locale: es })
            break
          default:
            displayValue = String(value)
        }
      }

      html += `<td class="${className}">${displayValue}</td>`
    })
    html += "</tr>"
  })

  html += `
        </tbody>
      </table>
    </body>
    </html>
  `

  const blob = new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8;" })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = `${filename}-${format(new Date(), "yyyy-MM-dd")}.xls`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function generatePrintableHTML(options: ExportOptions): string {
  const { title, columns, data, companyName, generatedBy } = options

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <style>
        @media print {
          body { font-family: Arial, sans-serif; font-size: 12px; }
          .no-print { display: none; }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; page-break-after: auto; }
        }
        body { font-family: Arial, sans-serif; padding: 20px; }
        .header { text-align: center; margin-bottom: 20px; }
        .company-name { font-size: 24px; font-weight: bold; color: #22c55e; }
        .report-title { font-size: 18px; margin-top: 10px; }
        .report-info { font-size: 12px; color: #666; margin-top: 5px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #22c55e; color: white; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #666; }
        .signature-area { margin-top: 50px; display: flex; justify-content: space-between; }
        .signature-box { width: 200px; text-align: center; }
        .signature-line { border-top: 1px solid #000; margin-top: 50px; padding-top: 5px; }
        .print-btn { 
          position: fixed; top: 10px; right: 10px; 
          padding: 10px 20px; background: #22c55e; color: white;
          border: none; cursor: pointer; border-radius: 5px;
        }
      </style>
    </head>
    <body>
      <button class="print-btn no-print" onclick="window.print()">Imprimir</button>
      
      <div class="header">
        ${companyName ? `<div class="company-name">${companyName}</div>` : ""}
        <div class="report-title">${title}</div>
        <div class="report-info">
          Generado: ${format(new Date(), "PPpp", { locale: es })}
          ${generatedBy ? ` | Por: ${generatedBy}` : ""}
        </div>
      </div>

      <table>
        <thead>
          <tr>
            ${columns.map((col) => `<th>${col.header}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${data
            .map(
              (row) => `
            <tr>
              ${columns
                .map((col) => {
                  const value = row[col.key]
                  let displayValue = ""
                  if (value !== null && value !== undefined) {
                    switch (col.format) {
                      case "currency":
                        displayValue = `$${Number(value).toLocaleString("es-AR", { minimumFractionDigits: 2 })}`
                        break
                      case "number":
                        displayValue = Number(value).toLocaleString("es-AR")
                        break
                      case "percentage":
                        displayValue = `${Number(value).toFixed(1)}%`
                        break
                      case "date":
                        displayValue =
                          value instanceof Date
                            ? format(value, "dd/MM/yyyy", { locale: es })
                            : format(new Date(String(value)), "dd/MM/yyyy", { locale: es })
                        break
                      default:
                        displayValue = String(value)
                    }
                  }
                  return `<td>${displayValue}</td>`
                })
                .join("")}
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>

      <div class="signature-area">
        <div class="signature-box">
          <div class="signature-line">Firma Responsable</div>
        </div>
        <div class="signature-box">
          <div class="signature-line">Firma Cliente</div>
        </div>
      </div>

      <div class="footer">
        Documento generado automáticamente por EMPRENOR - Sistema de Gestión de Construcción<br>
        Este documento tiene validez legal según normativa vigente
      </div>
    </body>
    </html>
  `
}

export function printReport(options: ExportOptions): void {
  const html = generatePrintableHTML(options)
  const printWindow = window.open("", "_blank")
  if (printWindow) {
    printWindow.document.write(html)
    printWindow.document.close()
  }
}
