import { useMemo, useState } from 'react'
import { FileText, Info } from 'lucide-react'
import ContractInputCard from '../components/ContractInputCard'
import ResultPanel from '../components/ResultPanel'
import type { AnalyzeResponse } from '../../shared/types'
import { analyzeContract } from '../utils/api'

export default function AnalyzePage() {
  const [contractText, setContractText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<AnalyzeResponse | null>(null)

  const chars = useMemo(() => contractText.length, [contractText])
  const canAnalyze = contractText.trim().length > 0 && !isLoading

  async function onAnalyze() {
    if (!contractText.trim()) {
      setError('Cole o texto do contrato antes de analisar.')
      return
    }
    setError(null)
    setIsLoading(true)
    setResult(null)
    try {
      const res = await analyzeContract({ contractText })
      setResult(res)
    } catch (e: any) {
      const message = typeof e?.message === 'string' ? e.message : 'Falha ao analisar. Tente novamente.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-border bg-bg/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface shadow-soft">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">ContractAI</div>
              <div className="text-xs text-muted">Análise rápida e legível</div>
            </div>
          </div>
          <a
            href="#como-funciona"
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-white/5 hover:text-text"
          >
            <Info className="h-4 w-4" />
            Como funciona
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-10">
        <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-12">
          <section className="lg:col-span-5">
            <ContractInputCard
              value={contractText}
              onChange={setContractText}
              chars={chars}
              onAnalyze={onAnalyze}
              canAnalyze={canAnalyze}
              isLoading={isLoading}
              error={error}
            />
          </section>
          <section className="lg:col-span-7">
            <ResultPanel isLoading={isLoading} error={error} result={result} />
          </section>
        </div>

        <section id="como-funciona" className="mt-8 md:mt-10">
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft md:p-6">
            <div className="text-sm font-semibold">Como funciona</div>
            <div className="mt-2 text-sm leading-relaxed text-muted">
              Cole o texto do contrato, clique em “Analisar” e veja um resumo, uma explicação em linguagem simples,
              os principais riscos e sugestões práticas. Se você configurar uma chave da OpenAI, a análise fica ainda
              mais completa; sem chave, o app usa um fallback determinístico para demo.
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

