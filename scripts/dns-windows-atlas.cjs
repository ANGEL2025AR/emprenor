/** Preload en Windows: Node a veces no resuelve SRV de MongoDB Atlas con el DNS del sistema. */
if (process.platform === "win32") {
  try {
    require("node:dns").setServers(["8.8.8.8", "1.1.1.1"])
  } catch {
    /* usar DNS del sistema */
  }
}
