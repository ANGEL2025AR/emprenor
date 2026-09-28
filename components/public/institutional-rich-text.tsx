import Link from "next/link"
import type { ReactNode } from "react"

const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g

function safeHref(href: string) {
  if (href.startsWith("/") && !href.startsWith("//")) return href
  if (href.startsWith("mailto:") && !/javascript|data:/i.test(href)) return href
  if (href.startsWith("https://")) return href
  return null
}

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = []
  let last = 0
  for (const match of text.matchAll(LINK)) {
    const index = match.index ?? 0
    if (index > last) nodes.push(text.slice(last, index))
    const href = safeHref(match[2])
    if (href) {
      const className = "text-emerald-700 underline"
      nodes.push(
        href.startsWith("/") ? (
          <Link key={`${index}-${href}`} href={href} className={className}>
            {match[1]}
          </Link>
        ) : (
          <a key={`${index}-${href}`} href={href} className={className}>
            {match[1]}
          </a>
        ),
      )
    } else {
      nodes.push(match[0])
    }
    last = index + match[0].length
  }
  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

export function InstitutionalRichText({ body }: { body: string }) {
  const blocks = body
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)

  return (
    <>
      {blocks.map((block) => {
        const lines = block.split("\n").map((line) => line.trim()).filter(Boolean)
        if (lines.length > 0 && lines.every((line) => line.startsWith("- "))) {
          return (
            <ul key={block} className="list-disc pl-5 space-y-2">
              {lines.map((line) => (
                <li key={line}>{renderInline(line.slice(2))}</li>
              ))}
            </ul>
          )
        }
        return <p key={block}>{renderInline(block.replace(/\n/g, " "))}</p>
      })}
    </>
  )
}
