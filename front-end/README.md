# 🎨 `front-end/` — the web client

<p>
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-15.5-000000?logo=nextdotjs&logoColor=white">
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white">
  <img alt="Sass" src="https://img.shields.io/badge/SCSS-1.80%2B-CC6699?logo=sass&logoColor=white">
  <img alt="GSAP" src="https://img.shields.io/badge/GSAP-3-88CE02?logo=greensock&logoColor=black">
</p>

**🌐 Language:** **English** · [Português](README.pt-BR.md)

This folder is the entire front-end. It is **bind-mounted into `/app`** inside the
container (see [`../docker/README.md`](../docker/README.md)), so anything you do
here is what runs.

> ✅ **The landing page (`/`) is built.** It has:
> - a header for phone, tablet/desktop and TV;
> - main: seven sections, a side index and a progress bar;
> - a footer, Simple or Fragments, chosen in Settings;
> - the Settings and Account panels. Account is visual only; the API arrives with
>   issues #23–#29 and #41.
>
> On a TV, or with `#tv` at the end of the address, the landing becomes a curved
> coverflow driven by the remote. `/pagamentos` and `/redefinir-senha` are
> placeholders, and `/ambientes-3d` is switched off until the 3D scenes exist. See
> [Current status](#-current-status).

---

## 🗂️ Folder structure

Everything lives in `app/`. Folders starting with `_` are **private** (never
routes), and `(name)` is a **route group** (not in the URL). **Only folders that
become a URL segment are Portuguese**; everything else is **English**.

```
front-end/
├── package.json · pnpm-workspace.yaml · next.config.ts · tsconfig.json
├── public/
│   ├── photos/ (+ thumbs/)              # hotel photos in .webp (and menu thumbnails)
│   ├── videos/settings/                 # Settings demo videos (.webm + .mp4)
│   └── scenes/                          # reserved for the 3D .glb files (empty for now)
└── app/
    ├── layout.tsx                       # root: fonts, <html lang="pt-BR">, theme + Settings scripts, providers
    ├── (landing)/                       # landing  →  /
    │   ├── page.tsx · page.module.scss   # SiteLoader + LandingScreen (normal or TV landing)
    │   ├── landing-layout/
    │   │   ├── LandingMain/             #   sections/ (Opening + Journey, Suites, Compare, Day,
    │   │   │                            #   Gallery, Numbers, Booking) · main-utils/ · main-hooks/ · aside/
    │   │   ├── LandingFooter/           #   FooterFragments/ (DNA helix) · footer-utils/
    │   │   └── overlays/                #   ProgressBar/ · ScrollCue/ ("Role para baixo")
    │   └── landing-tv/                  # the TV landing: LandingScreen/ · TvLanding/ · TvArc/ · TvSection/
    ├── ambientes-3d/                    # switched off (no page.tsx) — scaffold for the 3D route
    ├── pagamentos/                      # /pagamentos (placeholder)
    ├── redefinir-senha/                 # /redefinir-senha (placeholder)
    ├── _shared/                         # shared by every route
    │   ├── site-header/                 #   SiteHeaderLayout/ Mobile/ Desktop/ TV/ · header-hooks/ · header-utils/
    │   ├── panels/                      #   PanelProvider/ · SidePanel/ · settings-panel/ · account-panel/
    │   ├── settings-capsule/            #   fixed Theme + Settings capsule
    │   ├── smooth-scroll/               #   SmoothScrollProvider (Lenis + ScrollTrigger) · keyboard-scroll
    │   ├── auth/                        #   AuthProvider/ · GuestAvatar/ (preview guest, no API yet)
    │   ├── overlays/                    #   SectionCurtain/ · CustomCursor/ · TouchEffect/ · SiteLoader/ (loading screen)
    │   └── lib/                         #   gsap · motion · scroll-frame · section-nav · header-bottom
    │                                    #   pointer-kind · tv-mode
    │                                    #   data/ (places, photos, day-moments, hotel-info) · api/ (empty)
    └── _styles/                         # GLOBAL SCSS ONLY: main.scss · base/ · tools/
```

Some files are still empty on purpose (future work): `_shared/lib/api/**`,
`account-utils/social-items.ts`, and the components of `ambientes-3d`,
`pagamentos` and `redefinir-senha`.

### 📐 Structure rules

1. **Routes are the folders of `app/` that have a `page.tsx`.** Keep it thin and
   import the UI from the sibling `*-layout` folder (e.g. `landing-layout/LandingMain`).
   Shared UI that belongs to no single route goes in `_shared/`.
2. **Language.** Only folders that become a URL segment are Portuguese
   (lowercase, hyphenated, no accents). Everything else — folders, files,
   functions, props, SCSS classes — is English. On-screen text and code comments
   are Portuguese.
3. **One folder per component**, holding `Name.tsx` + `Name.module.scss`. These
   have no `.module.scss`:
   - `layout.tsx`;
   - the providers (`PanelProvider`, `SettingsProvider`, `AuthProvider`,
     `SmoothScrollProvider`, `ActiveSectionProvider`);
   - `LandingScreen`, `HeaderIcons`, `SectionLink` and `SceneCanvas`;
   - plain `.ts` modules.
4. **One place per fact.**
   - Places, photos and prices: `lib/data/places.ts`.
   - Gallery: `photos.ts`.
   - "Sol a sol": `day-moments.ts`.
   - Address, contact, hours and policies: `hotel-info.ts`.
   - Menu items: `header-items.ts`.
   - The TV landing reads the same data.
5. **`_shared/lib/api/` will be the only place that talks to the backend** (issues
   #24 and #41). Components never call `fetch` directly.
6. **`_styles/` is global-only and small.** It holds the reset, the `:root`
   variables, typography, Settings (`_settings.scss`), the TV landing (`_tv.scss`)
   and `tools/` (variables, mixins, breakpoints).
7. **Path alias:** `@/` → the `front-end/` root.
8. **Server components by default.** Use `"use client"` only where you need state,
   effects or browser APIs.
9. **No empty `page.tsx` / `layout.tsx` / `loading.tsx`.** An empty file is
   *not a module* and breaks `next build`.

---

## 📺 TV landing

- **When it appears.** `LandingScreen` decides which landing to show. On a TV
  (screen at least 2560 px wide, detected by `lib/pointer-kind.ts`), or with `#tv`
  at the end of the address, the long page is replaced by `TvLanding`, a curved
  coverflow of the sections.
- **No visible swap.** The server always renders the normal landing. The swap
  happens under the loading screen, so nobody sees it.
- **What the TV page does.** It marks `<html data-tv-landing>`, so `_tv.scss`
  locks the page scroll and hides the header.
- **The remote.** The arrows move between sections, and "Back" works with the
  Samsung and LG remotes.

---

## 💅 SCSS

- **Global:** `app/_styles/main.scss`, imported **once** in `app/layout.tsx`.
- **Scoped:** `Thing.module.scss` next to `Thing.tsx`
  (`import styles from "./Thing.module.scss"`, camelCase classes). Use nesting that
  follows the HTML, `&` for states, `$` variables and mixins with arguments.
- **Tools:** any module can write `@use "tools/mixins" as *;`, because
  `next.config.ts` sets `sassOptions.includePaths: [app/_styles]`.
- **Fonts:** `--font-title`, `--font-body` and `--font-mono` already carry their
  fallbacks; just write `font-family: var(--font-body);`. Settings swaps those
  three variables (`data-font` in `_settings.scss`).
- **Hover:** goes inside `@media (hover: hover)`, so touch screens don't keep a
  "stuck" hover.
- **Live Sass Compiler:** the dev-container's compiler is **optional**. It only
  builds the global sheet into `app/_styles/css/` (git-ignored). The app never
  reads it.

---

## 🚀 Running

```bash
cd ../docker
docker compose up --build
```

Scripts (`package.json`):

| Script | Command | Note |
|--------|---------|------|
| `pnpm dev` | `next dev` | flags are `-p/--port` and `-H/--hostname` — **not** `--host` |
| `pnpm build` | `next build` | produces `.next/standalone` (`output: "standalone"`) |
| `pnpm start` | `next start` | serves the build (with standalone, Next recommends `node .next/standalone/server.js`) |
| `pnpm typecheck` | `tsc --noEmit` | checks types without emitting files |

There is no `lint` or `test` script. ESLint is not installed, and `next lint` is
deprecated in Next 15.5. No test runner is installed.

---

## 🩺 Current status

| Check | Last verified | Result |
|-------|---------------|--------|
| `pnpm typecheck` | 2026-11-24 | ✅ |
| `pnpm build` | 2026-11-14 | ✅ routes `/`, `/_not-found`, `/pagamentos`, `/redefinir-senha` |
| Standalone server (`node server.js`, same as the Docker `production` stage) | 2026-11-14 | ✅ `/` 200 · `/ambientes-3d` 404 |
| Hot reload in Docker | 2026-11-13 | ✅ `WATCHPACK_POLLING=true` in compose |
| Loading screen: no hydration error, reduced motion, no JavaScript | 2026-11-15 | ✅ |
| Landing on phone, tablet, desktop and TV, light/dark, text Normal/Large/Larger | 2026-11-14 | ✅ no horizontal page scroll (the suite comparison scrolls inside itself on phones, on purpose) |

The loading screen appears on **every visit and every reload**. It does not appear
again when you come back to `/` through an internal link.

**Installed:** Next 15.5, React 19, Sass, TypeScript 5, GSAP 3 + @gsap/react 2
(ScrollTrigger) and Lenis 1.

**Not installed** (add when needed, ask first): react-three-fiber / three / drei,
Vitest + Testing Library, ESLint, Prettier, Stylelint.

---

## 🧭 Conventions

- **Components:** `PascalCase.tsx`, default export. Plain modules
  (`header-items.ts`, `photos.ts`): `kebab-case.ts`.
- **Hooks:** `useThing.ts`, one hook per file.
- **Styles:** `Thing.module.scss` beside the component; globals only in `app/_styles/`.
- **Imports:** use `@/…` for anything under the project root (`@/app/…`).
- **Photos:** always go through `photoSrc()` / `thumbSrc()` from `places.ts`, never
  a hand-written path.

---

## 🧭 Related docs

[🏠 Project overview](../README.md) ·
[🤝 Contribution workflow](../.github/CONTRIBUTING.md) ·
[🐳 docker/](../docker/README.md) ·
[🧩 .devcontainer/](../.devcontainer/README.md) ·
[🤖 CLAUDE.md](CLAUDE.md)
&nbsp;&nbsp;|&nbsp;&nbsp; 🇧🇷 [Português](README.pt-BR.md)
