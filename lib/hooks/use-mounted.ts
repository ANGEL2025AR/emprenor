import { useSyncExternalStore } from "react"

/** true solo en el cliente, tras hidratar (evita mismatch con portales Radix / extensiones). */
export function useMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )
}
