# Page Design — ContractAI (desktop-first)

## Global Styles (tokens)
- Grid/spacing: base 8px; container máx. 1120px; padding lateral 24px (desktop) / 16px (mobile)
- Cores:
  - Background: #0B1220
  - Surface: #111A2E
  - Primary: #4F7DFF
  - Text: #EAF0FF
  - Muted text: #A9B5D1
  - Border: rgba(255,255,255,0.08)
  - Severity: low=#2DD4BF, medium=#F59E0B, high=#EF4444
- Tipografia:
  - Base: 16px; headings: 28/22/18; line-height 1.5
  - Fonte: system-ui (fallback)
- Componentes:
  - Botão primário: fundo Primary, texto branco; hover: brilho leve; disabled: 60% opacity
  - Inputs/textarea: fundo Surface, borda Border; foco: borda Primary
  - Cards: Surface + borda suave + sombra leve

## Página: Analisar Contrato

### Meta Information
- Title: ContractAI — Análise de Contratos
- Description: Cole o texto de um contrato e receba uma análise estruturada.
- Open Graph:
  - og:title: ContractAI — Análise de Contratos
  - og:description: Análise estruturada com resumo, riscos e cláusulas.

### Layout
- Sistema: CSS Grid híbrido com Flexbox.
- Desktop (>=1024px): grid 2 colunas (Entrada 5/12, Resultados 7/12) com gap 24px.
- Tablet/Mobile (<1024px): empilha seções (Entrada acima, Resultados abaixo), gap 16px.

### Page Structure
1. Top Bar fixa (altura 56px)
2. Conteúdo principal em container central
3. Grid de duas colunas: painel de entrada + painel de resultados

### Sections & Components

#### 1) Top Bar
- Logo/Nome: “ContractAI” (clique recarrega/volta ao topo)
- Ação secundária: link “Como funciona” (âncora para um bloco informativo simples abaixo)

#### 2) Painel — Entrada do Contrato (coluna esquerda)
- Card: “Contrato para análise”
- Textarea grande (mín. 14 linhas)
  - Placeholder: “Cole aqui o texto completo do contrato...”
  - Contador de caracteres (ex.: 12.340)
- Upload (opcional)
  - Botão: “Anexar arquivo”
  - Estado: nome do arquivo selecionado
  - Observação: se arquivo for anexado, o texto extraído preenche a textarea (mantendo a textarea como fonte final editável)
- Validação
  - Erro inline quando vazio ao tentar analisar
- Botão primário: “Analisar”
  - Loading: spinner + texto “Analisando...”
  - Disabled: quando vazio ou durante requisição

#### 3) Painel — Resultados (coluna direita)
- Estado inicial (antes de analisar)
  - Empty state com texto: “O resultado aparecerá aqui após a análise.”
- Estado de carregamento
  - Skeletons para seções (Resumo, Riscos, Cláusulas)
- Estado de erro
  - Alert card com: mensagem curta + botão “Tentar novamente”
- Estado de sucesso (renderiza a partir do JSON)
  - Header do resultado
    - “Score de risco” (0 a 100) + barra de progresso + label (baixo/médio/alto)
    - Ação: “Copiar JSON”
  - Seção: 📄 Resumo
    - Texto do campo `resumo`
  - Seção: 🧠 Explicação simples
    - Texto do campo `explicacao`
  - Seção: ⚠️ Riscos identificados
    - Lista de itens do array `riscos`
  - Seção: 💡 Sugestões
    - Lista de itens do array `sugestoes`

#### 4) Bloco “Como funciona” (abaixo do grid)
- Texto curto explicando: inserir texto → analisar → visualizar resumo/riscos/cláusulas
- Sem novas ações; apenas conteúdo informativo

### Interações e estados
- A requisição chama `POST /api/analyze` com `contractText`.
- Sucesso: atualiza o painel de resultados usando exatamente `resumo`, `explicacao`, `riscos`, `sugestoes` e `score`.
- Falha:
  - 4xx (validação): mensagem direta no painel e destaque no campo
  - 5xx/timeouts: alert com “Tentar novamente”

### Acessibilidade
- Labels visíveis para textarea e upload
- Contraste mínimo em textos muted
- Navegação por teclado: foco visível em inputs/botões
- Áreas de evidência em bloco com rolagem horizontal se necessário
