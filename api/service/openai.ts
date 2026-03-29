import type { AnalyzeResponse } from '../../shared/types'

function coerceArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value
    .map((x) => (typeof x === 'string' ? x.trim() : ''))
    .filter((x) => x.length > 0)
    .slice(0, 5)
}

function coerceScore(value: unknown): number {
  const n = typeof value === 'number' ? value : Number.NaN
  if (!Number.isFinite(n)) return 0
  return Math.max(0, Math.min(100, Math.round(n)))
}

function parseJsonObject(text: string): unknown {
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start) return null
  const slice = text.slice(start, end + 1)
  try {
    return JSON.parse(slice)
  } catch {
    return null
  }
}

export async function analyzeWithOpenAI(input: {
  apiKey: string
  contractText: string
  locale: string
}): Promise<AnalyzeResponse | null> {
  const prompt = `Analise o contrato abaixo e retorne estritamente em JSON com os campos:\n\n{\n  \"resumo\": \"...\",\n  \"explicacao\": \"...\",\n  \"riscos\": [\"...\"],\n  \"sugestoes\": [\"...\"],\n  \"score\": 0\n}\n\nRegras:\n- resumo: até 5 linhas, direto ao ponto\n- explicacao: linguagem simples, evitando termos jurídicos difíceis\n- riscos: até 5 itens, frases curtas\n- sugestoes: até 5 itens, práticas e acionáveis\n- score: 0 a 100 (quanto maior, maior o risco)\n- idioma: ${input.locale}\n\nContrato:\n${input.contractText}`

  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${input.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'Você é um assistente que explica contratos com linguagem clara e amigável. Retorne apenas JSON válido.',
        },
        { role: 'user', content: prompt },
      ],
    }),
  })

  if (!resp.ok) return null
  const data = (await resp.json()) as any
  const content = data?.choices?.[0]?.message?.content
  if (typeof content !== 'string') return null

  const raw = parseJsonObject(content)
  const obj = raw && typeof raw === 'object' ? (raw as any) : null
  if (!obj) return null

  const resumo = typeof obj.resumo === 'string' ? obj.resumo.trim() : ''
  const explicacao = typeof obj.explicacao === 'string' ? obj.explicacao.trim() : ''
  const riscos = coerceArray(obj.riscos)
  const sugestoes = coerceArray(obj.sugestoes)
  const score = coerceScore(obj.score)

  if (!resumo || !explicacao) return null

  return {
    resumo,
    explicacao,
    riscos,
    sugestoes,
    score,
  }
}

