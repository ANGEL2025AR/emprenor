import type { PublicImageFolder } from "@/lib/uploads/public-image"

export async function uploadPublicImageFromPc(
  file: File,
  folder: PublicImageFolder = "site",
): Promise<string> {
  const body = new FormData()
  body.append("file", file)
  body.append("folder", folder)

  const res = await fetch("/api/site/upload-image", {
    method: "POST",
    body,
    credentials: "include",
  })

  const data = (await res.json()) as { url?: string; error?: string; success?: boolean }
  if (!res.ok || !data.url) {
    throw new Error(data.error || "No se pudo subir la imagen")
  }
  return data.url
}
