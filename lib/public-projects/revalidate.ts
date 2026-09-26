import { revalidatePath } from "next/cache"

/** Invalida inicio, listado, ficha y mapa del sitio para que un alta o un cambio se vea al instante. */
export function revalidatePublicProjects(id?: string) {
  revalidatePath("/")
  revalidatePath("/proyectos")
  revalidatePath("/sitemap.xml")
  if (id) revalidatePath(`/proyectos/${id}`)
}
