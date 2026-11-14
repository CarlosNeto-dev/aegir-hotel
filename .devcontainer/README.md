# 🧩 `.devcontainer/` — VS Code / Codespaces dev-container

<p>
  <img alt="Dev Containers" src="https://img.shields.io/badge/Dev%20Containers-compose--based-007ACC?logo=visualstudiocode&logoColor=white">
  <img alt="Service" src="https://img.shields.io/badge/service-website-2496ED?logo=docker&logoColor=white">
</p>

**🌐 Language:** **English** · [Português](README.pt-BR.md)

```
.devcontainer/
└── frontend/
    └── devcontainer.json     # web-client dev-container
```

> This is **step 1** of the contributor workflow — full guide in
> [`../.github/CONTRIBUTING.md`](../.github/CONTRIBUTING.md).

---

## What it does

`frontend/devcontainer.json` does **not** define its own image. It points at
[`../docker/docker-compose.yml`](../docker/docker-compose.yml) and attaches the
editor to the **`website`** service (the `debugger` stage of
`docker/Dockerfile.frontend`).

On **Reopen in Container**:

1. `website` is built and started via Compose — its normal command
   (`pnpm install && pnpm run dev …`) runs as-is, so the dev server comes up
   **on its own**, nothing to type.
2. The editor opens an integrated terminal in `/app` for anything else you
   need (git, linting, one-off scripts).

Forwarded ports: `5173` (Next dev), `4173` (preview, unused today), `9229`
(Node inspector) — matching `docker/.env`.

---

## Extensions installed in the container

| Extension | For |
|-----------|-----|
| `dbaeumer.vscode-eslint` | linting |
| `esbenp.prettier-vscode` | formatting (format-on-save) |
| `glenn2223.live-sass` | optional standalone SCSS → CSS compilation |
| `stylelint.vscode-stylelint` | SCSS linting |
| `ms-azuretools.vscode-docker` | Docker / Compose tooling |
| `slevesque.shader` | GLSL syntax (future r3f shaders) |

The Live Sass Compiler settings (`liveSassCompile.settings.*`) emit an
`expanded` `.css` + source map into **one dedicated folder**,
[`front-end/app/_styles/css/`](../front-end/app/_styles) (`savePath` is workspace-relative and
`workspaceFolder` is `/app`) — not next to each `.scss`. `*.module.scss` is on
the `excludeList`: component styles are compiled by Next only. The folder's
contents are git-ignored (the folder itself is kept via `.gitkeep`) — see
[`../.gitignore`](../.gitignore).

This CSS is for inspection / standalone use; **the app never imports it**. Next
compiles `.scss` on import (`app/layout.tsx` → `import "./_styles/main.scss"`).

### `files.autoSave: onFocusChange`

Set on purpose. The editor default is `off` — an unsaved buffer never reaches
the bind-mounted file, so Next's Fast Refresh has nothing to react to until you close the
tab. `onFocusChange` writes the file the moment you switch to the browser or the
terminal, which is exactly when you want HMR to fire. Reload the window after
changing this (`Dev Containers: Rebuild` not needed — it's an editor setting).

---

## Why a `frontend/` subfolder?

Dev Containers supports multiple configs, one per subfolder of `.devcontainer/`.
The project is front-end only today; if a separate service ever needs its own
container, it gets a sibling folder and the editor shows a picker on
"Reopen in Container".

---

## 🧭 Related docs

[🏠 Project overview](../README.md) ·
[🤝 Contribution workflow](../.github/CONTRIBUTING.md) ·
[🎨 app/](../front-end/README.md) ·
[🐳 docker/](../docker/README.md) ·
[🤖 CLAUDE.md](CLAUDE.md)
&nbsp;&nbsp;|&nbsp;&nbsp; 🇧🇷 [Português](README.pt-BR.md)
