import type { AnalyzeResponse } from '../../shared/types'

function clampScore(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)))
}

function pickFirstLines(text: string, maxLines: number): string {
  const clean = text
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 1400)
  const sentences = clean.split(/(?<=[.!?])\s+/).filter(Boolean)
  const lines: string[] = []
  for (const s of sentences) {
    const candidate = s.trim()
    if (!candidate) continue
    lines.push(candidate)
    if (lines.length >= maxLines) break
  }
  return lines.join('\n')
}

function matchAny(text: string, patterns: RegExp[]): boolean {
  return patterns.some((p) => p.test(text))
}

export function analyzeWithHeuristics(contractText: string): AnalyzeResponse {
  const text = contractText.toLowerCase()

  const riskRules: Array<{ pattern: RegExp; label: string; weight: number }> = [
    {
      pattern: /multa|penalidade|cl[aá]usula penal/, 
      label: 'Pode existir multa/penalidade relevante. Verifique valores e condições.',
      weight: 18,
    },
    {
      pattern: /rescis[aã]o|den[uú]ncia|cancelamento/, 
      label: 'As regras de rescisão podem ser desfavoráveis (prazos, aviso prévio, multas).',
      weight: 16,
    },
    {
      pattern: /renova[cç][aã]o autom[aá]tica|vig[eê]ncia|prazo/, 
      label: 'A vigência e/ou renovação pode te prender por mais tempo do que parece.',
      weight: 12,
    },
    {
      pattern: /reajuste|corre[cç][aã]o|índice|ipca|igpm|juros|mora/, 
      label: 'Pode haver reajustes, juros e encargos que aumentam o custo final.',
      weight: 12,
    },
    {
      pattern: /foro|jurisdi[cç][aã]o|comarca/, 
      label: 'O foro escolhido pode dificultar uma cobrança/defesa (cidade/estado diferente).',
      weight: 10,
    },
    {
      pattern: /limita[cç][aã]o de responsabilidade|n[aã]o se responsabiliza|isento/, 
      label: 'Pode limitar a responsabilidade da outra parte, reduzindo sua proteção.',
      weight: 12,
    },
    {
      pattern: /confidencialidade|sigilo|nda/, 
      label: 'Cláusulas de confidencialidade podem ser amplas. Veja o que você não pode compartilhar.',
      weight: 8,
    },
    {
      pattern: /exclusividade|n[aã]o concorr[eê]ncia|n[aã]o compete/, 
      label: 'Pode impor exclusividade ou não concorrência, reduzindo sua liberdade de atuar.',
      weight: 14,
    },
    {
      pattern: /cess[aã]o|transfer[eê]ncia|subcontrata[cç][aã]o/, 
      label: 'Pode permitir cessão/subcontratação sem seu controle. Verifique se exige sua anuência.',
      weight: 8,
    },
    {
      pattern: /indeniza[cç][aã]o|perdas e danos|respons[aá]vel por qualquer/, 
      label: 'Pode haver indenizações amplas. Veja limites e situações que geram responsabilidade.',
      weight: 14,
    },
  ]

  const matched = riskRules.filter((r) => r.pattern.test(text))
  const riscos = matched.map((m) => m.label).slice(0, 5)

  const base = 18
  const lengthFactor = Math.min(12, Math.floor(contractText.length / 6000) * 3)
  const keywordScore = matched.reduce((acc, r) => acc + r.weight, 0)
  const uncertaintyBoost = matchAny(text, [/a crit[eé]rio|unilateral|sem aviso|qualquer tempo/]) ? 10 : 0
  const score = clampScore(base + lengthFactor + keywordScore + uncertaintyBoost)

  const resumo = pickFirstLines(contractText, 5) || 'Contrato enviado para análise.'
  const explicacao =
    'Pense neste contrato como um conjunto de regras: o que cada lado deve fazer, quanto custa, por quanto tempo vale e o que acontece se alguém não cumprir. Os pontos mais importantes costumam estar em pagamento, prazo, cancelamento e multas.'

  const sugestoesBase = [
    'Confira valores, prazos e o que acontece se houver atraso (juros/multa).',
    'Antes de assinar, peça exemplos práticos: quando pode cancelar e quanto pagaria de multa.',
    'Se algo estiver vago, peça para escrever de forma mais direta (com números e datas).',
    'Negocie limites: multas proporcionais e responsabilidade limitada a danos razoáveis.',
    'Guarde uma cópia assinada e registre todas as comunicações sobre mudanças.',
  ]

  const sugestoes = sugestoesBase.slice(0, 5)

  return {
    resumo,
    explicacao,
    riscos: riscos.length ? riscos : ['Não encontrei sinais óbvios de risco no texto, mas vale revisar pagamento, prazo e cancelamento.'],
    sugestoes,
    score,
  }
}

