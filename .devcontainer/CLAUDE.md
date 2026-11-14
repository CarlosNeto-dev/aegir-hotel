# CLAUDE.md — `.devcontainer/`

Agent notes for the dev-container. Root guidance: [`../CLAUDE.md`](../CLAUDE.md).

## Facts

- `frontend/devcontainer.json` is **compose-based** (`dockerComposeFile:
  ../../docker/docker-compose.yml`, `service: website`). It defines no image.
- `overrideCommand: false` (**changed 2026-11-13**, was `true`) — the compose
  `command` (`pnpm install && pnpm run dev …`) runs as-is, so the dev server
  comes up on its own. VS Code still gets an integrated terminal by exec-ing
  into the running container; it doesn't need the main process idle for that.
- `forwardPorts` / `portsAttributes` must mirror `docker/.env`
  (`5173 / 4173 / 9229`). No Python/backend ports — front-end only.
- Extensions list is deliberate; `glenn2223.live-sass` + its
  `liveSassCompile.settings.*` are the SCSS-standalone path. `savePath` is
  `/app/_styles/css` (workspace-relative; one dedicated folder, not siblings);
  `excludeList` adds `**/*.module.scss` so only global styles get a standalone
  build. Folder contents git-ignored, `.gitkeep` retained. The app itself does
  not read this CSS — Next compiles `.scss` on import.
- `settings."files.autoSave": "onFocusChange"` is load-bearing, not cosmetic.
  The editor default (`off`) leaves edits in the buffer; the bind-mounted file
  never changes; Next's Fast Refresh (via `WATCHPACK_POLLING=true`, set in
  `docker-compose.yml`) has nothing to fire on until the tab is closed. Do not
  remove it. `formatOnSave` (Prettier) runs on that same save.
- No `postCreateCommand` — redundant now that the compose `command` already
  runs `pnpm install` itself. `front-end/pnpm-lock.yaml` is git-ignored and
  regenerated there (and by the Docker `build` stage and CI). There is no
  committed lock to reconcile against.
- It's JSONC — comments are allowed; keep it parseable
  (`node -e "JSON.parse(stripComments(...))"`).

## When editing

- Change a port here → change it in `docker/.env(.example)`,
  `docker/docker-compose.yml`, `docker/Dockerfile.frontend` and both docker
  READMEs too.
- A second dev-container (e.g. a future service) goes in a **sibling subfolder**
  (`.devcontainer/<name>/`), not by editing `frontend/`.
- Keep `README.md` and `README.pt-BR.md` in sync.
