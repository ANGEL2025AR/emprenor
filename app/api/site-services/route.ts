import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { getPublishedServices } from "@/lib/site/get-services"

export async function GET(request: NextRequest) {
  try {
    const publishedOnly = request.nextUrl.searchParams.get("published") !== "false"
    const services = publishedOnly
      ? await getPublishedServices()
      : await getPublishedServices()

    return NextResponse.json({
      services: services.map((s) => ({
        slug: s.slug,
        title: s.title,
        shortDescription: s.shortDescription,
        icon: s.icon,
        colorGradient: s.colorGradient,
        features: s.features,
        heroImage: s.heroImage,
        href: `/servicios/${s.slug}`,
      })),
    })
  } catch (error) {
    console.error("[site-services GET]", error)
    return NextResponse.json({ error: "Error al leer servicios" }, { status: 500 })
  }
}

export function revalidateServicePaths(slug?: string) {
  revalidatePath("/servicios")
  revalidatePath("/")
  if (slug) revalidatePath(`/servicios/${slug}`)
}
