// Script de verificación del sistema
// Ejecutar con: bun run scripts/verify-system.ts

interface VerificationResult {
  category: string
  checks: Array<{
    name: string
    status: "pass" | "fail" | "warning"
    message: string
  }>
}

const results: VerificationResult[] = []

// Verificar variables de entorno
function checkEnvironmentVariables() {
  const checks: Array<{
    name: string
    status: "pass" | "fail" | "warning"
    message: string
  }> = []

  checks.push({
    name: "MONGODB_URI",
    status: process.env.MONGODB_URI ? "pass" : "fail",
    message: process.env.MONGODB_URI ? "Configurada" : "No configurada - REQUERIDA",
  })

  checks.push({
    name: "JWT_SECRET",
    status: process.env.JWT_SECRET ? "pass" : "warning",
    message: process.env.JWT_SECRET ? "Configurada" : "Usando valor por defecto - Cambiar en producción",
  })

  checks.push({
    name: "BLOB_READ_WRITE_TOKEN",
    status: process.env.BLOB_READ_WRITE_TOKEN ? "pass" : "warning",
    message: process.env.BLOB_READ_WRITE_TOKEN ? "Configurada" : "Opcional - Para upload de archivos",
  })

  results.push({
    category: "Variables de Entorno",
    checks,
  })
}

// Verificar estructura de archivos
function checkFileStructure() {
  const fs = require("fs")
  const path = require("path")

  const checks: Array<{
    name: string
    status: "pass" | "fail" | "warning"
    message: string
  }> = []
  const requiredFiles = [
    "app/(dashboard)/dashboard/page.tsx",
    "app/(dashboard)/layout.tsx",
    "middleware.ts",
    "lib/db/connection.ts",
    "lib/auth/session.ts",
    "components/dashboard/sidebar.tsx",
    "components/dashboard/header.tsx",
  ]

  for (const file of requiredFiles) {
    const exists = fs.existsSync(path.join(process.cwd(), file))
    checks.push({
      name: file,
      status: exists ? "pass" : "fail",
      message: exists ? "Existe" : "No encontrado",
    })
  }

  results.push({
    category: "Estructura de Archivos",
    checks,
  })
}

// Generar reporte
function generateReport() {
  console.log("\n========================================")
  console.log("REPORTE DE VERIFICACIÓN DEL SISTEMA")
  console.log("========================================\n")

  let totalPassed = 0
  let totalFailed = 0
  let totalWarnings = 0

  for (const result of results) {
    console.log(`\n${result.category}:`)
    console.log("─".repeat(40))

    for (const check of result.checks) {
      const icon = check.status === "pass" ? "✅" : check.status === "fail" ? "❌" : "⚠️"
      console.log(`${icon} ${check.name}: ${check.message || check.status}`)

      if (check.status === "pass") totalPassed++
      else if (check.status === "fail") totalFailed++
      else totalWarnings++
    }
  }

  console.log("\n========================================")
  console.log("RESUMEN")
  console.log("========================================")
  console.log(`✅ Pasadas: ${totalPassed}`)
  console.log(`❌ Fallidas: ${totalFailed}`)
  console.log(`⚠️  Advertencias: ${totalWarnings}`)

  if (totalFailed === 0) {
    console.log("\n🎉 SISTEMA LISTO PARA PRODUCCIÓN")
  } else {
    console.log("\n⚠️  CORREGIR ERRORES ANTES DE DESPLEGAR")
  }

  console.log("\n")
}

// Ejecutar verificación
checkEnvironmentVariables()
checkFileStructure()
generateReport()
