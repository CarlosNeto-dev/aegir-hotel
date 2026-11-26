# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

Aegir Hotel is a **front-end only** web project. It uses **Next.js 15 (App Router)**,
React 19, TypeScript and SCSS Modules. Motion comes from **GSAP 3 + ScrollTrigger**
(`@gsap/react`) and smooth scrolling from **Lenis**. It is managed with **pnpm** and
runs entirely through Docker.

These are future and not present yet: react-three-fiber / three.js, Blender assets,
a database, and **Python** pipeline tooling. The stack list *documents* Python as
future, but it is **not** in the containers. Do not add a backend or Python service
unless asked.

Current state (checked 2026-11-24):

- The **landing page (`/`) is built**. It has the header, main and footer, plus the
  Settings and Account panels.
- On a TV, or with `#tv` at the end of the URL, the long page is replaced by a
  curved coverflow (`(landing)/landing-tv/`).
- `/pagamentos` and `/redefinir-senha` are placeholders.
- `/ambientes-3d` has no `page.tsx`. It stays switched off until the 3D exists.

`front-end/CLAUDE.md` is the source of truth for `front-end/`.

## Working with the owner (Neto, `@CarlosNeto-dev`)

- Reply in **Portuguese (pt-BR)**. Use short blocks and explain from the root.
- **Commit or push only after Neto approves** the exact files, message and
  branch. Never add a `Co-Authored-By` or any other Claude trailer to a commit
  message or PR.
- On-screen text is Portuguese. The **site** must never say the hotel is
  fictional. The repo READMEs may say so.
- Ask before installing a dependency, adding a service or changing Docker, CI,
  CODEOWNERS or the issue forms.

## Layout

| Path | What |
|------|------|
| `front-end/` | The web client. It is bind-mounted to `/app` in the container, and it is the only folder mounted. |
| `front-end/app/` | Routes (App Router), plus `_shared/` (shared header, panels, overlays, `lib/` with api, data and helpers) and `_styles/` (global SCSS). Every component is its own folder: `Foo/Foo.tsx` + `Foo/Foo.module.scss`. Only route folders (URL segments) are Portuguese; everything else is English. Details in `front-end/CLAUDE.md`. |
| `docker/` | `Dockerfile.frontend` (multi-stage), `docker-compose.yml`, `.env.example`. Two local, git-ignored files: `.env` (copied from the example) and the optional `docker-compose.override.yml` (NVIDIA GPU). |
| `.devcontainer/frontend/` | The VS Code dev-container. It reuses `docker/docker-compose.yml` only, so the override is not merged there. |
| `.github/` | `CODEOWNERS`, issue/PR templates, `workflows/release.yml` (CI runs **only** on `v*.*.*` tags), and `CONTRIBUTING.md` (+ `.pt-BR`), which is the workflow guide. There is no `README.md` here, because it would replace the root README as the repo home page. |
| `.dockerignore` | Lives at the repo root, because the compose build uses `context: ..`. |
| `scripts/check-docs.sh` | Validates every Mermaid diagram and every local link. Run it after touching any `.md`. |

## Documentation rules

- Every folder ships **two** READMEs: `README.md` (English) and `README.pt-BR.md`
  (Portuguese, a full mirror). Edit **both** in the same change. `.github/` is the
  exception: its two docs are `CONTRIBUTING.md` and `CONTRIBUTING.pt-BR.md`.
- Every folder also has a `CLAUDE.md` (English, agent-facing, this format).
- Every folder README ends with a **🧭 Related docs** nav. It links the siblings
  and the other language. Keep it present and correct.
- **Never create `.github/README.md`.** GitHub's README precedence is `.github/` →
  root → `docs/`, so a `.github/README.md` silently replaces the root README as the
  repo home page. The workflow guide lives in `.github/CONTRIBUTING.md` (+ `.pt-BR`)
  instead.
- **Mermaid diagrams are currently REMOVED at the user's request** ("depois eu
  mando você colocar").
  - HTML-comment placeholders in `.github/CONTRIBUTING.md` and
    `.github/CONTRIBUTING.pt-BR.md` mark where the 5 diagrams go: a flowchart, a
    gitGraph, a stateDiagram and 2 sequenceDiagrams.
  - The root README, its pt-BR mirror and the CLAUDE.md files stay diagram-free.
  - Re-add diagrams only at those `.github/` placeholders, and only when asked.
- When diagrams return, use conservative Mermaid only:
  - ASCII labels (no `<` `>` `#` `·` `→` `—`, no emoji) and no `subgraph`;
  - in gitGraph: no `/` in branch names, no `merge <branch> tag:`, and never
    `id:` + `tag:` on one `commit`;
  - validated on mermaid-cli 10.2 → 11.4;
  - after any diagram edit, run `bash scripts/check-docs.sh`.

## Workflow

The **entire** git flow (branches, issues, PRs, versioning, release) lives in
**[`.github/CONTRIBUTING.md`](.github/CONTRIBUTING.md)**. Do not restate or diagram
it here or in the root README.

In one line, for orientation: work on a fork, branch off `develop`, open a PR into
`develop`, get a CODEOWNERS review from Neto, and a `v*.*.*` tag on `main` triggers
`release.yml`, which publishes the GitHub Release.

## Running

```bash
cd docker
cp .env.example .env
docker compose up --build
docker compose down
```

- Ports (from `docker/.env`): `5173` is the Next dev server and `9229` the Node
  inspector. `4173` (preview) is defined but **currently unused**: no `next start`
  service runs there yet.
- A bare `docker compose up` also merges `docker-compose.override.yml` when that
  local file exists. It needs an NVIDIA GPU and the NVIDIA Container Toolkit. On
  other machines, use `docker compose -f docker-compose.yml up`.
- There are no named volumes, so `down -v` removes nothing extra.
  `node_modules` lives in the bind mount (`front-end/node_modules`).

## Conventions

- Components: `PascalCase` folder + files, default export.
- Hooks: `useThing.ts`, one per file.
- Import alias: `@/` → the `front-end/` root (e.g. `@/app/_shared/…`).
- Styles: `Foo.module.scss` beside `Foo.tsx`; globals only in `app/_styles/`.
  - The global sheet is `app/_styles/main.scss`, imported once in `app/layout.tsx`
    (`./_styles/main.scss`).
  - Next compiles SCSS natively (`sass` package).
  - `next.config.ts` sets `sassOptions.includePaths` to `app/_styles`, so any
    module can `@use "tools/variables" as *;`.

## Gotchas

- **HMR needs polling.** Docker bind mounts on Windows/WSL2/macOS emit no file-system
  events, so the compose `website` service sets `WATCHPACK_POLLING=true`.
- **Next's dev flags are `-H` / `-p`**, not `--host` / `--port`
  (`next dev -H 0.0.0.0 -p 5173`).
- **The package manager is pnpm**, via Corepack. Its version is pinned in
  `front-end/package.json` `"packageManager"` (`pnpm@12.15.0`).
  - pnpm 12 **fails `pnpm install`** (`ERR_PNPM_IGNORED_BUILDS`) on any dependency
    build script nobody decided on.
  - The decisions live in `front-end/pnpm-workspace.yaml` (`allowBuilds`). Add one
    with `pnpm approve-builds <pkg>`, or `'!<pkg>'` to deny.
  - Never use `npm install` in `front-end/`: it would create a competing
    `package-lock.json`.
  - `front-end/pnpm-lock.yaml` is git-ignored and regenerated on every install.
- **Scripts:** `pnpm dev`, `pnpm build`, `pnpm start`, `pnpm typecheck`
  (`tsc --noEmit`). There is no `lint`, `format:check` or `test` script.
  ESLint is not installed, and `next lint` is deprecated in Next 15.5.
- **No test runner is installed.** A compose `tests` service once existed, wired
  for Vitest. It was removed on 2026-11-13 because it ran a script
  (`pnpm run test:ui`) that never existed, so it did nothing. Add a runner (and a
  service for it) only when asked.
- **The `build` / `production` image targets** ship the Next.js **standalone**
  server (`front-end/next.config.ts` has `output: "standalone"`). There is no nginx
  and no static `dist/`. See `docker/CLAUDE.md`.
- **`docker/.env` is never refreshed automatically.** After `.env.example`
  changes, copy it again. A `.env` that still mentions Vite or `TEST_UI_PORT` is
  stale.

## Verification

- **Containers / Next config:**
  1. `docker compose -f docker-compose.yml config -q`;
  2. build the `debugger` target and run `up -d website`;
  3. confirm `Ready in …` in the logs;
  4. edit a `.tsx` and a `.scss` and check that the page updates;
  5. run `down`.
- **App:** `pnpm typecheck` and `pnpm build` (see `front-end/CLAUDE.md`).
- **Docs:** run `bash scripts/check-docs.sh`. It parses every Mermaid block and
  checks local links. Do this whenever you touch a `.md`. It needs Docker (for
  mermaid-cli) and Node.
- **`.github` YAML:** `release.yml` and the issue forms must stay valid YAML.
