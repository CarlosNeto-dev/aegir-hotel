# 🏨 Aegir Hotel

<p>
  <img alt="Node" src="https://img.shields.io/badge/Node-24.x-339933?logo=node.js&logoColor=white">
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-15-000000?logo=next.js&logoColor=white">
  <img alt="Sass" src="https://img.shields.io/badge/SCSS-1.80%2B-CC6699?logo=sass&logoColor=white">
  <img alt="GSAP" src="https://img.shields.io/badge/GSAP-3-88CE02?logo=greensock&logoColor=black">
  <img alt="Docker" src="https://img.shields.io/badge/Docker-Compose%20v2-2496ED?logo=docker&logoColor=white">
  <img alt="License" src="https://img.shields.io/badge/License-MIT-yellow.svg">
  <img alt="Status" src="https://img.shields.io/badge/status-landing%20pronta-blue">
</p>

**🌐 Language:** **English** · [Português](README.pt-BR.md)

---

## 📖 Overview

Aegir Hotel is a **front-end** web project built with **Next.js (App Router) +
React + TypeScript + SCSS Modules**. It is animated with **GSAP + ScrollTrigger**,
smooth-scrolled with **Lenis** and managed with **pnpm**. Everything runs inside
Docker, so any machine gets the exact same toolchain with a single command.

Planned for later, and already accounted for in the stack and the container setup:
**react-three-fiber / three.js** 3D scenes, **Blender**-exported assets, a
**database**, and **Python** tooling for the asset/data pipeline.

> ℹ️ **Current state:**
> - The landing page (`/`) is built: header, main and footer, plus the Settings
>   and Account panels.
> - On a TV (or with `#tv` at the end of the address) the landing becomes a curved
>   coverflow, so nobody has to scroll a long page with a remote.
> - `/pagamentos` and `/redefinir-senha` are placeholders.
> - `/ambientes-3d` is switched off until the 3D scenes exist.
>
> Details in [`front-end/README.md`](front-end/README.md).
> Aegir is a fictional hotel made for an academic project.

---

## 🧱 Tech stack

| Area | Choice | Notes |
|------|--------|-------|
| Runtime | Node.js `24.x` | set in `docker/.env.example` (`NODE_VERSION`), copied to `docker/.env` |
| UI | React `19` + TypeScript `5` | |
| Styling | SCSS Modules (`sass`) | Next compiles it natively; `glenn2223.live-sass` is optional |
| Animation | GSAP `3` (ScrollTrigger) + Lenis `1` | `@gsap/react` for the `useGSAP` hook |
| Framework | Next.js `15` (App Router) | dev server + Fast Refresh |
| Package manager | pnpm | via Corepack; version pinned in `front-end/package.json` |
| Containers | Docker + Compose v2 | multi-stage image |
| 3D *(future)* | react-three-fiber, three.js, Blender assets | |
| Pipeline *(future)* | Python (asset/data tooling), a database | not in the containers yet |
| Tests *(future)* | not installed yet | no runner is wired in; add one when needed |

---

## 🗂️ Repository layout

```
aegir-hotel/
├── .github/
│   ├── CONTRIBUTING.md · CONTRIBUTING.pt-BR.md   # 📘 THE workflow guide (branches · issues · PRs · release)
│   ├── CLAUDE.md                      # agent notes for CI / templates
│   ├── CODEOWNERS                     # required reviewers per path (5-person roster)
│   ├── ISSUE_TEMPLATE/                # bug / feature / task forms (GitHub Projects)
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── workflows/release.yml          # CI — runs ONLY on a v*.*.* tag
├── .claude/agents/                   # agents for Claude Code / Cursor (tutor, owner, syntax, errors/tests, architecture, GitHub)
├── .devcontainer/
│   ├── frontend/devcontainer.json     # VS Code / Codespaces dev-container (reuses compose)
│   └── README.md · README.pt-BR.md · CLAUDE.md
├── front-end/                         # the web client — bind-mounted into the container
│   ├── public/                        # static assets served as-is (photos, videos, scenes)
│   ├── next.config.ts · tsconfig.json · package.json · pnpm-workspace.yaml
│   ├── app/                           # routes + _shared/ (shared) + _styles/ (global SCSS)
│   │                                  # one folder per component: Foo/Foo.tsx + Foo/Foo.module.scss
│   └── README.md · README.pt-BR.md · CLAUDE.md
├── docker/
│   ├── Dockerfile.frontend            # multi-stage: base → debugger → build → production
│   ├── docker-compose.yml             # service: website (Next dev server)
│   ├── .env.example                   # every port & version knob (copy to .env)
│   └── README.md · README.pt-BR.md · CLAUDE.md
├── scripts/check-docs.sh              # validates every Mermaid diagram + local links
├── LICENSE                            # MIT
├── .dockerignore · .gitignore · .gitattributes
├── README.md · README.pt-BR.md
└── CLAUDE.md                          # notes for the Claude Code agent
```

Every folder ships an English `README.md` **and** a `README.pt-BR.md`, plus a
`CLAUDE.md` with agent-facing notes.

---

## 🚀 Quick start

**Requirements:** Docker Desktop (or Docker Engine + Compose v2). Nothing else is
installed on the host, not even Node.

```bash
git clone <this-repo> aegir-hotel
cd aegir-hotel/docker
cp .env.example .env

docker compose up --build
```

| URL | What |
|-----|------|
| <http://localhost:5173> | the website (Next.js dev server, Fast Refresh) |
| <http://localhost:4173> | reserved for a production-like preview *(unused today)* |
| `localhost:9229` | Node.js inspector |

```bash
docker compose down          # stop
```

The container internals, the multi-stage build, the hot-reload walkthrough and the
optional GPU override live in [`docker/README.md`](docker/README.md).

---

## 💻 Local development without Docker (optional)

This needs Node `24.x` and Corepack on the host.

```bash
cd front-end && corepack enable && pnpm install && pnpm dev
```

The Docker path is the supported one.

---

## 🔌 Ports

The ports are defined once in `docker/.env`, and the Dockerfile, Compose and the
dev-container reuse them.

| Var | Default | Purpose |
|-----|---------|---------|
| `WEB_DEV_PORT` | `5173` | Next.js dev server |
| `WEB_PREVIEW_PORT` | `4173` | reserved for a production-like preview *(unused today)* |
| `NODE_DEBUG_PORT` | `9229` | Node.js inspector |

---

## 🤝 Contributing

The **entire contribution workflow** lives in one place: the dev environment, the
branch model, issues & GitHub Projects, pull requests, versioning and the release
pipeline.

### → [`.github/CONTRIBUTING.md`](.github/CONTRIBUTING.md) · [Português](.github/CONTRIBUTING.pt-BR.md)

In short:

1. work on a fork and branch off `develop`;
2. open a PR and get a [CODEOWNERS](.github/CODEOWNERS) review from Neto;
3. a `v*.*.*` tag on `main` triggers
   [the release workflow](.github/workflows/release.yml), which publishes a GitHub
   Release.

---

## 📚 Documentation map

| File | Contents |
|------|----------|
| `README.md` · [`README.pt-BR.md`](README.pt-BR.md) | project overview (this page) |
| [`.github/CONTRIBUTING.md`](.github/CONTRIBUTING.md) · [pt-BR](.github/CONTRIBUTING.pt-BR.md) | **the workflow guide**: environment, branches, issues, PRs, releases |
| [`front-end/README.md`](front-end/README.md) · [pt-BR](front-end/README.pt-BR.md) | folder structure, structure rules, SCSS, scripts, current status |
| [`docker/README.md`](docker/README.md) · [pt-BR](docker/README.pt-BR.md) | images, Compose, hot-reload workflow, GPU override, troubleshooting |
| [`.devcontainer/README.md`](.devcontainer/README.md) · [pt-BR](.devcontainer/README.pt-BR.md) | the VS Code dev-container |
| [`CLAUDE.md`](CLAUDE.md) | conventions for the Claude Code agent |

[`scripts/check-docs.sh`](scripts/check-docs.sh) validates every local link and
any Mermaid diagram.

---

## 📄 License

[MIT](LICENSE) © 2026 Carlos Neto
