# 🎨 `front-end/` — the web client

<p>
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-15-000000?logo=nextdotjs&logoColor=white">
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white">
  <img alt="Sass" src="https://img.shields.io/badge/SCSS-1.80-CC6699?logo=sass&logoColor=white">
</p>

**🌐 Language:** **English** · [Português](README.pt-BR.md)

This folder is the entire front-end. It is **bind-mounted into `/app`** inside the
container (see [`../docker/README.md`](../docker/README.md)), so anything you do
here is what runs.

> ⚠️ **Work in progress.** The route tree, folders and SCSS partials exist, but
> most `.ts` / `.tsx` / `.scss` files are still **empty placeholders** (the site
> header, `layout.tsx` and the landing `page.tsx` already have code). See
> [Current status](#-current-status) for what builds and what doesn't.

---

## 🗂️ Folder structure

Everything lives in `app/`. Next.js only needs `layout.tsx` / `page.tsx` there;
folders starting with `_` are **private** (never routes) and `(name)` is a **route
group (not part of the URL). **Only folders that become a URL segment are in
Portuguese** — the site is pt-BR and Next.js builds the URL from the folder name.
Everything that is not a route is **English**: component folders (PascalCase, each
holding `Name.tsx` + `Name.module.scss`), files, functions and classes.

```
front-end/
├── package.json · pnpm-workspace.yaml · next.config.ts · tsconfig.json
├── public/
│   ├── photos/                          # images
│   └── scenes/                          # .glb / .gltf for the 3D scenes
└── app/
    ├── layout.tsx                       # root: fonts, <html lang="pt-BR">, header, global SCSS
    ├── (landing)/                        # landing  →  /
    │   ├── page.tsx · page.module.scss · loading.tsx
    │   └── landing-layout/
    │       ├── LandingMain/             #   sections/ (8 × XxxSection) · aside/ (MainAside, account-panel/)
    │       ├── LandingFooter/
    │       └── overlays/           #   ProgressBar/ Cursor/
    ├── ambientes-3d/                    # /ambientes-3d · /ambientes-3d/[ambiente]
    │   ├── _r3f/SceneCanvas/            #   the r3f canvas (no .module.scss)
    │   └── ambients-layout/AmbientsMain/   # + SceneLayout/ SceneTopBar/ SceneInfo/ SceneControls/
    ├── pagamentos/                      # /pagamentos
    ├── redefinir-senha/                 # /redefinir-senha (no loading.tsx)
    ├── _shared/                  # shared by every route
    │   ├── site-header/              #   SiteHeaderLayout/ Mobile/ Desktop/ TV/ · header-hooks/ · header-utils/
    │   ├── panels/                     #   PanelProvider/ · settings-panel/SettingsPanel/
    │   ├── overlays/               #   SiteLoader/
    │   └── lib/                  #   api/{core, endpoints}/ · data/
    └── _styles/                        # GLOBAL SCSS ONLY: main.scss · base/ · tools/
```

Every folder that holds empty `.ts` / `.tsx` placeholders contains a `.gitkeep`.

### 📐 Rules of the structure

1. **Routes are folders of `app/` with a `page.tsx`.** Keep it thin and import
   the UI from the sibling `*-layout` folder (e.g. `landing-layout/LandingMain`).
   Shared UI that is not tied to one route lives in `_shared/`.
2. **Language.** Only folders that become a URL segment are Portuguese (lowercase,
   hyphens, no accents), because the site is pt-BR and the URL mirrors the folder
   name. Everything else — folders, files, functions, props, SCSS classes — is
   English, route groups such as `(landing)` included.
   Text shown to the user: Portuguese.
3. **One folder per component**, named after it, holding `Name.tsx` +
   `Name.module.scss`. Exceptions without `.module.scss`: `layout.tsx`,
   `PanelProvider.tsx`, `SceneCanvas.tsx`, and plain `.ts` files (`header-items.ts`,
   `social-items.ts`, everything in `lib/`).
4. **`_shared/lib/api/` is the only place that talks to the
   backend**; components never call `fetch` directly. `data/` holds static content.
5. **`_styles/` is global only and small** — reset, `:root` variables, typography,
   scroll rules and `tools/` (variables, mixins, breakpoints).
6. **`public/` vs `app/`** — `public/` is copied verbatim (stable URLs: photos,
   `.glb` models); anything imported in code is bundled and hashed.
7. **Path alias:** `@/` → the `front-end/` root. Import the component file by its full path, e.g.
   `@/app/_shared/site-header/SiteHeaderLayout/SiteHeaderLayout`.
8. **Server components by default.** Add `"use client"` only where you need
   state, effects or browser APIs (Cursor, panels, the scene canvas, animation).
9. **No empty `page.tsx` / `layout.tsx` / `loading.tsx`** — an empty file is *not a
   module* and breaks `next build`. Dynamic params are a `Promise` in Next 15.

---

## 💅 SCSS

Next.js compiles SCSS natively once the `sass` package is installed.

- **Global:** `app/_styles/main.scss`, imported **once** in `app/layout.tsx`
  (`import "./_styles/main.scss"`).
- **Scoped:** `Thing.module.scss` next to `Thing.tsx`, imported as a CSS Module
  (`import styles from "./Thing.module.scss"`, classes in camelCase). Use nesting
  (`&` for states and modifiers), `$` variables and mixins with arguments.
- **Shared tools:** any module can write `@use "tools/variables" as *;`
  because `next.config.ts` sets `sassOptions.includePaths: [app/_styles]`.
  Each module `@use`s only what it needs (`tools/breakpoints`,
  `tools/variables`, `tools/mixins`).
- Live Sass Compiler output no longer exists; the `glenn2223.live-sass` setting
  in the dev-container and the matching `.gitignore` entries are unused leftovers.

---

## 🚀 Running

```bash
cd ../docker
docker compose -f docker-compose.yml up --build
```

Scripts (`package.json`):

| Script | Command | Note |
|--------|---------|------|
| `pnpm dev` | `next dev` | Next binds `0.0.0.0` by default; flags are `-p/--port`, `-H/--hostname` — **not** `--host` |
| `pnpm build` | `next build` | needs every route file to export a component |
| `pnpm start` | `next start` | serves the `.next/` build |
| `pnpm lint` | `next lint` | needs `eslint` + `eslint-config-next` (not installed yet) |

---

## 🩺 Current status

Checked on 2026-11-02 in a clean copy on Windows (`pnpm install`, `tsc`, `next build`):

| Check | Result |
|-------|--------|
| `pnpm install` | ✅ 46 packages — but `next@15.0.3` is flagged (CVE-2025-66478); upgrade to a patched 15.x |
| `tsc --noEmit` | ✅ |
| `pnpm build` | ✅ 6 routes (`/`, `/ambientes-3d`, `/ambientes-3d/[ambiente]`, `/pagamentos`, `/redefinir-senha`, `/_not-found`) |
| `pnpm lint` | ❌ ESLint not installed |
| `docker compose` → `website` | ✅ `pnpm install` + `next dev -H 0.0.0.0 -p 5173` reach *Ready* (verified on 2026-10-26; the paths were then `app/`, now `front-end/`) |
| `docker compose` → `tests` | ❌ runs `pnpm run test:ui`, script removed |
| Docker `build` / `production` target | ❌ expects a static `dist/` + nginx; Next emits `.next/` |
| Hot reload in Docker | ✅ `WATCHPACK_POLLING=true` set in compose; SCSS edits show up in ~4-20s |

Not installed (add when needed, ask first): GSAP, react-three-fiber / three /
drei, Vitest + Testing Library, ESLint, Prettier, Stylelint.

---

## 🧭 Conventions

- **Components:** `PascalCase.tsx`, default export. Plain modules
  (`header-items.ts`, `photos.ts`): lowercase / `kebab-case.ts`.
- **Hooks:** `useThing.ts`, one hook per file.
- **Styles:** `Thing.module.scss` beside the component; globals only in `app/_styles/`.
- **Imports:** use `@/…` for anything under the project root (`@/app/…`).

---

## 🧭 Related docs

[🏠 Project overview](../README.md) ·
[🤝 Contribution workflow](../.github/CONTRIBUTING.md) ·
[🐳 docker/](../docker/README.md) ·
[🧩 .devcontainer/](../.devcontainer/README.md) ·
[🤖 CLAUDE.md](CLAUDE.md)
&nbsp;&nbsp;|&nbsp;&nbsp; 🇧🇷 [Português](README.pt-BR.md)
