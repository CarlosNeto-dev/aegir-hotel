# CLAUDE.md — `app/`

Agent notes for the web client. Root guidance: [`../CLAUDE.md`](../CLAUDE.md).

> The stack is **Next.js (App Router) + pnpm**. This file is the source of truth
> for `app/`. Docs elsewhere (`docker/`, `.devcontainer/`, `.github/`) may still
> describe an older stack; where they disagree, `app/` wins — see *Known breakages*.

## State

**Next.js 15 (App Router) skeleton.** Most `.ts` / `.tsx` / `.scss` files in `src/`
are **empty placeholders**: the route tree, folders and SCSS partials exist; the
site header, `app/layout.tsx` and `app/page.tsx` already have the user's code.
Each folder holding empty `.ts`/`.tsx` files carries a `.gitkeep`.

Present: `package.json` (`"packageManager": "pnpm@12.15.0"`; `next 15.0.3`, `react`/`react-dom` 19 RC, `sass`,
`typescript`, `@types/*`), `next.config.ts` (empty config), `tsconfig.json`
(Next default + `@/*` → `./src/*`), `pnpm-workspace.yaml` (`allowBuilds` — required, see
`../docker/CLAUDE.md`), `public/photos/`, `public/scenes/`, `src/`. Use **pnpm**, never npm.

**Not installed** (add only when needed, ask first): ESLint, Prettier, Stylelint,
Vitest + Testing Library, GSAP, three / react-three-fiber / drei.

## Layout (`src/`)

**Five folders at the top level**, each split into subfolders — no loose files
except `styles/main.scss`. Every component is **its own folder** holding
`Name.tsx` + `Name.module.scss`.

```
app/                 routes only (Next App Router) — page.tsx / layout.tsx (+ page.module.scss)
  (front-desk)/front-desk/ · (guest)/my-bookings/ · booking/[code]/payment/
  chat/ · reset-password/ · scenes/[scene]/
site/                everything 2D on the website
  layout/              the frame of the site
    site-header/         SiteHeaderLayout/ SiteHeaderDesktop/ SiteHeaderMobile/
      header-utils/        header-items.ts + HeaderBrand/ HeaderCta/ HeaderIcons/ HeaderNavList/
    site-main/           SiteMainLayout/ MainAside/
    site-footer/         SiteFooterLayout/
  sections/            OpeningSection/ JourneySection/ SuitesSection/ CompareSection/
                       DaySection/ ModelsSection/ NumbersSection/ BookingSection/
  panels/              slide-over panels
    panel-provider/      PanelProvider.tsx (no .module.scss)
    account-panel/       AccountPanelLayout/ social-items.ts
      account-views/       SignIn/ SignUp/ ForgotPassword/ EmailSent/ SignedIn/
    settings-panel/      SettingsPanelLayout/
  overlays/            SiteLoader/ ProgressBar/ Cursor/
scene/               3D UI: SceneLayout/ SceneCanvas/ SceneTopBar/ SceneInfo/ SceneControls/
lib/                 non-UI code
  api/
    core/                client.ts types.ts
    endpoints/           auth.ts bookings.ts payments.ts chat.ts
  data/                places.ts photos.ts
styles/              GLOBAL SCSS only (see below)
```

Import with the alias, full path to the component file, e.g.
`@/site/layout/site-header/SiteHeaderLayout/SiteHeaderLayout`.
`public/photos/` and `public/scenes/` = verbatim assets (images, `.glb`).

## Styles (`src/styles/`)

**Component styles are CSS Modules, not global SCSS.** Every `.tsx` has a
same-name `.module.scss` beside it (`SiteHeaderDesktop.module.scss`,
`page.module.scss`) — **except** `app/layout.tsx` and `site/panels/panel-provider/PanelProvider.tsx`.
Non-component `.ts` (`header-items.ts`, `social-items.ts`, `lib/`) get none. Classes
are camelCase (`styles.headerButton`).

`src/styles/` is deliberately small — **global only**:

```
main.scss                  single entry, imported ONCE from app/layout.tsx
base/   _index _reset _root _typography _scroll
tools/  _variables _mixins _breakpoints
```

All empty. `main.scss` is **not imported anywhere yet** — import it from
`src/app/layout.tsx`: `import "@/styles/main.scss"`. Next compiles SCSS natively
via the `sass` package. Any module can `@use "tools/variables" as *;` because
`next.config.ts` sets `sassOptions.includePaths: [src/styles]` (verified: the
class gets a unique hashed name). Do not recreate per-feature mirror folders under `styles/`.

The old `styles/css/` (Live Sass Compiler output) folder is **gone**; the
`glenn2223.live-sass` `savePath` in the devcontainer and the `.gitignore` entries
for it are now dead config.

## Conventions

- Components: `PascalCase.tsx`, default export. Non-component modules
  (`header-items.ts`, `social-items.ts`, `photos.ts`): `kebab-case.ts` / lowercase.
- `page.tsx` / `layout.tsx` are **server components by default**. Add
  `"use client"` only where state/effects/browser APIs are needed (Cursor,
  panels, scene canvas, anything GSAP/three).
- Routes live **only** in `src/app/`; UI lives in `site/` and `scene/` and
  is imported into pages. Keep `page.tsx` thin. A folder that gets crowded is split
  into subfolders — never leave many loose files side by side.
- Import alias `@/` → `src/`.
- Hooks: `useThing.ts`, one per file (no `hooks/` folder yet — create it when needed).
- An **empty `.ts`/`.tsx` is invalid** under Next/`tsc` (`is not a module`); a
  placeholder that must compile needs at least `export {};` (pages/layouts need a
  default export component).

## Known breakages (verified 2026-10-25 in a scratch copy; install + dev + SCSS re-verified with pnpm)

| Check | Result |
|-------|--------|
| `pnpm install` | ok (46 pkgs; needs `allowBuilds` decisions, see below). `next@15.0.3` flagged deprecated — CVE-2025-66478, bump to a patched 15.x |
| `npx tsc --noEmit` | passes (empty files are ignored as scripts) |
| `pnpm build` | **fails** — `page.tsx ... is not a module` (empty route files) |
| `pnpm lint` | **cannot run** — `next lint` needs `eslint` + `eslint-config-next` (not installed) |
| `next dev --host 0.0.0.0` | **fails** — `error: unknown option '--host'`. Next uses `-H/--hostname` and `-p/--port` |
| `docker/docker-compose.yml` `website` | ok — boots with `pnpm run dev -H 0.0.0.0 -p $WEB_DEV_PORT` (verified through compose); `GET /` = 500 while route files are empty |
| `docker/docker-compose.yml` `tests` | runs `pnpm run test:ui` — script no longer exists |
| `Dockerfile.frontend` `build`/`production` | expects `/app/dist` + nginx SPA; Next emits `.next/` (needs `output: "export"` → `out/`, and `[code]`/`[scene]` dynamic routes then need `generateStaticParams`) |
| HMR in Docker | `WATCHPACK_POLLING=true` is set in compose (needed on Docker bind mounts); SCSS edits verified live (~4-20s) |
| `.gitignore` | no `.next/`, `out/`, `next-env.d.ts` entries |
| `release.yml` `quality` | would fail on tag: no `format:check`/`typecheck`/`test` scripts (`--if-present` skips them) and `build` fails |
| `@types/react`/`@types/react-dom` `^18` vs React 19 RC | mismatch — align when upgrading |

Do not "fix" `docker/`, `.devcontainer/`, `.github/` or root docs as a side
effect of an `app/` task — report and ask; they are separate decisions.

## When editing

- Changing a port/version → also update `docker/.env(.example)`, compose,
  `Dockerfile.frontend`, devcontainer, and the docker READMEs.
- Folder/route changes → update the tree in `README.md` **and** `README.pt-BR.md`
  and the *Layout* section here.
- Keep `README.md` and `README.pt-BR.md` in sync.
