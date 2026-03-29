# ContractAI

Web app simples para colar um contrato e receber: resumo, explicação em linguagem fácil, riscos, sugestões e um score de risco.

## Requisitos
- Node.js (recomendado 18+)

## Como rodar (dev)
1) Instale dependências:

```bash
npm install
```

2) (Opcional) Configure a chave da OpenAI:

Crie um arquivo `.env` na raiz com:

```bash
OPENAI_API_KEY=seu_token_aqui
```

Sem chave, o app usa um fallback determinístico para demo.

3) Rode:

```bash
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:5174

## Endpoint
`POST /api/analyze`

Body:

```json
{ "contractText": "..." }
```

Response:

```json
{
  "resumo": "...",
  "explicacao": "...",
  "riscos": ["..."],
  "sugestoes": ["..."],
  "score": 0
}
```

