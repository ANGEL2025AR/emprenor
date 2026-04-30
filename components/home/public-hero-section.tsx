import { getSitePageHeroSlides } from "@/lib/site/get-site-page"
import { HeroSlider } from "@/components/home/hero-slider"

export async function PublicHeroSection({
  slug,
  variant,
}: {
  slug: string
  variant: "immersive" | "simple"
}) {
  const slides = await getSitePageHeroSlides(slug)
  return <HeroSlider slides={slides} variant={variant} pageSlug={slug} />
}
