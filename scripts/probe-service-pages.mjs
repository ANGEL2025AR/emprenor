const slugs = ["construccion", "remodelacion", "albanileria", "pintura"]
const base = process.argv[2] ?? "http://localhost:3001"

for (const slug of slugs) {
  const url = `${base}/servicios/${slug}`
  const res = await fetch(url, { redirect: "manual" })
  const html = await res.text()
  const heroH1 = html.match(/data-service-hero="true"[^>]*>([\s\S]*?)<\/h1>/i)
    ?? html.match(/<h1[^>]*class="[^"]*font-black[^"]*"[^>]*>([\s\S]*?)<\/h1>/i)
  const heroText = heroH1?.[1]?.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() ?? null
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i)
  console.log(
    JSON.stringify({
      slug,
      status: res.status,
      redirect: res.headers.get("location"),
      title: titleMatch?.[1] ?? null,
      hero: heroText,
    }),
  )
}
