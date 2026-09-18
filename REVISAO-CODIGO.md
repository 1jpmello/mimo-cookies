# Revisão de Código — Mimô Cookies (reduzindo o "vibe coded")

**Data:** 2026-09-18
**Escopo:** todo o código-fonte em `src/`, configuração de build/lint (`eslint.config.js`, `tailwind.config.ts`, `package.json`).
**Objetivo deste documento:** listar, por ordem de impacto, o que faz o projeto parecer "gerado e nunca podado" em vez de deliberadamente projetado — com localização exata e recomendação. **Nenhuma alteração foi aplicada ao código nesta rodada** (a pedido); este é o backlog para uma futura passada de limpeza.

## Diagnóstico geral

A base tecnológica é sólida e atual (React 18 + TS + Vite 8 + Tailwind + shadcn/ui), e existem sinais reais de cuidado em partes específicas (o script de CSP com hash-pinning, o hook de scroll-reveal, o tratamento de loading sincronizado no `index.html`). O problema não é a stack — é que o projeto tem duas versões sobrepostas de si mesmo: uma arquitetura de componentes (`src/components/mimo/*`) que foi começada e abandonada, e a versão que de fato está no ar, um único arquivo de 824 linhas (`src/pages/Index.tsx`) que reimplementa tudo inline, com cores hardcoded duplicando tokens que o próprio projeto já define. Some a isso um template shadcn "starter" instalado por completo e nunca podado (~40 componentes de UI, ~19 dependências) e uma régua de qualidade (lint, testes) configurada mas não fazendo seu trabalho. É o padrão clássico de "várias sessões de geração de código, sem uma passada final de consolidação".

---

## C1 — `src/pages/Index.tsx` é um componente único de 824 linhas fazendo tudo

Hero, navegação, catálogo de produtos, combo, seção "embalagem especial", carrinho, formulário, confirmação, cards de mídia "sobre" e o footer completo — tudo em um arquivo, um componente, sem subdivisão. Isso:

- Torna qualquer mudança pontual (ex.: só o footer) arriscada, porque tudo compartilha o mesmo escopo de estado/lint/renderização.
- Duplica exatamente a responsabilidade que `src/components/mimo/ProductCard.tsx`, `ComboCard.tsx`, `MimoFooter.tsx`, `MimoHeader.tsx`, `SuccessView.tsx`, `ProgressIndicator.tsx`, `FloatingCart.tsx` já existem para cobrir — só que essas versões não são usadas.

**Recomendação:** quebrar por seção (`<Hero>`, `<ProductGrid>`, `<ComboCard>`, `<CartStep>`, `<ContactForm>`, `<ConfirmationStep>`, `<AboutGallery>`, `<SiteFooter>`), reaproveitando/corrigindo os componentes já escritos em `mimo/` em vez de criar novos do zero (ver C3 sobre o *drift* que precisa ser corrigido primeiro).

## C2 — 127 estilos inline com cores hexadecimais fixas, duplicando tokens que já existem

Contagem real em `src/pages/Index.tsx`:

| Cor hardcoded | Ocorrências | Token equivalente já definido (`src/index.css` / `tailwind.config.ts`) |
|---|---|---|
| `#f0e6d2` | 33 | `--creme` → `bg-creme` / `text-creme` |
| `#854d3b` | 25 | `--marrom-wave` → `bg-marrom-wave` / `text-marrom-wave` |
| `#2e1008` | 21 | `--texto` → `text-texto` |
| `#a67c5b` | 11 | `--suave` → `text-suave` |
| `#854c3a` | 6 | **quase idêntico a `#854d3b`** (ver abaixo) |
| `#c0392b` | 2 | sem token — cor pontual (faixa de desconto) |
| `#7a3d28` | 2 | sem token — variação escura de `marrom` |
| `#25D366` | 2 | `--whatsapp` → `bg-whatsapp` / `text-whatsapp` |

O projeto já define `creme`, `marrom`, `marrom.wave`, `texto`, `suave` e `whatsapp` como cores Tailwind (`tailwind.config.ts:33-37`, apontando pros CSS vars em `src/index.css:9-13`) — ou seja, a infraestrutura de design tokens existe e está correta, só não está sendo usada no arquivo que mais precisa dela.

**Achado extra (evidência clara de "vibe coding"):** `#854c3a` e `#854d3b` são a mesma cor pretendida (o próprio marrom-wave da marca) escrita de duas formas ligeiramente diferentes — um dígito trocado (`4c` → `4d`) provavelmente porque a cor foi "regerada" em momentos diferentes em vez de reutilizada. `#854c3a` aparece nos divisores de seção (linhas 343, 679) e no fundo do footer (linha 722) e do hero (linha 167); `#854d3b` aparece em praticamente todo o resto. Hoje isso é visualmente quase imperceptível, mas é exatamente o tipo de drift que uma paleta centralizada existe para evitar.

**Recomendação:** substituir os `style={{ color: '#2e1008' }}` etc. pelas classes Tailwind equivalentes (`text-texto`), e adicionar `#c0392b`/`#7a3d28` como tokens nomeados (`--destaque`/`--marrom-escuro`) se forem intencionais, ou trocá-los por `destructive`/`marrom` se forem variações acidentais.

## C3 — `src/components/mimo/` tem ~10 componentes escritos, nenhum usado, e um deles está com os dados desatualizados (*drift*)

De 11 arquivos em `src/components/mimo/`, apenas `HeroParticles.tsx` é importado (por `Index.tsx:5`). Os outros dez — `ChocolateDrip`, `ComboCard`, `FloatingCart`, `MimoFooter`, `MimoHeader`, `Ornaments`, `ProductCard`, `ProgressIndicator`, `SuccessView`, `WavyBorder` — não são referenciados em lugar nenhum do app.

Mais revelador: `ProductCard.tsx:8` e `ComboCard.tsx:9` declaram um campo `emoji: string` na interface `Product`, mas o array `PRODUCTS` real (`Index.tsx:23-28`) **não tem esse campo** — ou seja, esses componentes foram escritos contra uma versão anterior dos dados e nunca foram atualizados quando o catálogo mudou. Usá-los hoje sem revisão quebraria a tipagem.

**Recomendação:** decidir entre duas opções e não deixar as duas versões coexistindo:
1. Apagar `src/components/mimo/*` (exceto `HeroParticles.tsx`) e manter a lógica em `Index.tsx`, ou
2. Corrigir o *drift* de dados e migrar `Index.tsx` para usar esses componentes de fato (endereça C1 e C3 ao mesmo tempo).

## C4 — ~40 arquivos do shadcn/ui instalados, só 3 montados, nenhum efetivamente usado

`src/components/ui/` tem a biblioteca inteira do template shadcn (`sidebar.tsx` 637 linhas, `chart.tsx` 303, `carousel.tsx` 224, `menubar.tsx` 207, `dropdown-menu.tsx` 179, `context-menu.tsx` 178, `form.tsx`, `calendar.tsx`, `command.tsx`, `pagination.tsx`, `toggle-group.tsx`, `alert-dialog.tsx` etc.). Só `toaster.tsx`, `sonner.tsx` e `tooltip.tsx` são importados, e só por `src/App.tsx:3-5` — nenhum outro arquivo do app importa nada de `components/ui`. E mesmo esses três não fazem nada: `toast()` (de `src/hooks/use-toast.ts`) nunca é chamado em lugar nenhum do código do app — só existe dentro da própria implementação do hook.

**Recomendação:** apagar os arquivos de `components/ui` que não são usados (manter só o que for de fato montado/chamado), ou remover o `<Toaster />`/`<Sonner />`/`<TooltipProvider>` de `App.tsx` se notificações toast não fizerem parte do produto.

## C5 — `package.json` carrega o conjunto de dependências do template "starter", não do produto que existe

32 dependências de produção + 19 de desenvolvimento. Praticamente toda a suíte `@radix-ui/*` (accordion, alert-dialog, aspect-ratio, avatar, checkbox, collapsible, context-menu, dialog, dropdown-menu, hover-card, label, menubar, navigation-menu, popover, progress, radio-group, scroll-area, select, separator, slider, switch, tabs, toast, toggle, toggle-group, tooltip), mais `recharts`, `cmdk`, `vaul`, `embla-carousel-react`, `input-otp`, `react-day-picker`, `react-resizable-panels`, `react-hook-form` + `@hookform/resolvers` + `zod`, `next-themes`, `date-fns` — **nada disso é importado pelo código do app** (confirmado por busca de `from ["']@/components/ui/` e `from ["']@/components/mimo/` em todo `src/`, além de busca direta pelos nomes dos pacotes). É exatamente o pacote de dependências que o CLI do shadcn/ui instala por padrão ao criar um projeto novo — nunca foi podado.

**Recomendação:** depois de resolver C3/C4, rodar `npx depcheck` (ou remover manualmente) e tirar do `package.json` tudo que não sobrar em uso. Isso reduz a superfície de supply-chain (ver `AUDITORIA-SEGURANCA.md`, achado B3) e o tempo de `npm install`/build.

## C6 — Regra de lint que pegaria isso automaticamente está desligada

`eslint.config.js:23`:

```js
"@typescript-eslint/no-unused-vars": "off",
```

Essa é exatamente a regra que teria sinalizado os imports/variáveis não usados descritos em C3–C5 durante o desenvolvimento, antes de virarem dívida acumulada. Está desligada explicitamente, não por omissão.

**Recomendação:** reativar (`"warn"` ou `"error"`) depois da limpeza de C3–C5, para não voltar a acumular código morto.

## C7 — Cobertura de teste é só nominal, e o E2E documentado não existe

- `src/test/example.test.ts` é o único teste do repositório, e seu conteúdo é `expect(true).toBe(true)` — não testa nada do app.
- `playwright.config.ts` define `testMatch: "**/*.e2e.ts"`, e o `README.md` documenta `npx playwright test` como parte do workflow de qualidade — mas **não existe nenhum arquivo `*.e2e.ts` no repositório**. Rodar esse comando hoje não executa nenhum teste (não falha, mas não verifica nada).

**Recomendação:** ou escrever ao menos um E2E cobrindo o fluxo crítico (adicionar item → preencher formulário → gerar link do WhatsApp com o texto esperado), ou remover a menção a Playwright do README/scripts até que exista de fato.

## C8 — Ativos de mídia pesados versionados diretamente no Git

`src/assets/` tem ~25 arquivos de imagem/vídeo, incluindo `produto-video.mp4` (~4MB) e várias imagens de 1–2.5MB, todos versionados diretamente no repositório e processados pelo bundler do Vite. Não é um problema de correção, mas infla o histórico do Git permanentemente (diferente de um asset em CDN/storage, que pode ser trocado sem inchar o repo) e aumenta o tempo de clone/build.

**Recomendação:** opcional — mover para um storage de objetos (ex.: bucket do próprio Netlify, Cloudinary) referenciado por URL, ou ao menos garantir compressão (o `.mp4` de 4MB para um vídeo de produto de alguns segundos sugere que não passou por otimização de bitrate).

## C9 — Pequenas inconsistências adicionais

- `Index.tsx:658` mostra `userData.name` (não sanitizado) no preview da Etapa 3, enquanto a mensagem real do WhatsApp usa a versão sanitizada — inofensivo (é só exibido de volta pro próprio usuário via JSX, que escapa automaticamente), mas é uma pequena divergência entre o que o preview mostra e o que de fato é enviado.
- Comentários de seção em `Index.tsx` (`{/* SEÇÃO 1 — LANDING / HERO */}`) sugerem que o autor já sabia que o arquivo precisava de divisão em módulos — o comentário existe onde o `import`/componente deveria estar.

---

## Resumo priorizado (ordem sugerida de execução, se/quando decidirem aplicar)

1. **C3** — resolver o *drift* de `mimo/*` (decidir usar ou apagar) — desbloqueia os itens seguintes.
2. **C1 + C2** — quebrar `Index.tsx` em componentes e trocar cores hardcoded por tokens Tailwind (maior impacto visual de "menos vibe coded", e o mapeamento de cores já está pronto na tabela de C2).
3. **C4 + C5** — remover UI/dependências não usadas.
4. **C6** — reativar `no-unused-vars` para não regredir.
5. **C7** — decidir sobre cobertura de teste real vs. remover a documentação de Playwright.
6. **C8 / C9** — otimizações e polimento final, não bloqueantes.

## Verificações realizadas

- [x] Contagem exata de `style={{` e de cada cor hex em `Index.tsx` (grep)
- [x] Confirmação de import único de `components/mimo/*` (`HeroParticles`) via grep em todo `src/`
- [x] Confirmação de que `toast()` nunca é chamado fora de `use-toast.ts`
- [x] Confirmação de que nenhum pacote de `components/ui/*` não citado é importado por outro arquivo do app
- [x] Comparação campo a campo entre `Product` (interface em `mimo/ProductCard.tsx`) e `PRODUCTS` (dados reais em `Index.tsx`)
- [x] Leitura de `eslint.config.js`, `tailwind.config.ts`, `src/index.css`, `package.json` na íntegra
