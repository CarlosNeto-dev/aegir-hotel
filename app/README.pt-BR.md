# 🎨 `app/` — o cliente web

<p>
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-15-000000?logo=nextdotjs&logoColor=white">
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white">
  <img alt="Sass" src="https://img.shields.io/badge/SCSS-1.80-CC6699?logo=sass&logoColor=white">
</p>

**🌐 Idioma:** [English](README.md) · **Português**

Esta pasta é todo o front-end. Ela é **montada como volume em `/app`** dentro do
container (veja [`../docker/README.pt-BR.md`](../docker/README.pt-BR.md)), então
tudo que você faz aqui é o que roda.

> ⚠️ **Em andamento.** A árvore de rotas, as pastas e os parciais de SCSS
> existem, mas a maioria dos arquivos `.ts` / `.tsx` / `.scss` ainda é
> **placeholder vazio** (o header do site, `app/layout.tsx` e `app/page.tsx` já
> têm código). Veja o [Status atual](#-status-atual) para saber o que compila e
> o que não.

---

## 🗂️ Estrutura de pastas

**Cinco pastas no primeiro nível de `src/`**, cada uma dividida em subpastas —
nenhum arquivo solto, exceto `styles/main.scss`. Todo componente é **a sua própria
pasta**, com `Nome.tsx` + `Nome.module.scss` dentro.

```
app/
├── package.json               # deps + scripts + "packageManager": pnpm (pnpm-lock.yaml está no .gitignore)
├── pnpm-workspace.yaml        # config do pnpm: allowBuilds (decisões de build-scripts das deps)
├── next.config.ts             # config do Next.js — sassOptions.includePaths → src/styles
├── tsconfig.json              # TypeScript — alias  @/*  →  src/*
├── public/                    # servido como está em "/"
│   ├── photos/                #   imagens
│   └── scenes/                #   .glb / .gltf das cenas 3D
└── src/
    ├── app/                   # SÓ ROTAS — page.tsx / layout.tsx (+ page.module.scss)
    │   ├── (front-desk)/front-desk/            # /front-desk · /front-desk/bookings/:code
    │   ├── (guest)/my-bookings/                # /my-bookings · /my-bookings/:code
    │   ├── booking/[code]/payment/             # /booking/:code/payment
    │   ├── chat/ · reset-password/             # /chat · /reset-password
    │   └── scenes/[scene]/                     # /scenes/:scene
    │
    ├── site/                  # tudo o que é 2D no site
    │   ├── layout/            #   a moldura do site
    │   │   ├── site-header/   #     SiteHeaderLayout/ SiteHeaderDesktop/ SiteHeaderMobile/
    │   │   │   └── header-utils/        header-items.ts + HeaderBrand/ HeaderCta/ HeaderIcons/ HeaderNavList/
    │   │   ├── site-main/     #     SiteMainLayout/ MainAside/
    │   │   └── site-footer/   #     SiteFooterLayout/
    │   ├── sections/          #   seções da landing: Opening, Journey, Suites, Compare,
    │   │                      #   Day, Models, Numbers, Booking  (cada uma XxxSection/)
    │   ├── panels/            #   painéis laterais
    │   │   ├── panel-provider/      PanelProvider.tsx
    │   │   ├── account-panel/       AccountPanelLayout/ social-items.ts
    │   │   │   └── account-views/     SignIn/ SignUp/ ForgotPassword/ EmailSent/ SignedIn/
    │   │   └── settings-panel/      SettingsPanelLayout/
    │   └── overlays/          #   SiteLoader/ ProgressBar/ Cursor/
    │
    ├── scene/                 # UI 3D: SceneLayout/ SceneCanvas/ SceneTopBar/ SceneInfo/ SceneControls/
    │
    ├── lib/                   # código que não é UI
    │   ├── api/
    │   │   ├── core/          #   client.ts, types.ts
    │   │   └── endpoints/     #   auth.ts, bookings.ts, payments.ts, chat.ts
    │   └── data/              #   places.ts, photos.ts
    │
    └── styles/                # SOMENTE SCSS GLOBAL
        ├── main.scss          #   entrada única
        ├── base/              #   _index, _reset, _root, _typography, _scroll
        └── tools/             #   _variables, _mixins, _breakpoints
```

Toda pasta que contém placeholders `.ts` / `.tsx` vazios tem um `.gitkeep`.

### 📐 Regras da estrutura

1. **Rotas só em `src/app/`.** Uma pasta de rota guarda `page.tsx` / `layout.tsx`
   e o `page.module.scss`; mantenha-os enxutos e importe a UI de `site/` e
   `scene/`. `(front-desk)` e `(guest)` são **grupos de rota** — os parênteses não
   aparecem na URL.
2. **Poucas pastas em cima, muitas dentro.** `src/` tem cinco: `app/`, `site/`,
   `scene/`, `lib/`, `styles/`. Pasta lotada é dividida em subpastas — nunca
   deixe vários arquivos soltos lado a lado.
3. **Uma pasta por componente**, com o nome dele, guardando `Nome.tsx` +
   `Nome.module.scss`. Exceções: `app/layout.tsx` e `PanelProvider.tsx` não têm
   `.module.scss`; os `.ts` simples (`header-items.ts`, `social-items.ts`, tudo em
   `lib/`) também não.
4. **`lib/api/` é o único lugar que fala com o backend**; componentes nunca
   chamam `fetch` direto. `lib/data/` guarda conteúdo estático.
5. **`src/styles/` é só global e pequena** — reset, variáveis `:root`,
   tipografia, regras de scroll e `tools/` (variáveis, mixins, breakpoints).
6. **`public/` vs `src/`** — `public/` é copiado literalmente (URLs estáveis:
   fotos, modelos `.glb`); o que é importado no código é empacotado com hash.
7. **Alias de path:** `@/` → `src/`. Importe o arquivo do componente pelo caminho
   completo, ex.: `@/site/layout/site-header/SiteHeaderLayout/SiteHeaderLayout`.
8. **Server components por padrão.** Use `"use client"` só onde precisar de
   estado, efeitos ou APIs do navegador (Cursor, painéis, canvas da cena, animação).
9. **Nada de `.ts`/`.tsx` vazio depois de ligado** — arquivo vazio *não é módulo*
   e quebra o `next build`. Páginas/layouts precisam de um componente como export default.

---

## 💅 SCSS

O Next.js compila SCSS nativamente quando o pacote `sass` está instalado — sem config.

- **Global:** importe `src/styles/main.scss` **uma vez** em `src/app/layout.tsx`
  (`import "@/styles/main.scss"`). Ainda **não está importado**.
- **Escopado:** `Coisa.module.scss` ao lado de `Coisa.tsx`, importado como CSS Module
  (`import styles from "./Coisa.module.scss"`, classes em camelCase).
- **Ferramentas compartilhadas:** qualquer módulo pode escrever `@use "tools/variables" as *;`
  porque o `next.config.ts` define
  `sassOptions.includePaths: [src/styles]`.
- A saída do Live Sass Compiler (`src/styles/css/`) **não existe mais**; a
  configuração `glenn2223.live-sass` do dev-container e as entradas
  correspondentes do `.gitignore` são sobras sem uso.

---

## 🚀 Executando

```bash
cd ../docker
docker compose -f docker-compose.yml up --build
```

Scripts (`package.json`):

| Script | Comando | Obs. |
|--------|---------|------|
| `pnpm dev` | `next dev` | o Next escuta `0.0.0.0` por padrão; as flags são `-p/--port`, `-H/--hostname` — **não** `--host` |
| `pnpm build` | `next build` | exige que todo arquivo de rota exporte um componente |
| `pnpm start` | `next start` | serve o build de `.next/` |
| `pnpm lint` | `next lint` | precisa de `eslint` + `eslint-config-next` (ainda não instalados) |

---

## 🩺 Status atual

Verificado em 2026-10-25 numa cópia limpa (`pnpm install`, `tsc`, `next build`):

| Verificação | Resultado |
|-------------|-----------|
| `pnpm install` | ✅ 46 pacotes — mas o `next@15.0.3` está sinalizado (CVE-2025-66478); atualize para um 15.x corrigido |
| `tsc --noEmit` | ✅ |
| `pnpm build` | ❌ `page.tsx` vazios → *"is not a module"* |
| `pnpm lint` | ❌ ESLint não instalado |
| `docker compose` → `website` | ✅ `pnpm install` + `next dev -H 0.0.0.0 -p 5173` chegam a *Ready*; `GET /` dá 500 até os arquivos de rota exportarem componentes |
| `docker compose` → `tests` | ❌ roda `pnpm run test:ui`, script removido |
| Alvo Docker `build` / `production` | ❌ espera um `dist/` estático + nginx; o Next gera `.next/` |
| Hot reload no Docker | ✅ `WATCHPACK_POLLING=true` definido no compose; edições de SCSS aparecem em ~4-20s |

Não instalados (adicione quando precisar, pergunte antes): GSAP, react-three-fiber /
three / drei, Vitest + Testing Library, ESLint, Prettier, Stylelint.

---

## 🧭 Convenções

- **Componentes:** `PascalCase.tsx`, export default. Módulos simples
  (`header-items.ts`, `photos.ts`): minúsculo / `kebab-case.ts`.
- **Hooks:** `useCoisa.ts`, um hook por arquivo.
- **Estilos:** `Coisa.module.scss` ao lado do componente; globais só em `src/styles/`.
- **Imports:** use `@/…` para qualquer coisa dentro de `src/`.

---

## 🧭 Documentação relacionada

[🏠 Visão geral](../README.pt-BR.md) ·
[🤝 Fluxo de contribuição](../.github/CONTRIBUTING.pt-BR.md) ·
[🐳 docker/](../docker/README.pt-BR.md) ·
[🧩 .devcontainer/](../.devcontainer/README.pt-BR.md) ·
[🤖 CLAUDE.md](CLAUDE.md)
&nbsp;&nbsp;|&nbsp;&nbsp; 🇬🇧 [English](README.md)
