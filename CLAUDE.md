# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

Aegir Hotel — a **front-end only** web project: **Next.js 15 (App Router)** +
React 19 + TypeScript + SCSS Modules, managed with **pnpm**, run entirely through
Docker. Future (not present yet): GSAP, react-three-fiber / three.js, Blender
assets, a database, and **Python** pipeline tooling. Python is *documented* as
future in the stack list but is **not** in the containers — do not add a
backend/Python service unless asked.

The repo is a **scaffold**: `app/` holds the Next.js skeleton (most files are
still empty placeholders) — `app/CLAUDE.md` is the source of truth for it.

## Layout

| Path | What |
|------|------|
| `app/` | the web client; bind-mounted to `/app` in the container. Only this folder is mounted. |
| `app/src/` | five top-level folders — `app/` (routes), `site/` (2D UI), `scene/` (3D UI), `lib/` (api + data), `styles/` (global SCSS only). Every component is its own folder: `Foo/Foo.tsx` + `Foo/Foo.module.scss`. Details in `app/CLAUDE.md`. |
| `docker/` | `Dockerfile.frontend` (multi-stage), `docker-compose.yml`, `.env`. |
| `.devcontainer/frontend/` | VS Code dev-container, reuses the compose file. |
| `.github/` | `CODEOWNERS`, issue/PR templates, `workflows/release.yml` (CI **only** on `v*.*.*` tags), and `CONTRIBUTING.md` (+ `.pt-BR`) = the workflow guide. No `README.md` here — it would replace the root README as the repo home page. |
| `.dockerignore` | at repo root because compose build `context: ..`. |
| `scripts/check-docs.sh` | validates every Mermaid diagram + local links. Run it after touching any `.md`. |

## Documentation rules

- Every folder ships **two** READMEs: `README.md` (English) + `README.pt-BR.md`
  (Portuguese, full mirror). Edit **both** in the same change.
- Every folder also has a `CLAUDE.md` (English, agent-facing, this format).
- Every folder README ends with a **🧭 Related docs** nav linking the siblings +
  the other language. Keep it present and correct.
- **Never create `.github/README.md`** — GitHub's README precedence is
  `.github/` → root → `docs/`, so a `.github/README.md` silently replaces the
  root README as the repo home page. The workflow guide lives in
  `.github/CONTRIBUTING.md` (+ `.pt-BR`) instead.
- **Mermaid diagrams are currently REMOVED at the user's request** ("depois eu
  mando você colocar"). HTML-comment placeholders in `.github/CONTRIBUTING.md` +
  `.github/CONTRIBUTING.pt-BR.md` mark where 5 go (flowchart, gitGraph,
  stateDiagram, 2 sequenceDiagrams). Root README, its pt-BR and CLAUDE.md stay
  diagram-free. Re-add only at those `.github/` placeholders, only when asked.
- When diagrams return: conservative Mermaid only — ASCII labels (no
  `<` `>` `#` `·` `→` `—`, no emoji), no `subgraph`; gitGraph without `/` in
  branch names, no `merge <branch> tag:`, never `id:` + `tag:` on one `commit`.
  Validated on mermaid-cli 10.2 → 11.4. Any diagram edit → `bash scripts/check-docs.sh`.

## Workflow

The **entire** git flow (branches, issues, PRs, versioning, release) lives in
**[`.github/CONTRIBUTING.md`](.github/CONTRIBUTING.md)** — do not restate or
diagram it here or in the root README. One-liner for orientation: work on a fork, branch off
`develop`, PR into `develop`, CODEOWNERS review by Neto, a `v*.*.*` tag on `main`
triggers `release.yml` which publishes the GitHub Release.

## Running

```bash
cd docker
cp .env.example .env
docker compose up --build
docker compose down [-v]
```

Ports (from `docker/.env`): `5173` Next dev server, `9229` Node inspector. `4173`
(preview) and `51204` (test UI) are defined but **currently unused** — there is no
test runner installed.

## Conventions

- Components: `PascalCase` folder + files, default export.
- Hooks: `useThing.ts`, one per file.
- Import alias: `@/` → `src/`.
- Styles: `Foo.module.scss` beside `Foo.tsx`; globals only in `src/styles/`.
  The global sheet is `src/styles/main.scss`, imported once in
  `src/app/layout.tsx`. Next compiles SCSS natively (`sass` package), and
  `next.config.ts` sets `sassOptions.includePaths` to `src/styles` so any module
  can `@use "tools/variables" as *;`.

## Gotchas

- **HMR needs polling.** Docker bind mounts on Windows/WSL2/macOS emit no fs
  events, so the compose `website` service sets `WATCHPACK_POLLING=true`.
- **Next's dev flags are `-H` / `-p`**, not `--host` / `--port`
  (`next dev -H 0.0.0.0 -p 5173`).
- **Package manager is pnpm** (via Corepack; version pinned in
  `app/package.json` `"packageManager"`). pnpm 12 **fails `pnpm install`**
  (`ERR_PNPM_IGNORED_BUILDS`) on any dependency build script nobody decided on;
  decisions live in `app/pnpm-workspace.yaml` (`allowBuilds`). Add one with
  `pnpm approve-builds <pkg>` (or `'!<pkg>'` to deny). Never use `npm install`
  in `app/` — it would create a competing `package-lock.json`.
- **`tests` service is currently broken** — it runs `pnpm run test:ui`, a script
  that no longer exists (no test runner is installed). Fix or remove it only when
  asked.
- **`build` / `production` image targets** still assume a static `dist/` + nginx;
  Next emits `.next/`. Only `debugger` is usable today.

## Verification

- **Containers / Next config:** `docker compose -f docker-compose.yml config -q`,
  build the `debugger` target, `up -d website`, confirm `Ready in …` in the logs,
  edit a `.tsx` and a `.scss` and check the page updates, then `down`.
- **Docs:** run `bash scripts/check-docs.sh` — it parses every Mermaid block and
  checks local links. Do this whenever you touch a `.md`.
- **`.github` YAML:** `release.yml` and the issue forms must stay valid YAML.
