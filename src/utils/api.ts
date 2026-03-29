import type { AnalyzeResponse } from '../../shared/types'

export async function analyzeContract(input: { contractText: string }): Promise<AnalyzeResponse> {
  const resp = await fetch('/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contractText: input.contractText,
      locale: 'pt-BR',
    }),
  })

  const data = (await resp.json()) as any
  if (!resp.ok) {
    const message = typeof data?.message === 'string' ? data.message : 'Falha ao analisar.'
    throw new Error(message)
  }

  const ok =
    typeof data?.resumo === 'string' &&
    typeof data?.explicacao === 'string' &&
    Array.isArray(data?.riscos) &&
    Array.isArray(data?.sugestoes) &&
    typeof data?.score === 'number'
  if (!ok) throw new Error('Resposta inesperada do servidor.')

  return data as AnalyzeResponse
}

