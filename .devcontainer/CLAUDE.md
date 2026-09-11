# CLAUDE.md — `.devcontainer/`

Agent notes for the dev-container. Root guidance: [`../CLAUDE.md`](../CLAUDE.md).

## Facts

- `frontend/devcontainer.json` is **compose-based** (`dockerComposeFile:
  ../../docker/docker-compose.yml`, `service: website`). It defines no image.
- `overrideCommand: true` is required — the compose `command` runs the dev
  server; the dev-container needs a long-lived shell instead.
- `forwardPorts` / `portsAttributes` must mirror `docker/.env`
  (`5173 / 4173 / 51204 / 9229`). No Python/backend ports — front-end only.
- Extensions list is deliberate; `glenn2223.live-sass` + its
  `liveSassCompile.settings.*` are the SCSS-standalone path. `savePath` is
  `/src/styles/css` (workspace-relative; one dedicated folder, not siblings);
  `excludeList` adds `**/*.module.scss` so only global styles get a standalone
  build. Folder contents git-ignored, `.gitkeep` retained. The app itself does
  not read this CSS — Vite compiles `.scss` on import.
- `settings."files.autoSave": "onFocusChange"` is load-bearing, not cosmetic.
  The editor default (`off`) leaves edits in the buffer; the bind-mounted file
  never changes; Vite HMR (verified working, polling watcher) has nothing to
  fire on until the tab is closed. Do not remove it. `formatOnSave` (Prettier)
  runs on that same save.
- `postCreateCommand: npm install` — `app/package-lock.json` is git-ignored and
  regenerated here (and by the compose service commands, the Docker `build`
  stage and CI). There is no committed lock to reconcile against.
- It's JSONC — comments are allowed; keep it parseable
  (`node -e "JSON.parse(stripComments(...))"`).

## When editing

- Change a port here → change it in `docker/.env(.example)`,
  `docker/docker-compose.yml`, `docker/Dockerfile.frontend` and both docker
  READMEs too.
- A second dev-container (e.g. a future service) goes in a **sibling subfolder**
  (`.devcontainer/<name>/`), not by editing `frontend/`.
- Keep `README.md` and `README.pt-BR.md` in sync.
