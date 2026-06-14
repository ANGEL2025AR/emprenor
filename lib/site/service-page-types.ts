export type ServiceHeroConfig =
  | {
      type: "page-header"
      title: string
      highlight?: string
      subtitle?: string
    }
  | {
      type: "hero-slider"
      slides?: unknown[]
      minHeight?: string
    }

export type ServiceSectionConfig = Record<string, unknown> & { type: string }

export type ServicePageConfig = {
  pageKey: string
  slug?: string
  catalogTitle?: string
  hero?: ServiceHeroConfig
  sections?: ServiceSectionConfig[]
}
