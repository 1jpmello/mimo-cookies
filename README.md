# Mimô Cookies — Cardápio Digital

Loja digital para pedidos via WhatsApp da **Mimô Cookies**, marca de cookies artesanais premium. Este projeto é a edição especial de Páscoa: um cardápio interativo, mobile-first, que conduz o cliente do catálogo ao pedido finalizado em três passos, sem fricção.

Desenvolvido por [Andromeda Soluções](https://www.instagram.com/andromedasolucoes)

---

## Sobre o projeto

A Mimô Cookies vende por WhatsApp, mas até aqui não tinha uma vitrine própria: o cliente negociava sabor, quantidade e preço em texto solto no chat. Este projeto resolve isso com uma experiência de e-commerce completa que **termina** no WhatsApp, mas não começa nele — catálogo com fotos e descrições, cálculo automático de descontos por quantidade, combo promocional, carrinho e confirmação de pedido, tudo isso acontece no site antes de qualquer mensagem ser enviada.

O resultado: menos tempo negociando, menos erro de pedido, e uma marca com aparência de operação profissional.

## Funcionalidades

- **Catálogo de sabores** com preços, descrição e desconto progressivo por quantidade (2 un. = R$3 off, 3+ un. = R$6 off por sabor)
- **Combo de Mimo** com desconto fixo e economia destacada
- **Fluxo de pedido em 3 etapas** (menu → carrinho/dados → confirmação) com barra de progresso e carrinho flutuante
- **Envio via WhatsApp** com mensagem pré-formatada (itens, descontos, total, nome e telefone do cliente)
- **Sanitização de formulário** e **rate limiting** (máx. 5 pedidos/minuto) contra spam e injeção de conteúdo na mensagem
- **Tela de carregamento sincronizada** com o carregamento real dos assets (imagem de fundo + vídeo do hero), não um tempo fixo arbitrário

## Inteligência de negócio: jornada do cliente e automações

Além da vitrine, o projeto entrega **visibilidade sobre a operação** — hoje uma venda por WhatsApp é uma caixa-preta: não dá pra saber quantas pessoas abriram o cardápio, quantas monharam carrinho e sumiram, ou quantas de fato compraram. O site instrumenta cada etapa do funil e envia os eventos para um webhook configurável (pensado para o [n8n](https://n8n.io), mas compatível com qualquer endpoint HTTP):

| Evento | Dispara quando | Para que serve |
|---|---|---|
| `page_view` | Cliente abre o site | Volume de acessos e origem de tráfego |
| `add_to_cart` / `remove_from_cart` | Produto adicionado/removido | Quais sabores mais interessam, mesmo sem virar venda |
| `checkout_started` | Cliente avança pro carrinho | Taxa de conversão entre "ver cardápio" e "iniciar pedido" |
| `lead_captured` | Nome e telefone válidos preenchidos | Contato do cliente disponível **antes** do pedido ser enviado — é o gatilho para recuperação de carrinho abandonado |
| `order_completed` | Pedido enviado pelo WhatsApp | Conversão real, ticket médio, produtos mais vendidos |

Com `lead_captured` e `order_completed` correlacionados por sessão, uma automação no n8n consegue identificar quem preencheu os dados mas não finalizou o pedido, e disparar um follow-up automático (ex.: mensagem de WhatsApp lembrando do carrinho) — o tipo de recuperação de venda que normalmente só grandes e-commerces têm.

**Privacidade por padrão:** o tracking é 100% opt-in — sem a variável `VITE_N8N_WEBHOOK_URL` configurada, nada é coletado nem enviado (o código vira no-op silencioso). Não há cookies de terceiros nem identificador persistente entre visitas: cada sessão usa um ID anônimo gerado em memória (`sessionStorage`), descartado ao fechar a aba.

## Segurança

- **CSP com hash-pinning real**: o build calcula o hash SHA-256 do script inline da tela de carregamento e gera a política automaticamente — sem `unsafe-inline` ou `unsafe-eval` em `script-src` (ver `scripts/generate-headers.mjs`)
- **Headers de segurança completos** no deploy (Netlify): `Strict-Transport-Security`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`
- **Zero vulnerabilidades conhecidas** nas dependências (`npm audit`), incluindo correção de uma falha de open-redirect/XSS no React Router
- **Sanitização de input** em todos os campos do formulário antes de compor a mensagem do WhatsApp
- **Rate limiting client-side** contra abuso do formulário de pedido

## Stack

React 18 · TypeScript · Vite 8 · Tailwind CSS · shadcn/ui (Radix) · React Router · TanStack Query · Vitest · Playwright

## Como rodar localmente

```bash
npm install
npm run dev        # http://localhost:8080
```

Para habilitar o tracking, copie `.env.example` para `.env` e defina `VITE_N8N_WEBHOOK_URL` com a URL do seu webhook n8n. Sem essa variável, o site funciona normalmente e o tracking fica desativado.

## Build e deploy

```bash
npm run build       # build de produção + geração automática de dist/_headers
npm run preview      # serve o build localmente
```

O projeto está configurado para deploy no **Netlify** (`netlify.toml`): o comando de build já roda o `postbuild` que gera os headers de segurança, incluindo a origem do webhook n8n no `connect-src` quando `VITE_N8N_WEBHOOK_URL` está definida no ambiente de build.

## Qualidade

```bash
npm run lint         # ESLint
npm run test          # Vitest (unitários)
npx playwright test   # Playwright (E2E, opcional)
```

## Autoria

Desenvolvido por **[Andromeda Soluções](https://www.instagram.com/andromedasolucoes)** para a Mimô Cookies (Tijuca, Rio de Janeiro).
