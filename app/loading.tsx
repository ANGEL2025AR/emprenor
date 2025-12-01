import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <main className="flex flex-col">
      {/* Hero Skeleton */}
      <section className="bg-primary/10 animate-pulse">
        <div className="container px-4 py-24 md:px-6 lg:py-32">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <Skeleton className="h-8 w-64 mx-auto" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-24 w-full" />
            <div className="flex gap-4 justify-center pt-4">
              <Skeleton className="h-12 w-48" />
              <Skeleton className="h-12 w-32" />
            </div>
          </div>
        </div>
      </section>

      {/* Content Skeleton */}
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
