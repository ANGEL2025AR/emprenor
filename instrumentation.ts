export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return

  const { ensureComplianceIndexes } = await import("@/lib/compliance/indexes")
  await ensureComplianceIndexes().catch((err) => {
    console.error("[compliance] No se pudieron crear índices:", err)
  })
}
