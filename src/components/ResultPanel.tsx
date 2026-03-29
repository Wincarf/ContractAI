import { AlertTriangle, Copy, FileSearch2, Lightbulb, ShieldAlert, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { AnalyzeResponse } from '../../shared/types'

function riskLabel(score: number) {
  if (score >= 70) return { label: 'Risco alto', color: 'bg-severity-high' }
  if (score >= 40) return { label: 'Risco médio', color: 'bg-severity-medium' }
  return { label: 'Risco baixo', color: 'bg-severity-low' }
}

function Section(props: { title: string; icon: JSX.Element; children: JSX.Element }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft md:p-6">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <span className="text-primary">{props.icon}</span>
        {props.title}
      </div>
      <div className="mt-3">{props.children}</div>
    </div>
  )
}

function SkeletonCard(props: { title: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft md:p-6">
      <div className="h-5 w-40 animate-pulse rounded bg-white/10" />
      <div className="mt-4 space-y-2">
        <div className="h-4 w-full animate-pulse rounded bg-white/10" />
        <div className="h-4 w-11/12 animate-pulse rounded bg-white/10" />
        <div className="h-4 w-9/12 animate-pulse rounded bg-white/10" />
      </div>
    </div>
  )
}

export default function ResultPanel(props: { isLoading: boolean; error: string | null; result: AnalyzeResponse | null }) {
  const [copied, setCopied] = useState(false)

  const score = props.result?.score ?? 0
  const risk = useMemo(() => riskLabel(score), [score])

  async function onCopyJson() {
    if (!props.result) return
    await navigator.clipboard.writeText(JSON.stringify(props.result, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  if (props.isLoading) {
    return (
      <div className="space-y-4 md:space-y-6">
        <SkeletonCard title="Resumo" />
        <SkeletonCard title="Riscos" />
        <SkeletonCard title="Sugestões" />
      </div>
    )
  }

  if (props.error && !props.result) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft md:p-6">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <AlertTriangle className="h-4 w-4 text-severity-medium" />
          Não foi possível analisar
        </div>
        <div className="mt-2 text-sm text-muted">{props.error}</div>
        <div className="mt-4 text-xs text-muted">
          Dica: cole mais conteúdo do contrato (pagamento, prazo, cancelamento e multas).
        </div>
      </div>
    )
  }

  if (!props.result) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft md:p-6">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <FileSearch2 className="h-4 w-4 text-primary" />
          Resultado
        </div>
        <div className="mt-2 text-sm text-muted">O resultado aparecerá aqui após a análise.</div>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft md:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-semibold">Score de risco</div>
            <div className="mt-1 text-sm text-muted">0 (baixo) → 100 (alto)</div>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-bg/40 px-3 py-1.5 text-sm">
            <span className={`h-2.5 w-2.5 rounded-full ${risk.color}`} />
            <span className="font-semibold">{score}</span>
            <span className="text-muted">•</span>
            <span className="text-muted">{risk.label}</span>
          </div>
        </div>
        <div className="mt-4">
          <div className="h-2 w-full rounded-full bg-white/10">
            <div
              className={`h-2 rounded-full ${risk.color}`}
              style={{ width: `${Math.max(2, Math.min(100, score))}%` }}
            />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-end">
          <button
            type="button"
            onClick={onCopyJson}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-white/0 px-3 py-2 text-sm text-muted transition hover:bg-white/5 hover:text-text"
          >
            <Copy className="h-4 w-4" />
            {copied ? 'Copiado' : 'Copiar JSON'}
          </button>
        </div>
      </div>

      <Section title="Resumo" icon={<Sparkles className="h-4 w-4" />}>
        <div className="whitespace-pre-line text-sm leading-relaxed text-text">{props.result.resumo}</div>
      </Section>

      <Section title="Explicação simples" icon={<ShieldAlert className="h-4 w-4" />}>
        <div className="text-sm leading-relaxed text-text">{props.result.explicacao}</div>
      </Section>

      <Section title="Riscos identificados" icon={<AlertTriangle className="h-4 w-4" />}>
        <ul className="space-y-2">
          {props.result.riscos.map((r, idx) => (
            <li key={`${idx}-${r}`} className="rounded-xl border border-border bg-bg/30 px-4 py-3 text-sm text-text">
              {r}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Sugestões" icon={<Lightbulb className="h-4 w-4" />}>
        <ul className="space-y-2">
          {props.result.sugestoes.map((s, idx) => (
            <li key={`${idx}-${s}`} className="rounded-xl border border-border bg-bg/30 px-4 py-3 text-sm text-text">
              {s}
            </li>
          ))}
        </ul>
      </Section>
    </div>
  )
}

