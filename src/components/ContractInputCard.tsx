import { Loader2, Paperclip, Play } from 'lucide-react'
import { useId, useMemo, useState } from 'react'

export default function ContractInputCard(props: {
  value: string
  onChange: (v: string) => void
  chars: number
  onAnalyze: () => void
  canAnalyze: boolean
  isLoading: boolean
  error: string | null
}) {
  const textareaId = useId()
  const fileId = useId()
  const [fileName, setFileName] = useState<string | null>(null)

  const charLabel = useMemo(() => {
    const n = props.chars
    return new Intl.NumberFormat('pt-BR').format(n)
  }, [props.chars])

  async function onPickFile(file: File | null) {
    if (!file) return
    setFileName(file.name)
    if (!file.type.startsWith('text/') && !file.name.toLowerCase().endsWith('.txt')) {
      props.onChange('')
      return
    }
    const text = await file.text()
    props.onChange(text)
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold">Contrato para análise</div>
          <div className="mt-1 text-sm text-muted">Cole o texto completo. Quanto mais completo, melhor.</div>
        </div>
        <div className="text-xs text-muted">{charLabel} caracteres</div>
      </div>

      <div className="mt-4">
        <label htmlFor={textareaId} className="text-xs text-muted">
          Texto do contrato
        </label>
        <textarea
          id={textareaId}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          placeholder="Cole aqui o texto completo do contrato..."
          className="mt-2 h-72 w-full resize-none rounded-xl border border-border bg-bg/40 px-4 py-3 text-sm leading-relaxed outline-none transition focus:border-primary"
        />
        {props.error ? <div className="mt-2 text-sm text-severity-high">{props.error}</div> : null}
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <input
            id={fileId}
            type="file"
            accept=".txt,text/plain"
            className="hidden"
            onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
          />
          <label
            htmlFor={fileId}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-white/0 px-3 py-2 text-sm text-muted transition hover:bg-white/5 hover:text-text"
          >
            <Paperclip className="h-4 w-4" />
            Anexar .txt
          </label>
          {fileName ? <div className="truncate text-xs text-muted">{fileName}</div> : null}
        </div>

        <button
          type="button"
          onClick={props.onAnalyze}
          disabled={!props.canAnalyze}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {props.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          {props.isLoading ? 'Analisando…' : 'Analisar'}
        </button>
      </div>
    </div>
  )
}

