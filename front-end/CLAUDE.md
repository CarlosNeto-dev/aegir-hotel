# CLAUDE.md — `front-end/`

Agent notes for the web client. Root guidance: [`../CLAUDE.md`](../CLAUDE.md).

> The stack is **Next.js 15 (App Router) + pnpm**. This file is the source of truth
> for `front-end/`.

## State (checked 2026-11-24: `tsc --noEmit` passes)

The last full check of `next build` and the standalone `node server.js` was on
2026-11-14. Run them again before claiming the build is green.

- **Landing `/` is built.** It has:
  - a header for mobile, desktop and TV;
  - main: 7 sections, plus the aside and the progress bar;
  - a footer, simple or "Fragmentos" (chosen in Settings);
  - the Settings panel;
  - the Account panel, which is visual only (the API arrives with issues #23-#29 / #41);
  - the "Role para baixo" button (`ScrollCue`).
- **TV landing.** `LandingScreen` swaps the long page for `TvLanding`, a curved
  coverflow of the sections, when either is true:
  - the device is a TV (`usePointerKind()` returns `"remote"`);
  - the URL ends in `#tv`, which lets you preview it on any screen.

  The server always renders the normal landing; the swap happens under the
  loading screen. See [TV mode](#tv-mode).
- **`/pagamentos`, `/redefinir-senha`:** one-line placeholder pages (issues #30-#40).
- **`/ambientes-3d`:** switched off. The folders exist but there is **no
  `page.tsx`**, so Next answers 404. Re-add `page.tsx` when the 3D scenes exist.
- **No 3D hints anywhere** (no "Ver em 3D" badge, no "em breve"): photos are plain
  `PhotoFragment`s. Add a way into the 3D only when the 3D route really exists.
- **Loading screen (`_shared/overlays/SiteLoader/`):** "Fatias · lugares".
  - Eight place photos slide in as slices and turn into the aerial photo, which
    then flies into the hero.
  - Only `(landing)/page.tsx` renders it (and the 3D route will, later). It never
    appears on `/pagamentos` or `/redefinir-senha`.
  - It shows on **every visit and every reload (F5)**. Nothing is kept in
    `sessionStorage`.
  - When it finishes, it sets `html[data-site-loader="done"]` (`LOADER_DONE` in
    `site-loader-script.ts`). `ScrollCue` waits for that mark. On an internal
    navigation back to `/`, without a reload, the loader does not show again.
  - It ends on real signals, with weights: fonts; hero photo decoded; Opening
    `[data-ready]` (or `data-tv-landing` on the TV); the page `load` event.
  - It lasts 1.8 s minimum and 4 s maximum.
  - Under reduced motion it only fades.
  - If no script runs, CSS hides it after 6 s. Under `<noscript>`, the
    `loaderNoScript` style in `layout.tsx` hides it at once.
  - There is **no `loading.tsx`**: a Suspense fallback never leaves without
    JavaScript.
- **Empty placeholders kept on purpose (future work):**
  - `_shared/lib/api/**` (`core/client.ts`, `core/types.ts`,
    `endpoints/{auth,bookings,chat,payments}.ts`);
  - `account-utils/social-items.ts`;
  - the `ambientes-3d` components and SCSS;
  - the `PaymentsMain` and `ResetPasswordMain` components, and the `page.module.scss`
    files of `pagamentos` and `redefinir-senha`.
- **Leftover empty folders, not tracked by git, safe to delete:**
  `_shared/settings-dock/`, `_shared/theme-toggle/`,
  `_shared/panels/settings-panel/SettingsButton/`. The real `SettingsButton` and
  `ThemeToggle` live in `_shared/settings-capsule/`.

**Installed:** `next 15.5`, `react`/`react-dom` 19, `sass`, `typescript` 5,
`@types/*`, `gsap 3` + `@gsap/react 2` (ScrollTrigger, `useGSAP`), `lenis 1`.

**Not installed (ask first):** ESLint, Prettier, Stylelint, Vitest + Testing
Library, three / react-three-fiber / drei.

**Scripts:** `dev`, `build`, `start`, `typecheck` (`tsc --noEmit`). There is no
`lint`, `format:check` or `test` script.

## Layout (`app/`)

Folders starting with `_` are **private** (never routes). `(name)` is a **route
group** (not in the URL). **Only folders that become a URL segment are
Portuguese** (lowercase, hyphens, no accents). Everything else is **English**:
component folders (`PascalCase`, each with `Name.tsx` + `Name.module.scss`), files,
functions, props, SCSS classes, and route groups such as `(landing)`.

```
layout.tsx                    root layout: fonts (next/font), <html lang="pt-BR">, two inline
                              <head> scripts (theme + settings), a <noscript> style that hides
                              the loader, every provider, global SCSS
(landing)/                    landing  ->  /
  page.tsx page.module.scss   SiteLoader + LandingScreen(tv=<TvLanding/>) around
                              ProgressBar, LandingMain, LandingFooter, ScrollCue
  landing-layout/
    LandingMain/              sections/ Opening (renders Journey inside it;
                                        + story-layout.ts, opening-timeline.ts)
                                        Suites Compare Day Gallery Numbers Booking
                              main-utils/ PhotoFragment VanishText FactList
                                          SectionHeading fit-text.ts
                              main-hooks/ useHashScroll useInView
                              aside/MainAside/
    LandingFooter/            FooterFragments/ (+ closing-layout.ts: the DNA helix)
                              footer-utils/ FooterContent/ FooterLegal/ credits.ts
    overlays/                 ProgressBar/ ScrollCue/ ("Role para baixo")
  landing-tv/                 LandingScreen/ (picks the TV or the normal landing)
                              TvLanding/ TvArc/ TvSection/ tv-chapters.ts
ambientes-3d/                 switched off (no page.tsx), scaffold for the 3D route:
                              [ambiente]/ _r3f/SceneCanvas/ ambients-layout/AmbientsMain/
                              (SceneControls SceneInfo SceneLayout SceneTopBar), all empty
pagamentos/                   /pagamentos            (payments-layout/PaymentsMain/)
redefinir-senha/              /redefinir-senha       (reset-password-layout/ResetPasswordMain/)
_shared/
  site-header/                SiteHeaderLayout/ SiteHeaderMobile/ SiteHeaderDesktop/ SiteHeaderTV/
                              header-hooks/ ActiveSectionProvider useActiveSection
                                            useHeaderHidden scroll-to-section
                              header-utils/ header-items.ts HeaderAccount HeaderBrand HeaderCta
                                            HeaderIcons HeaderNavList LequeHint SectionLink
  panels/                     PanelProvider/ SidePanel/
    settings-panel/           SettingsPanel/ SettingsProvider/
                              settings-sections/ Presets Pointer Letters Graphics Speed Accessibility
                              settings-controls/ ColorPicker DemoVideo FontPicker PhotoShapePreview
                                                 PresetPicker SegmentedChoice SettingSwitch
                                                 ShapePicker TextSizePicker
                              settings-utils/ settings-options.ts settings-routes.ts
                                              settings-script.ts usePointerKind.ts (re-export)
    account-panel/            AccountPanel/ AccountField/ AccountShowcase/
                              account-views/ SignIn SignUp ForgotPassword EmailSent SignedIn
                              account-utils/ account-fields.ts account-views.ts social-items.ts (empty)
  settings-capsule/           SettingsCapsule/ ThemeToggle/ SettingsButton/
  smooth-scroll/              SmoothScrollProvider/ (Lenis + ScrollTrigger) keyboard-scroll.ts
  auth/                       AuthProvider/ GuestAvatar/ auth-utils.ts (preview guest, no API yet)
  overlays/                   SectionCurtain/ CustomCursor/ TouchEffect/
                              SiteLoader/ (+ site-loader-script.ts)
  lib/                        gsap.ts motion.ts scroll-frame.ts section-nav.ts header-bottom.ts
                              pointer-kind.ts tv-mode.ts
                              data/ places.ts photos.ts day-moments.ts hotel-info.ts
                              api/ core/ endpoints/ (empty, issue #24 / #41)
_styles/                      GLOBAL SCSS only (see below)
```

Import with the alias and the full path to the component file, e.g.
`@/app/_shared/site-header/SiteHeaderLayout/SiteHeaderLayout`.

`public/` holds verbatim assets:

- `photos/` (+ `thumbs/`): hotel photos in `.webp`;
- `videos/settings/`: the Settings demos (`.webm` + `.mp4`);
- `scenes/`: reserved for the 3D `.glb` files, empty for now.

## Data flow worth knowing

- **One source per fact.**
  - Places, photos and prices: `lib/data/places.ts`.
  - Gallery photos: `photos.ts`.
  - "Sol a sol" moments: `day-moments.ts`.
  - Address, contact, hours and policies: `hotel-info.ts`.
  - Nav items: `site-header/header-utils/header-items.ts`.
  - The TV chapters (`landing-tv/tv-chapters.ts`) read the same data; they never
    copy it.
  - Photo URLs always go through `photoSrc()` / `thumbSrc()`.
- **Settings** live in `settings-options.ts` (options, defaults, presets).
  - `settings-script.ts` applies them as `data-*` attributes on `<html>`: once
    inline in `<head>` (no flash), and again by `SettingsProvider` on every change.
  - They are saved in `localStorage["settings"]` (`SETTINGS_KEY`).
  - The theme is separate: `localStorage["theme"]`, `light` by default, applied by
    the inline theme script in `layout.tsx`.
  - SCSS reacts through `:global(:root[data-…]) &` selectors and
    `_styles/base/_settings.scss`.
- **Section navigation** (`lib/section-nav.ts`): every link to a section goes
  through `SectionLink` → `scrollToSection` → `goToSection`. That updates the hash
  and, for far jumps, plays the `SectionCurtain` ("Indo para …").
- **Scroll-driven scenes** use GSAP ScrollTrigger with `pin` + `scrub`. The math
  lives in plain `.ts` files (`story-layout.ts`, `closing-layout.ts`), so the
  components only read state and write styles.
- **Keyboard scrolling** (`smooth-scroll/keyboard-scroll.ts`, wired in
  `SmoothScrollProvider`): holding an arrow key gives a smooth, continuous
  velocity instead of the OS key-repeat stutter. A TV remote sends the same keys.

## TV mode

- **Device kind.** `lib/pointer-kind.ts` (`usePointerKind`) returns `"mouse"`,
  `"touch"` or `"remote"`.
  - `"remote"` means `(min-width: 2560px)`.
  - The guess is confirmed by the first real touch or mouse move. Samsung phones
    with an S Pen report `pointer: fine`, so CSS alone gets them wrong.
  - `settings-utils/usePointerKind.ts` only re-exports it.
- **TV or not.** `lib/tv-mode.ts` (`useTvMode`) is true for `"remote"` or a `#tv`
  hash.
- **Swapping the landing.** `LandingScreen` toggles `data-tv-landing` on `<html>`.
  `_styles/base/_tv.scss` then locks the page scroll and hides the header. It also
  defines `--u`, the TV ruler: `min(1vw, 1.7778vh)`, so a 16:9 frame always fits.
  The Settings text size multiplies TV text through `--tv-text`.
- **`TvLanding`** handles the remote:
  - the remote moves through the coverflow and opens a section page;
  - "Back" arrives as `Escape` / `Backspace` / `BrowserBack` / `GoBack`, or as key
    code `10009` (Samsung) / `461` (LG);
  - focus can climb to the Theme/Settings capsule
    (`[data-settings-capsule] button`).
- On the TV, the Settings panel shows only the essentials.

## 3D (planned, not in the code yet)

- The 3D is built in Blender **outside this repo**. Only the exported `.glb`
  comes in, into `public/scenes/`. `.blend` / `.fbx` are git-ignored.
- The site will show the 3D **from inside only** (the lobby interior first).
- The target GLB is a standard glTF:
  - 1 draw call;
  - baked light in the base colour (`KHR_materials_unlit`);
  - Draco geometry and WebP textures.
- The R3F side therefore needs a Draco decoder served by the site, and
  `toneMapped = false`.
- three / @react-three/fiber / drei are **not installed**. Ask before adding them,
  and before re-adding `ambientes-3d/page.tsx`.

## Styles (`app/_styles/`)

**Component styles are CSS Modules.** Every component `.tsx` has a same-name
`.module.scss` beside it. These have none:

- `layout.tsx`;
- the providers (`PanelProvider`, `SettingsProvider`, `AuthProvider`,
  `SmoothScrollProvider`, `ActiveSectionProvider`);
- `LandingScreen`, `HeaderIcons`, `SectionLink` and `SceneCanvas`;
- plain `.ts` modules.

Classes are camelCase. SCSS uses nesting that follows the HTML, `&` for states, `$`
variables and mixins with arguments. Each module `@use`s only what it needs.

```
main.scss                     single entry, imported ONCE from layout.tsx
base/    _index _root _reset _typography _scroll _settings _skip-link _tv
tools/   _variables _mixins _breakpoints
```

Any module can `@use "tools/mixins" as *;`, because `next.config.ts` sets
`sassOptions.includePaths: [app/_styles]` (and silences the `legacy-js-api`
deprecation).

Font stacks already carry their fallbacks (`--font-title`, `--font-body`,
`--font-mono` in `_root.scss`), so write `font-family: var(--font-body);` with no
extra fallbacks.

- Default fonts: Playfair Display (title), Inter (body), JetBrains Mono (mono).
- Settings can swap them for Cormorant Garamond, Karla, DM Serif Display, DM Sans
  or Atkinson Hyperlegible. These load with `preload: false`.

The optional Live Sass Compiler (dev-container) only builds the **global** sheet,
into the git-ignored `app/_styles/css/`. The app never reads it.

## Conventions

- Components: `PascalCase` folder + `PascalCase.tsx`, **default export**. Plain
  modules: `kebab-case.ts`. Hooks: `useThing.ts`, one per file, named export.
- `page.tsx` / `layout.tsx` are server components. Add `"use client"` only for
  state, effects or browser APIs.
- Routes are the folders of `app/` that have a `page.tsx`. Their UI lives in the
  sibling `*-layout/` folder. Keep `page.tsx` thin.
- Dynamic params are a `Promise` in Next 15 (`await params`).
- An empty `.ts`/`.tsx` is not a module. Never import one, and never leave
  `page.tsx` / `layout.tsx` / `loading.tsx` empty.
- `:hover` styles go inside `@media (hover: hover)`, so touch screens don't keep a
  "stuck" hover.
- Code comments in this folder are written in Portuguese, explaining the *why*.
  Keep that style.

## Verification

```bash
pnpm typecheck
pnpm build                     # must list /, /_not-found, /pagamentos, /redefinir-senha
```

To test the Docker `production` image (`output: "standalone"`):

1. copy `.next/static` and `public/` next to `.next/standalone/server.js`;
2. run `node server.js`.

That is exactly what `docker/Dockerfile.frontend` does. Then check that `/` answers
200 and `/ambientes-3d` answers 404.

For UI changes, check phone, tablet, desktop and TV (`#tv`), in light and dark,
with text size Normal / Large / Larger. The page must never scroll horizontally.

## When editing

- Changing a port or version → also update `docker/.env.example`, compose,
  `Dockerfile.frontend`, the devcontainer, and the docker READMEs.
- Folder or route changes → update the tree in `README.md` **and**
  `README.pt-BR.md`, and the *Layout* section here.
- Keep `README.md` and `README.pt-BR.md` in sync.
