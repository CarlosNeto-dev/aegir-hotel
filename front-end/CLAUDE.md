# CLAUDE.md — `front-end/`

Agent notes for the web client. Root guidance: [`../CLAUDE.md`](../CLAUDE.md).

> The stack is **Next.js (App Router) + pnpm**. This file is the source of truth
> for `front-end/`. Docs elsewhere (`docker/`, `.devcontainer/`, `.github/`) may still
> describe an older stack; where they disagree, `front-end/` wins — see *Known breakages*.

## State

**Architecture skeleton** (branch `frontend-architecture-organization`). Every
`.ts` / `.tsx` / `.scss` file in `app/` is **empty on purpose**: the route tree,
folders and SCSS partials exist, nothing more. Each folder holding empty
`.ts`/`.tsx` files carries a `.gitkeep`. Do not fill the files on this branch —
the code lives in feature branches.

Present: `package.json` (`"packageManager": "pnpm@12.15.0"`; `next 15.0.3`, `react`/`react-dom` 19 RC, `sass`,
`typescript`, `@types/*`), `next.config.ts` (`sassOptions`), `tsconfig.json`
(Next default + `@/*` → `./*`), `pnpm-workspace.yaml` (`allowBuilds` — required, see
`../docker/CLAUDE.md`), `public/photos/`, `public/scenes/`, `app/`. Use **pnpm**, never npm.
The folder is bind-mounted to `/app` in the container; the host folder is `front-end/`.

**Not installed** (add only when needed, ask first): ESLint, Prettier, Stylelint,
Vitest + Testing Library, GSAP, three / react-three-fiber / drei.

## Layout (`app/`)

Everything lives in `app/`. Folders starting with `_` are **private** (never
routes); `(name)` is a **route group** (not in the URL). **Only folders that become a
URL segment are in Portuguese** (lowercase, hyphens, no accents): the site is pt-BR and
Next.js builds the URL from the folder name. Everything that is not a route is
**English**: component folders (`PascalCase`, each with `Name.tsx` + `Name.module.scss`),
files, functions, props, SCSS classes and route groups such as `(landing)`.

```
layout.tsx                   root layout: fonts, <html lang="pt-BR">, <SiteHeaderLayout />, global SCSS
(landing)/                    landing  ->  /
  page.tsx page.module.scss loading.tsx
  landing-layout/
    LandingMain/               + sections/ (Opening Journey Suites Compare Day Models Numbers Booking + Section)
                               + aside/ (MainAside/, account-panel/{AccountPanel/, account-views/, account-utils/})
    LandingFooter/
    overlays/             ProgressBar/ Cursor/
ambientes-3d/                /ambientes-3d  ·  /ambientes-3d/[ambiente]
  _r3f/SceneCanvas/            (no .module.scss)
  ambients-layout/AmbientsMain/   + SceneLayout/ SceneTopBar/ SceneInfo/ SceneControls/
pagamentos/                  /pagamentos            (payments-layout/PaymentsMain/)
redefinir-senha/             /redefinir-senha       (reset-password-layout/ResetPasswordMain/; no loading.tsx)
_shared/
  site-header/              SiteHeaderLayout/ SiteHeaderMobile/ SiteHeaderDesktop/ SiteHeaderTV/
                               header-hooks/ (.gitkeep)  header-utils/{header-items.ts, HeaderBrand/ HeaderCta/ HeaderIcons/ HeaderNavList/}
  panels/                     PanelProvider/ (no .module.scss)  settings-panel/SettingsPanel/
  overlays/               SiteLoader/
  lib/                  api/{core/{client,types}.ts, endpoints/{auth,bookings,payments,chat}.ts}  data/{places,photos}.ts
_styles/                    GLOBAL SCSS only (see below)
```

Import with the alias, full path to the component file, e.g.
`@/app/_shared/site-header/SiteHeaderLayout/SiteHeaderLayout`.
`public/photos/` and `public/scenes/` = verbatim assets (images, `.glb`).

## Styles (`app/_styles/`)

**Component styles are CSS Modules, not global SCSS.** Every component `.tsx` has a
same-name `.module.scss` beside it (`SiteHeaderDesktop.module.scss`,
`page.module.scss`) — **except** `layout.tsx`, `PanelProvider.tsx` and `SceneCanvas.tsx`.
Non-component `.ts` (`header-items.ts`, `social-items.ts`, `lib/`) get none.
Classes are camelCase (`styles.headerButton`). New or changed SCSS uses nesting
(`&` for states/modifiers), `$` variables and mixins with arguments; each module
`@use`s only what it needs.

`_styles/` is deliberately small — **global only**:

```
main.scss                      single entry, imported ONCE from layout.tsx (./_styles/main.scss)
base/         _index _reset _root _typography _scroll
tools/  _variables _mixins _breakpoints
```

Next compiles SCSS natively via the `sass` package. Any module can
`@use "tools/variables" as *;` because `next.config.ts` sets
`sassOptions.includePaths: [app/_styles]`. Inside `tools/` the partials
`@use` each other without a prefix (`@use "breakpoints" as *;`). Do not recreate
per-feature mirror folders under `_styles/`.

The old Live Sass Compiler output is gone; the `glenn2223.live-sass` `savePath`
in the devcontainer and the matching `.gitignore` entries are dead config.

## Conventions

- Components: `PascalCase` folder + `PascalCase.tsx`, default export. Non-component
  modules (`header-items.ts`, `social-items.ts`, `photos.ts`): `kebab-case.ts` / lowercase.
- `page.tsx` / `layout.tsx` are **server components by default**. Add
  `"use client"` only where state/effects/browser APIs are needed (Cursor,
  panels, scene canvas, anything GSAP/three).
- Routes are the folders of `app/` that hold `page.tsx`; their UI sits in the
  sibling `*-layout` folder and is imported into the page. Keep `page.tsx` thin.
- Dynamic route params are a `Promise` in Next 15:
  `params: Promise<{ ambiente: string }>` then `await params`.
- Import alias `@/` → the `front-end/` root (e.g. `@/app/_shared/…`).
- Hooks: `useThing.ts`, one per file (`header-hooks/` exists for the header).
- An **empty `.ts`/`.tsx` is invalid** when imported under Next (`is not a module`);
  `page.tsx` / `layout.tsx` / `loading.tsx` must never be empty.

## Limits of this branch

- **It does not build, on purpose:** empty `page.tsx` / `layout.tsx` / `loading.tsx`
  are not modules (`next build` → *"is not a module"*). Once a page is written,
  dynamic params are a `Promise` in Next 15.
- `pnpm lint` cannot run — ESLint is not installed.
- Next's dev flags are `-H` / `-p`, not `--host` / `--port`.
- `next@15.0.3` is flagged deprecated (CVE-2025-66478) — bump to a patched 15.x
  when the code lands.
- Docker, dev-container and CI describe the earlier Vite + npm setup; only their
  host paths point to `front-end/`.

Do not "fix" `docker/`, `.devcontainer/`, `.github/` or root docs as a side
effect of a `front-end/` task — report and ask; they are separate decisions.

## When editing

- Changing a port/version → also update `docker/.env(.example)`, compose,
  `Dockerfile.frontend`, devcontainer, and the docker READMEs.
- Folder/route changes → update the tree in `README.md` **and** `README.pt-BR.md`
  and the *Layout* section here.
- Keep `README.md` and `README.pt-BR.md` in sync.
