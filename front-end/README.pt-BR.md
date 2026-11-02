# 🎨 `front-end/` — o cliente web

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
> **placeholder vazio** (o header do site, o `layout.tsx` e o `page.tsx` da landing
> já têm código). Veja o [Status atual](#-status-atual) para saber o que compila e
> o que não.

---

## 🗂️ Estrutura de pastas

Tudo fica em `app/`. O Next.js só exige `layout.tsx` / `page.tsx` ali; pastas
que começam com `_` são **privadas** (nunca viram rota) e `(nome)` é um **grupo de
rota** (não aparece na URL). **Só as pastas que viram um trecho da URL ficam em
português** — o site é pt-BR e o Next.js monta a URL a partir do nome da pasta.
Tudo que não é rota fica em **inglês**: pastas de componente (PascalCase, cada uma
com `Nome.tsx` + `Nome.module.scss`), arquivos, funções e classes.

```
front-end/
├── package.json · pnpm-workspace.yaml · next.config.ts · tsconfig.json
├── public/
│   ├── photos/                          # imagens
│   └── scenes/                          # .glb / .gltf das cenas 3D
└── app/
    ├── layout.tsx                       # raiz: fontes, <html lang="pt-BR">, header, SCSS global
    ├── (landing)/                        # landing  →  /
    │   ├── page.tsx · page.module.scss · loading.tsx
    │   └── landing-layout/
    │       ├── LandingMain/             #   sections/ (8 × XxxSection) · aside/ (MainAside, account-panel/)
    │       ├── LandingFooter/
    │       └── overlays/           #   ProgressBar/ Cursor/
    ├── ambientes-3d/                    # /ambientes-3d · /ambientes-3d/[ambiente]
    │   ├── _r3f/SceneCanvas/            #   o canvas r3f (sem .module.scss)
    │   └── ambients-layout/AmbientsMain/   # + SceneLayout/ SceneTopBar/ SceneInfo/ SceneControls/
    ├── pagamentos/                      # /pagamentos
    ├── redefinir-senha/                 # /redefinir-senha (sem loading.tsx)
    ├── _shared/                  # compartilhado por todas as rotas
    │   ├── site-header/              #   SiteHeaderLayout/ Mobile/ Desktop/ TV/ · header-hooks/ · header-utils/
    │   ├── panels/                     #   PanelProvider/ · settings-panel/SettingsPanel/
    │   ├── overlays/               #   SiteLoader/
    │   └── lib/                  #   api/{core, endpoints}/ · data/
    └── _styles/                        # SOMENTE SCSS GLOBAL: main.scss · base/ · tools/
```

Toda pasta que contém placeholders `.ts` / `.tsx` vazios tem um `.gitkeep`.

### 📐 Regras da estrutura

1. **Rotas são as pastas de `app/` com um `page.tsx`.** Mantenha-o enxuto e
   importe a UI da pasta `*-layout` vizinha (ex.: `landing-layout/LandingMain`).
   UI compartilhada que não pertence a uma rota só vai em `_shared/`.
2. **Idioma.** Só as pastas que viram um trecho da URL ficam em português
   (minúsculas, com hífen, sem acento), porque o site é pt-BR e a URL espelha o nome
   da pasta. Todo o resto — pastas, arquivos, funções, props, classes do SCSS — fica
   em inglês, inclusive os grupos de rota, como `(landing)`. Texto que o usuário lê na
   tela: português.
3. **Uma pasta por componente**, com o nome dele, guardando `Nome.tsx` +
   `Nome.module.scss`. Exceções sem `.module.scss`: `layout.tsx`,
   `PanelProvider.tsx`, `SceneCanvas.tsx` e os `.ts` simples (`header-items.ts`,
   `social-items.ts`, tudo em `lib/`).
4. **`_shared/lib/api/` é o único lugar que fala com o backend**;
   componentes nunca chamam `fetch` direto. `data/` guarda conteúdo estático.
5. **`_styles/` é só global e pequena** — reset, variáveis `:root`, tipografia,
   regras de scroll e `tools/` (variáveis, mixins, breakpoints).
6. **`public/` vs `app/`** — `public/` é copiado literalmente (URLs estáveis:
   fotos, modelos `.glb`); o que é importado no código é empacotado com hash.
7. **Alias de path:** `@/` → a raiz de `front-end/`. Importe o arquivo do componente pelo caminho
   completo, ex.: `@/app/_shared/site-header/SiteHeaderLayout/SiteHeaderLayout`.
8. **Server components por padrão.** Use `"use client"` só onde precisar de
   estado, efeitos ou APIs do navegador (Cursor, painéis, canvas da cena, animação).
9. **Nada de `page.tsx` / `layout.tsx` / `loading.tsx` vazio** — arquivo vazio *não é
   módulo* e quebra o `next build`. Os params dinâmicos são uma `Promise` no Next 15.

---

## 💅 SCSS

O Next.js compila SCSS nativamente quando o pacote `sass` está instalado.

- **Global:** `app/_styles/main.scss`, importado **uma vez** em `app/layout.tsx`
  (`import "./_styles/main.scss"`).
- **Escopado:** `Coisa.module.scss` ao lado de `Coisa.tsx`, importado como CSS Module
  (`import styles from "./Coisa.module.scss"`, classes em camelCase). Use aninhamento
  (`&` para estados e modificadores), variáveis `$` e mixins com argumentos.
- **Ferramentas compartilhadas:** qualquer módulo pode escrever
  `@use "tools/variables" as *;` porque o `next.config.ts` define
  `sassOptions.includePaths: [app/_styles]`. Cada módulo faz `@use` só do que
  usa (`tools/breakpoints`, `tools/variables`, `tools/mixins`).
- A saída do Live Sass Compiler não existe mais; a configuração
  `glenn2223.live-sass` do dev-container e as entradas correspondentes do
  `.gitignore` são sobras sem uso.

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

Verificado em 2026-11-02 numa cópia limpa no Windows (`pnpm install`, `tsc`, `next build`):

| Verificação | Resultado |
|-------------|-----------|
| `pnpm install` | ✅ 46 pacotes — mas o `next@15.0.3` está sinalizado (CVE-2025-66478); atualize para um 15.x corrigido |
| `tsc --noEmit` | ✅ |
| `pnpm build` | ✅ 6 rotas (`/`, `/ambientes-3d`, `/ambientes-3d/[ambiente]`, `/pagamentos`, `/redefinir-senha`, `/_not-found`) |
| `pnpm lint` | ❌ ESLint não instalado |
| `docker compose` → `website` | ✅ `pnpm install` + `next dev -H 0.0.0.0 -p 5173` chegam a *Ready* (verificado em 2026-10-26; os caminhos eram `app/`, agora `front-end/`) |
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
- **Estilos:** `Coisa.module.scss` ao lado do componente; globais só em `app/_styles/`.
- **Imports:** use `@/…` para qualquer coisa a partir da raiz (`@/app/…`).

---

## 🧭 Documentação relacionada

[🏠 Visão geral](../README.pt-BR.md) ·
[🤝 Fluxo de contribuição](../.github/CONTRIBUTING.pt-BR.md) ·
[🐳 docker/](../docker/README.pt-BR.md) ·
[🧩 .devcontainer/](../.devcontainer/README.pt-BR.md) ·
[🤖 CLAUDE.md](CLAUDE.md)
&nbsp;&nbsp;|&nbsp;&nbsp; 🇬🇧 [English](README.md)
