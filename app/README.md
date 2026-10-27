# 🎨 `app/` — the web client

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
> header, `app/layout.tsx` and `app/page.tsx` already have code). See
> [Current status](#-current-status) for what builds and what doesn't.

---

## 🗂️ Folder structure

**Five folders at the top level of `src/`**, each split into subfolders — no loose
files except `styles/main.scss`. Every component is **its own folder** with
`Name.tsx` + `Name.module.scss` inside.

```
app/
├── package.json               # deps + scripts + "packageManager": pnpm (pnpm-lock.yaml is git-ignored)
├── pnpm-workspace.yaml        # pnpm settings: allowBuilds (dependency build-script decisions)
├── next.config.ts             # Next.js config — sassOptions.includePaths → src/styles
├── tsconfig.json              # TypeScript — alias  @/*  →  src/*
├── public/                    # served as-is at "/"
│   ├── photos/                #   images
│   └── scenes/                #   .glb / .gltf for the 3D scenes
└── src/
    ├── app/                   # ROUTES ONLY — page.tsx / layout.tsx (+ page.module.scss)
    │   ├── (front-desk)/front-desk/            # /front-desk · /front-desk/bookings/:code
    │   ├── (guest)/my-bookings/                # /my-bookings · /my-bookings/:code
    │   ├── booking/[code]/payment/             # /booking/:code/payment
    │   ├── chat/ · reset-password/             # /chat · /reset-password
    │   └── scenes/[scene]/                     # /scenes/:scene
    │
    ├── site/                  # everything 2D on the website
    │   ├── layout/            #   the frame of the site
    │   │   ├── site-header/   #     SiteHeaderLayout/ SiteHeaderDesktop/ SiteHeaderMobile/
    │   │   │   └── header-utils/        header-items.ts + HeaderBrand/ HeaderCta/ HeaderIcons/ HeaderNavList/
    │   │   ├── site-main/     #     SiteMainLayout/ MainAside/
    │   │   └── site-footer/   #     SiteFooterLayout/
    │   ├── sections/          #   landing sections: Opening, Journey, Suites, Compare,
    │   │                      #   Day, Models, Numbers, Booking  (each XxxSection/)
    │   ├── panels/            #   slide-over panels
    │   │   ├── panel-provider/      PanelProvider.tsx
    │   │   ├── account-panel/       AccountPanelLayout/ social-items.ts
    │   │   │   └── account-views/     SignIn/ SignUp/ ForgotPassword/ EmailSent/ SignedIn/
    │   │   └── settings-panel/      SettingsPanelLayout/
    │   └── overlays/          #   SiteLoader/ ProgressBar/ Cursor/
    │
    ├── scene/                 # 3D UI: SceneLayout/ SceneCanvas/ SceneTopBar/ SceneInfo/ SceneControls/
    │
    ├── lib/                   # non-UI code
    │   ├── api/
    │   │   ├── core/          #   client.ts, types.ts
    │   │   └── endpoints/     #   auth.ts, bookings.ts, payments.ts, chat.ts
    │   └── data/              #   places.ts, photos.ts
    │
    └── styles/                # GLOBAL SCSS ONLY
        ├── main.scss          #   single entry
        ├── base/              #   _index, _reset, _root, _typography, _scroll
        └── tools/             #   _variables, _mixins, _breakpoints
```

Every folder that holds empty `.ts` / `.tsx` placeholders contains a `.gitkeep`.

### 📐 Rules of the structure

1. **Routes only in `src/app/`.** A route folder holds `page.tsx` / `layout.tsx`
   and its `page.module.scss`; keep them thin and import UI from `site/` and
   `scene/`. `(front-desk)` and `(guest)` are **route groups** — the parentheses
   do not appear in the URL.
2. **Few folders at the top, many inside.** `src/` has five: `app/`, `site/`,
   `scene/`, `lib/`, `styles/`. A crowded folder is split into subfolders —
   never leave many loose files side by side.
3. **One folder per component**, named after it, holding `Name.tsx` +
   `Name.module.scss`. Exceptions: `app/layout.tsx` and `PanelProvider.tsx`
   have no `.module.scss`; plain `.ts` files (`header-items.ts`,
   `social-items.ts`, everything in `lib/`) have none either.
4. **`lib/api/` is the only place that talks to the backend**; components never
   call `fetch` directly. `lib/data/` holds static content.
5. **`src/styles/` is global only and small** — reset, `:root` variables,
   typography, scroll rules and `tools/` (variables, mixins, breakpoints).
6. **`public/` vs `src/`** — `public/` is copied verbatim (stable URLs: photos,
   `.glb` models); anything imported in code is bundled and hashed.
7. **Path alias:** `@/` → `src/`. Import the component file by its full path, e.g.
   `@/site/layout/site-header/SiteHeaderLayout/SiteHeaderLayout`.
8. **Server components by default.** Add `"use client"` only where you need
   state, effects or browser APIs (Cursor, panels, the scene canvas, animation).
9. **No empty `.ts`/`.tsx` once it is wired in** — an empty file is *not a module*
   and breaks `next build`. Pages/layouts need a default-exported component.

---

## 💅 SCSS

Next.js compiles SCSS natively once the `sass` package is installed — no config.

- **Global:** import `src/styles/main.scss` **once** from `src/app/layout.tsx`
  (`import "@/styles/main.scss"`). It is **not imported yet**.
- **Scoped:** `Thing.module.scss` next to `Thing.tsx`, imported as a CSS Module
  (`import styles from "./Thing.module.scss"`, classes in camelCase).
- **Shared tools:** any module can write `@use "tools/variables" as *;` because
  `next.config.ts` sets `sassOptions.includePaths: [src/styles]`.
- Live Sass Compiler output (`src/styles/css/`) **no longer exists**; the
  `glenn2223.live-sass` setting in the dev-container and the matching
  `.gitignore` entries are now unused leftovers.

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

Checked on 2026-10-25 in a clean copy (`pnpm install`, `tsc`, `next build`):

| Check | Result |
|-------|--------|
| `pnpm install` | ✅ 46 packages — but `next@15.0.3` is flagged (CVE-2025-66478); upgrade to a patched 15.x |
| `tsc --noEmit` | ✅ |
| `pnpm build` | ❌ empty `page.tsx` files → *"is not a module"* |
| `pnpm lint` | ❌ ESLint not installed |
| `docker compose` → `website` | ✅ `pnpm install` + `next dev -H 0.0.0.0 -p 5173` reach *Ready*; `GET /` is 500 until the route files export components |
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
- **Styles:** `Thing.module.scss` beside the component; globals only in `src/styles/`.
- **Imports:** use `@/…` for anything under `src/`.

---

## 🧭 Related docs

[🏠 Project overview](../README.md) ·
[🤝 Contribution workflow](../.github/CONTRIBUTING.md) ·
[🐳 docker/](../docker/README.md) ·
[🧩 .devcontainer/](../.devcontainer/README.md) ·
[🤖 CLAUDE.md](CLAUDE.md)
&nbsp;&nbsp;|&nbsp;&nbsp; 🇧🇷 [Português](README.pt-BR.md)
