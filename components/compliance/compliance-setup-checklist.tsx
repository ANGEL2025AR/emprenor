import Link from "next/link"
import { CheckCircle2, Circle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export type ComplianceSetupStep = {
  id: string
  label: string
  description: string
  done: boolean
  href?: string
  hrefLabel?: string
}

export function ComplianceSetupChecklist({
  title = "Próximos pasos — portal del cliente",
  steps,
}: {
  title?: string
  steps: ComplianceSetupStep[]
}) {
  const pending = steps.find((s) => !s.done)
  const allDone = steps.every((s) => s.done)

  return (
    <Card className={allDone ? "border-emerald-200 bg-emerald-50/30" : "border-amber-200 bg-amber-50/20"}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          {allDone ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          ) : (
            <Circle className="h-5 w-5 text-amber-600" />
          )}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <ol className="space-y-2">
          {steps.map((step, i) => (
            <li key={step.id} className="flex gap-3 text-sm">
              <span className="mt-0.5 shrink-0">
                {step.done ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : (
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border text-[10px] font-medium text-muted-foreground">
                    {i + 1}
                  </span>
                )}
              </span>
              <div className="flex-1 min-w-0">
                <p className={step.done ? "text-muted-foreground line-through" : "font-medium"}>{step.label}</p>
                {!step.done ? <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p> : null}
              </div>
              {!step.done && step.href ? (
                <Button variant="outline" size="sm" asChild className="shrink-0 h-8">
                  <Link href={step.href}>
                    {step.hrefLabel ?? "Ir"}
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              ) : null}
            </li>
          ))}
        </ol>
        {pending && !pending.href ? (
          <p className="text-xs text-muted-foreground">Completá: {pending.label.toLowerCase()}.</p>
        ) : null}
      </CardContent>
    </Card>
  )
}
