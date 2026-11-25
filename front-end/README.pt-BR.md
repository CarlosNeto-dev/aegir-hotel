# 🎨 `front-end/` — o cliente web

<p>
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-15.5-000000?logo=nextdotjs&logoColor=white">
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white">
  <img alt="Sass" src="https://img.shields.io/badge/SCSS-1.80%2B-CC6699?logo=sass&logoColor=white">
  <img alt="GSAP" src="https://img.shields.io/badge/GSAP-3-88CE02?logo=greensock&logoColor=black">
</p>

**🌐 Idioma:** [English](README.md) · **Português**

Esta pasta é o front-end inteiro. Ela é **montada em `/app`** dentro do container
(veja [`../docker/README.pt-BR.md`](../docker/README.pt-BR.md)), então tudo o que
você faz aqui é o que roda.

> ✅ **A landing (`/`) está pronta.** Ela tem:
> - um header para celular, tablet/computador e TV;
> - main: sete seções, um índice lateral e uma barra de progresso;
> - um footer, Simples ou Fragmentos, escolhido nos Ajustes;
> - os painéis de Ajustes e de Conta. A Conta é só visual; a API chega com as
>   issues #23–#29 e #41.
>
> Na TV, ou com `#tv` no fim do endereço, a landing vira um coverflow curvo guiado
> pelo controle. `/pagamentos` e `/redefinir-senha` são placeholders, e
> `/ambientes-3d` está desligada até as cenas 3D existirem. Veja
> [Estado atual](#-estado-atual).

---

## 🗂️ Estrutura de pastas

Tudo fica em `app/`. Pastas que começam com `_` são **privadas** (nunca viram rota),
e `(nome)` é um **grupo de rotas** (não entra na URL). **Só as pastas que viram um
segmento de URL são em português**; todo o resto é em **inglês**.

```
front-end/
├── package.json · pnpm-workspace.yaml · next.config.ts · tsconfig.json
├── public/
│   ├── photos/ (+ thumbs/)              # fotos do hotel em .webp (e miniaturas do menu)
│   ├── videos/settings/                 # vídeos de demonstração dos Ajustes (.webm + .mp4)
│   └── scenes/                          # reservada para os .glb das cenas 3D (vazia por enquanto)
└── app/
    ├── layout.tsx                       # raiz: fontes, <html lang="pt-BR">, scripts de tema + Ajustes, providers
    ├── (landing)/                       # landing  →  /
    │   ├── page.tsx · page.module.scss   # SiteLoader + LandingScreen (landing normal ou da TV)
    │   ├── landing-layout/
    │   │   ├── LandingMain/             #   sections/ (Opening + Journey, Suites, Compare, Day,
    │   │   │                            #   Gallery, Numbers, Booking) · main-utils/ · main-hooks/ · aside/
    │   │   ├── LandingFooter/           #   FooterFragments/ (hélice de DNA) · footer-utils/
    │   │   └── overlays/                #   ProgressBar/ · ScrollCue/ ("Role para baixo")
    │   └── landing-tv/                  # a landing da TV: LandingScreen/ · TvLanding/ · TvArc/ · TvSection/
    ├── ambientes-3d/                    # desligada (sem page.tsx) — esqueleto da rota 3D
    ├── pagamentos/                      # /pagamentos (placeholder)
    ├── redefinir-senha/                 # /redefinir-senha (placeholder)
    ├── _shared/                         # compartilhado por todas as rotas
    │   ├── site-header/                 #   SiteHeaderLayout/ Mobile/ Desktop/ TV/ · header-hooks/ · header-utils/
    │   ├── panels/                      #   PanelProvider/ · SidePanel/ · settings-panel/ · account-panel/
    │   ├── settings-capsule/            #   cápsula fixa de Tema + Ajustes
    │   ├── smooth-scroll/               #   SmoothScrollProvider (Lenis + ScrollTrigger) · keyboard-scroll
    │   ├── auth/                        #   AuthProvider/ · GuestAvatar/ (hóspede de prévia, ainda sem API)
    │   ├── overlays/                    #   SectionCurtain/ · CustomCursor/ · TouchEffect/ · SiteLoader/ (tela de carregamento)
    │   └── lib/                         #   gsap · motion · scroll-frame · section-nav · header-bottom
    │                                    #   pointer-kind · tv-mode
    │                                    #   data/ (places, photos, day-moments, hotel-info) · api/ (vazia)
    └── _styles/                         # SÓ SCSS GLOBAL: main.scss · base/ · tools/
```

Alguns arquivos ainda estão vazios de propósito (trabalho futuro):
`_shared/lib/api/**`, `account-utils/social-items.ts` e os componentes de
`ambientes-3d`, `pagamentos` e `redefinir-senha`.

### 📐 Regras de estrutura

1. **Rotas são as pastas de `app/` que têm um `page.tsx`.** Mantenha-o enxuto e
   importe a interface da pasta irmã `*-layout` (ex.: `landing-layout/LandingMain`).
   Interface compartilhada que não pertence a uma única rota vai em `_shared/`.
2. **Idioma.** Só as pastas que viram segmento de URL são em português (minúsculas,
   com hífen, sem acento). Todo o resto — pastas, arquivos, funções, props, classes
   SCSS — é em inglês. O texto na tela e os comentários do código são em português.
3. **Uma pasta por componente**, com `Nome.tsx` + `Nome.module.scss`. Estes não
   têm `.module.scss`:
   - `layout.tsx`;
   - os providers (`PanelProvider`, `SettingsProvider`, `AuthProvider`,
     `SmoothScrollProvider`, `ActiveSectionProvider`);
   - `LandingScreen`, `HeaderIcons`, `SectionLink` e `SceneCanvas`;
   - os módulos `.ts` simples.
4. **Um lugar para cada fato.**
   - Lugares, fotos e preços: `lib/data/places.ts`.
   - Galeria: `photos.ts`.
   - "Sol a sol": `day-moments.ts`.
   - Endereço, contato, horários e políticas: `hotel-info.ts`.
   - Itens do menu: `header-items.ts`.
   - A landing da TV lê esses mesmos dados.
5. **`_shared/lib/api/` será o único lugar que conversa com o backend** (issues #24
   e #41). Componentes nunca chamam `fetch` direto.
6. **`_styles/` é só global e pequena.** Ela guarda o reset, as variáveis do
   `:root`, a tipografia, os Ajustes (`_settings.scss`), a landing da TV
   (`_tv.scss`) e `tools/` (variáveis, mixins, breakpoints).
7. **Alias de caminho:** `@/` → a raiz de `front-end/`.
8. **Server components por padrão.** Use `"use client"` só onde precisar de estado,
   efeitos ou APIs do navegador.
9. **Nada de `page.tsx` / `layout.tsx` / `loading.tsx` vazio.** Um arquivo vazio
   *não é um módulo* e quebra o `next build`.

---

## 📺 Landing da TV

- **Quando aparece.** O `LandingScreen` decide qual landing mostrar. Na TV (tela com
  pelo menos 2560 px de largura, detectada por `lib/pointer-kind.ts`), ou com `#tv`
  no fim do endereço, a página comprida dá lugar ao `TvLanding`, um coverflow curvo
  das seções.
- **Sem troca visível.** O servidor sempre desenha a landing normal. A troca
  acontece por baixo da tela de carregamento, então ninguém a vê.
- **O que a página da TV faz.** Ela marca `<html data-tv-landing>`, e o `_tv.scss`
  trava a rolagem da página e esconde o header.
- **O controle.** As setas andam entre as seções, e o "Voltar" funciona com os
  controles da Samsung e da LG.

---

## 💅 SCSS

- **Global:** `app/_styles/main.scss`, importado **uma vez** em `app/layout.tsx`.
- **Com escopo:** `Coisa.module.scss` ao lado de `Coisa.tsx`
  (`import styles from "./Coisa.module.scss"`, classes em camelCase). Use aninhamento
  que segue o HTML, `&` para estados, variáveis `$` e mixins com argumentos.
- **Ferramentas:** qualquer módulo pode escrever `@use "tools/mixins" as *;`, porque
  o `next.config.ts` define `sassOptions.includePaths: [app/_styles]`.
- **Fontes:** `--font-title`, `--font-body` e `--font-mono` já trazem suas
  alternativas; basta escrever `font-family: var(--font-body);`. Os Ajustes trocam
  essas três variáveis (`data-font` em `_settings.scss`).
- **Hover:** vai dentro de `@media (hover: hover)`, para telas de toque não ficarem
  com um hover "preso".
- **Live Sass Compiler:** o compilador do dev-container é **opcional**. Ele só gera
  a folha global em `app/_styles/css/` (ignorada pelo git). A aplicação nunca a lê.

---

## 🚀 Rodando

```bash
cd ../docker
docker compose up --build
```

Scripts (`package.json`):

| Script | Comando | Observação |
|--------|---------|------------|
| `pnpm dev` | `next dev` | as flags são `-p/--port` e `-H/--hostname` — **não** `--host` |
| `pnpm build` | `next build` | gera `.next/standalone` (`output: "standalone"`) |
| `pnpm start` | `next start` | serve o build (com standalone, o Next recomenda `node .next/standalone/server.js`) |
| `pnpm typecheck` | `tsc --noEmit` | confere os tipos sem gerar arquivos |

Não há script de `lint` nem de `test`. O ESLint não está instalado, e o `next lint`
está obsoleto no Next 15.5. Nenhum runner de testes está instalado.

---

## 🩺 Estado atual

| Verificação | Última vez | Resultado |
|-------------|------------|-----------|
| `pnpm typecheck` | 2026-11-24 | ✅ |
| `pnpm build` | 2026-11-14 | ✅ rotas `/`, `/_not-found`, `/pagamentos`, `/redefinir-senha` |
| Servidor standalone (`node server.js`, igual ao estágio `production` do Docker) | 2026-11-14 | ✅ `/` 200 · `/ambientes-3d` 404 |
| Hot reload no Docker | 2026-11-13 | ✅ `WATCHPACK_POLLING=true` no compose |
| Tela de carregamento: sem erro de hidratação, movimento reduzido, sem JavaScript | 2026-11-15 | ✅ |
| Landing no celular, tablet, computador e TV, claro/escuro, texto Normal/Grande/Maior | 2026-11-14 | ✅ sem rolagem horizontal da página (a comparação de suítes rola dentro de si no celular, de propósito) |

A tela de carregamento aparece em **toda visita e em toda atualização**. Ela não
aparece de novo quando você volta para `/` por um link interno.

**Instalado:** Next 15.5, React 19, Sass, TypeScript 5, GSAP 3 + @gsap/react 2
(ScrollTrigger) e Lenis 1.

**Não instalado** (adicionar quando precisar, perguntando antes):
react-three-fiber / three / drei, Vitest + Testing Library, ESLint, Prettier,
Stylelint.

---

## 🧭 Convenções

- **Componentes:** `PascalCase.tsx`, export default. Módulos simples
  (`header-items.ts`, `photos.ts`): `kebab-case.ts`.
- **Hooks:** `useCoisa.ts`, um hook por arquivo.
- **Estilos:** `Coisa.module.scss` ao lado do componente; globais só em `app/_styles/`.
- **Imports:** use `@/…` para qualquer coisa abaixo da raiz do projeto (`@/app/…`).
- **Fotos:** sempre passam por `photoSrc()` / `thumbSrc()` de `places.ts`, nunca por
  um caminho escrito à mão.

---

## 🧭 Documentação relacionada

[🏠 Visão geral](../README.pt-BR.md) ·
[🤝 Fluxo de contribuição](../.github/CONTRIBUTING.pt-BR.md) ·
[🐳 docker/](../docker/README.pt-BR.md) ·
[🧩 .devcontainer/](../.devcontainer/README.pt-BR.md) ·
[🤖 CLAUDE.md](CLAUDE.md)
&nbsp;&nbsp;|&nbsp;&nbsp; 🇬🇧 [English](README.md)
