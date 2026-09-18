# Auditoria de Segurança — Mimô Cookies (Cardápio Digital)

**Data:** 2026-09-18
**Escopo:** repositório completo (`c2f5114`, branch `main`), incluindo build/deploy (`scripts/generate-headers.mjs`, `netlify.toml`) e dependências (`npm audit`).
**Metodologia:** revisão manual de código-fonte, `npm audit` contra o `package-lock.json` instalado, varredura de padrões de segredo/credencial em todo o repositório (exceto `node_modules`), e checagem de CSP/headers gerados no build.

## Resumo executivo

Risco geral: **baixo**. É uma SPA 100% estática (React + Vite), sem backend, sem autenticação, sem banco de dados e sem pagamentos — o pedido termina como uma mensagem pré-formatada enviada via link `wa.me` do WhatsApp. Isso elimina praticamente toda a superfície clássica de ataque server-side (SQLi, RCE, IDOR, bypass de auth). Os pontos de atenção reais estão em três lugares: (1) dado pessoal (nome + telefone) que pode ser enviado a um webhook externo sem aviso ao usuário, (2) controles "de segurança" no formulário que na prática são só paliativos de UX, e (3) uma superfície de dependências instaladas muito maior do que o necessário. Nenhum achado é crítico ou alto; a postura de headers/CSP está, aliás, acima da média para um projeto deste porte.

| Severidade | Qtd. |
|---|---|
| Crítico | 0 |
| Alto | 0 |
| Médio | 1 |
| Baixo | 4 |
| Informativo | 6 |

---

## Achados

### [MÉDIO] M1 — PII (nome + telefone) enviada a um webhook externo sem consentimento nem autenticação

**Onde:** `src/lib/analytics.ts` (função `trackEvent`), chamado em `src/pages/Index.tsx:131-136` (`order_completed`) e `:157-163` (`lead_captured`).

Quando `VITE_N8N_WEBHOOK_URL` está configurada, o app faz um `POST` (fire-and-forget, sem autenticação, sem assinatura HMAC) contendo nome e telefone do cliente para essa URL, assim que o formulário fica válido — **antes** mesmo do pedido ser enviado. Hoje a variável está vazia por padrão (`.env.example`), então isso é *opt-in* e não afeta o deploy atual. Mas quando for ativada:

- Não há nenhuma indicação na interface de que os dados estão sendo coletados/enviados a um terceiro (n8n), nem opção de recusa — o README chama isso de "privacidade por padrão" porque é opt-in, mas isso não substitui aviso ao titular do dado quando o tracking estiver de fato ligado.
- O endpoint não tem autenticação (qualquer um com a URL do webhook pode enviar eventos falsos) nem o app valida a origem/resposta — não é um risco de exfiltração adicional (o app é quem envia, não recebe), mas é uma superfície de spoofing de dados no n8n se a URL vazar.
- Como o produto lida com nome/telefone de clientes no Brasil, isso entra no escopo da **LGPD** (Lei 13.709/2018) — coleta e transmissão de dado pessoal a terceiro processador exige base legal e, em geral, transparência ao titular.

**Recomendação:** quando o webhook estiver ativo em produção, adicionar um aviso de privacidade visível no formulário (ex.: "seus dados de contato podem ser usados para follow-up automático") e considerar assinar o payload (HMAC com segredo compartilhado) para o n8n poder validar a origem. Isso é uma decisão de produto/jurídica, não uma correção de código — registrado aqui para a equipe decidir.

---

### [BAIXO] B1 — Sanitização de input é uma lista de bloqueio manual, não sanitização real

**Onde:** `src/pages/Index.tsx:64-65`

```ts
const sanitizeInput = (input: string): string =>
  input.replace(/[<>"'`\\{}]/g, "").trim();
```

Remove um conjunto fixo de caracteres (`< > " ' \` \ { }`). Isso cobre bem o caso de uso real (evitar que o cliente quebre a formatação da mensagem do WhatsApp), mas **não é uma sanitização contra XSS** — e não precisa ser, porque o React já escapa por padrão qualquer texto renderizado via JSX (nenhum `dangerouslySetInnerHTML` é usado no fluxo do pedido). O risco real de uma denylist manual é ficar desatualizada silenciosamente se o texto passar a ser usado em outro contexto (ex.: um HTML de e-mail, um `innerHTML`, um template SQL) — hoje isso não acontece, mas é frágil por natureza. Também é reimplementada apenas neste arquivo, sem teste que garanta o comportamento.

**Recomendação:** deixar explícito no código (comentário) que essa função serve para *formatação segura da mensagem do WhatsApp*, não para sanitização de HTML, e nunca reaproveitá-la fora desse contexto sem revisão.

### [BAIXO] B2 — Rate limiting é só client-side e trivialmente contornável

**Onde:** `src/pages/Index.tsx:67`, `:105-112`

O limite de 5 pedidos/minuto é mantido em `useRef` no navegador — some ao recarregar a página, e é claro que não existe em outra aba/dispositivo. Não é um controle de segurança/anti-abuso real, é uma fricção de UX para o usuário comum. Como não há backend, não há como implementar rate limiting de verdade sem introduzir um servidor — o que provavelmente não vale a pena para o volume desse negócio. Mas o README descreve isso como proteção "contra spam e injeção de conteúdo", o que é uma expectativa desalinhada com o que o controle de fato garante.

**Recomendação:** nenhuma ação de código necessária; ajustar a comunicação (README) para não descrever isso como controle de segurança.

### [BAIXO] B3 — Superfície de dependências muito maior que o necessário

**Onde:** `package.json` (32 deps de produção, 19 dev; `npm audit` reporta **517 pacotes** instalados no total).

A maior parte da suíte Radix UI, `recharts`, `cmdk`, `vaul`, `embla-carousel-react`, `input-otp`, `react-day-picker`, `react-resizable-panels`, `react-hook-form` + `zod` + `@hookform/resolvers` está instalada mas **não é usada em nenhum lugar do código** (ver `REVISAO-CODIGO.md`, achado C4). Mais pacotes = mais superfície de supply-chain (cada um é código de terceiros que roda no seu processo de build, e potencialmente no bundle final se for importado por engano). Hoje o `npm audit` está limpo (ver abaixo), mas isso é um instantâneo — quanto menor a árvore de dependências, menor a chance de uma CVE futura afetar o projeto e menor o trabalho de mantê-las atualizadas.

**Recomendação:** remover as dependências não usadas (ação de código — ver `REVISAO-CODIGO.md`, achado C4/C5).

### [BAIXO] B4 — Fontes carregadas de CDN externo (Google Fonts)

**Onde:** `index.html:21-23`, `src/index.css:1`

`fonts.googleapis.com`/`fonts.gstatic.com` são chamados diretamente do navegador do cliente a cada visita, o que expõe o IP do visitante ao Google antes mesmo de qualquer interação (comportamento padrão do Google Fonts via CDN, não específico deste projeto). Impacto de privacidade é baixo e amplamente aceito na indústria, mas vale registrar como trade-off consciente.

**Recomendação:** opcional — self-host das fontes (`@fontsource/*` ou arquivos estáticos) elimina essa chamada de terceiro, ao custo de aumentar o bundle.

---

## Pontos informativos (sem ação necessária, registrados para referência)

- **I1 — `npm audit`: 0 vulnerabilidades conhecidas** (auditado em 2026-09-18, 251 deps de produção + 265 dev + 42 optional + 10 peer = 517 total). Confirma a afirmação do README. Recomenda-se reexecutar periodicamente (ou configurar Dependabot/Renovate) já que isso é um retrato do momento.
- **I2 — CSP e headers de segurança bem implementados.** `scripts/generate-headers.mjs` calcula o hash SHA-256 real do script inline do `dist/index.html` e monta a CSP com esse hash — nada de `'unsafe-inline'`/`'unsafe-eval'` em `script-src`. `frame-ancestors 'none'`, `object-src 'none'`, `Strict-Transport-Security` com `includeSubDomains`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Permissions-Policy` restritiva. Isso é publicado como `dist/_headers`, que o Netlify aplica automaticamente por convenção — confirmado que `netlify.toml` publica `dist` e que o script roda via hook `postbuild` do npm (dispara sozinho depois de `npm run build`, sem precisar declarar no `netlify.toml`). Nenhuma ação necessária; é um ponto forte do projeto.
- **I3 — Nenhum segredo/credencial hardcoded encontrado.** Varredura por `api_key`, `secret`, `password`, `bearer`, `aws_`, `firebase`, `supabase`, `private_key` (case-insensitive) em todo o repositório fora de `node_modules` não retornou nenhum resultado. `.env` está corretamente ignorado pelo Git (`.gitignore`), só `.env.example` (vazio) é versionado.
- **I4 — Nenhum uso de `dangerouslySetInnerHTML`/`innerHTML`/`document.write` no código do app.** O único uso de `dangerouslySetInnerHTML` no repositório está em `src/components/ui/chart.tsx` (injeta CSS de tema do gráfico via `<style>`, padrão do shadcn), e esse componente **não é importado por nenhum lugar do app** (ver `REVISAO-CODIGO.md`, achado C4) — ou seja, é código morto, não uma superfície ativa.
- **I5 — `robots.txt` (`public/robots.txt`) permite crawling geral (`Allow: /` para todos os bots) enquanto `index.html:12` define `<meta name="robots" content="noindex, nofollow">`.** Não é uma falha de segurança (a página não tem dado sensível público além do próprio cardápio), mas é uma inconsistência: o `robots.txt` deixa os bots rastrear o site, e só a meta tag impede a indexação. Para uma "edição especial" que talvez não devesse ser publicamente descoberta antes do lançamento, vale alinhar os dois (ex.: `Disallow: /` no `robots.txt` também).
- **I6 — Prevenção de "salvar imagem" via `draggable={false}` + `onContextMenu={e => e.preventDefault()}`** (`src/pages/Index.tsx:446, 501`). Isso não é um controle de segurança (qualquer pessoa consegue baixar a imagem pelo DevTools, view-source ou pela própria aba de rede) e tem custo de acessibilidade/UX (desativa o menu de contexto do navegador para todo mundo, inclusive quem só queria copiar o link da imagem). Registrado como observação, não como vulnerabilidade.

---

## Verificações realizadas

- [x] `npm audit` contra o lockfile instalado (0 vulnerabilidades)
- [x] Varredura de padrões de segredo/credencial em todo o repositório
- [x] Leitura de `scripts/generate-headers.mjs`, `netlify.toml`, `index.html`, `.env.example`, `.gitignore`
- [x] Checagem de `dangerouslySetInnerHTML`/`innerHTML`/`eval` no código do app
- [x] Rastreamento do fluxo de dado pessoal (nome/telefone/observações) do formulário até os dois destinos (link WhatsApp e webhook de analytics)
- [x] Confirmação de que não há backend, autenticação, pagamento ou persistência de dados no projeto

## Não coberto por esta auditoria (fora do escopo do código-fonte)

- Configuração de permissões/DNS/SSL na conta Netlify em si (fora do repositório).
- Segurança do endpoint n8n do lado do destinatário do webhook (é infraestrutura de terceiro/cliente, não deste repositório).
- Teste de penetração dinâmico contra o site publicado (esta auditoria foi estática, sobre o código-fonte).
