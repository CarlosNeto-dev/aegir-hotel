# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

Aegir Hotel — a **front-end only** web project: React 19 + TypeScript + SCSS +
GSAP, bundled by Vite 6, run entirely through Docker. Future (not present yet):
react-three-fiber / three.js, Blender assets, a database, and **Python** pipeline
tooling. Python is *documented* as future in the stack list but is **not** in the
containers — do not add a backend/Python service unless asked.

The repo is a **scaffold**: container setup is complete and verified; `app/`
holds the folder skeleton only.

## Layout

| Path | What |
|------|------|
| `app/` | the web client; bind-mounted to `/app` in the container. Only this folder is mounted. |
| `app/index.html` | Vite entry — keep it at `app/` root, never in `src/`. |
| `app/src/` | feature-first: `Foo.tsx` + `Foo.module.scss` + `Foo.test.tsx` co-located. `src/styles/` is **global SCSS only**. |
| `docker/` | `Dockerfile.frontend` (multi-stage), `docker-compose.yml`, `docker-compose.override.yml` (GPU), `.env`. |
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
docker compose -f docker-compose.yml up --build   # no GPU
docker compose up                                 # with GPU (merges override)
docker compose down [-v]
```

Ports (from `docker/.env`): `5173` dev server, `4173` preview, `51204` Vitest UI,
`9229` Node inspector.

## Conventions

- Components: `PascalCase` folder + files, default export.
- Hooks: `useThing.ts`, one per file.
- Import alias: `@/` → `src/`.
- Tests: `*.test.tsx` next to the component, `@testing-library/react` + Vitest.
- Styles: `*.module.scss` beside the component; globals only in `src/styles/`.
  The global sheet is `src/styles/main.scss`, imported once in `src/main.tsx`.
  Vite compiles SCSS (modern Dart Sass API) on import — that is the only path the
  app uses. `glenn2223.live-sass` is an optional extra that writes a standalone
  build to `app/src/styles/css/` (git-ignored, folder kept via `.gitkeep`;
  `*.module.scss` excluded); the app never imports those files.

## Gotchas

- **HMR needs polling.** `app/vite.config.ts` must set
  `server.watch.usePolling: true` — Docker bind mounts on Windows/WSL2/macOS emit
  no fs events otherwise.
- **npm blocks install-scripts by default** (current npm, bundled with the Node
  image — not upgraded on purpose). Fine for this stack. Approve real needs with
  `npm install-scripts approve <pkg>`.
- **`tests` service exits with no test files** (Vitest behaviour). `restart:
  on-failure` stops it looping. It stays resident once a `*.test.tsx` exists.
- **`build` / `production` image targets need `app/package.json` + lock file.**
  Only `debugger` builds on a bare scaffold.
- **GPU** lives in `docker-compose.override.yml`; non-GPU machines must pass
  `-f docker-compose.yml` explicitly.

## Verification

- **Containers / Vite config:** `docker compose -f docker-compose.yml config -q`,
  build the `debugger` target, `up -d`, confirm `VITE ... ready`, edit a `.tsx`
  and a `.scss` and check `[vite] hmr update` in the logs, then `down`.
- **Docs:** run `bash scripts/check-docs.sh` — it parses every Mermaid block and
  checks local links. Do this whenever you touch a `.md`.
- **`.github` YAML:** `release.yml` and the issue forms must stay valid YAML.
