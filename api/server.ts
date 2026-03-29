import cors from 'cors'
import express from 'express'
import { analyzeContract } from './service/analyzeContract'

const app = express()

app.use(cors())
app.use(express.json({ limit: '2mb' }))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.post('/api/analyze', async (req, res) => {
  const contractText = typeof req.body?.contractText === 'string' ? req.body.contractText : ''
  const locale = typeof req.body?.locale === 'string' ? req.body.locale : 'pt-BR'

  if (!contractText.trim()) {
    res.status(400).json({ message: 'Cole o texto do contrato antes de analisar.' })
    return
  }

  if (contractText.length > 150_000) {
    res.status(400).json({ message: 'O texto é muito grande. Reduza e tente novamente.' })
    return
  }

  try {
    const result = await analyzeContract({ contractText, locale })
    res.json(result)
  } catch (err) {
    res.status(500).json({ message: 'Falha ao analisar. Tente novamente em instantes.' })
  }
})

const port = Number(process.env.PORT || 5174)
app.listen(port, () => {
  process.stdout.write(`ContractAI API on http://localhost:${port}\n`)
})

