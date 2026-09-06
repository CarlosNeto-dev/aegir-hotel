# 🏨 Aegir Hotel

<p>
  <img alt="Node" src="https://img.shields.io/badge/Node-24.x-339933?logo=node.js&logoColor=white">
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white">
  <img alt="Sass" src="https://img.shields.io/badge/SCSS-1.83-CC6699?logo=sass&logoColor=white">
  <img alt="GSAP" src="https://img.shields.io/badge/GSAP-3-88CE02?logo=greensock&logoColor=black">
  <img alt="Docker" src="https://img.shields.io/badge/Docker-Compose%20v2-2496ED?logo=docker&logoColor=white">
  <img alt="License" src="https://img.shields.io/badge/Licen%C3%A7a-MIT-yellow.svg">
  <img alt="Status" src="https://img.shields.io/badge/status-esqueleto-blue">
</p>

**🌐 Idioma:** [English](README.md) · **Português**

---

## 📖 Visão geral

Aegir Hotel é um projeto web **front-end** feito com **React + TypeScript +
SCSS**, animado com **GSAP** e empacotado pelo **Vite**. Tudo roda dentro do
Docker, então qualquer máquina obtém exatamente o mesmo ambiente com um único
comando.

Previsto para depois — já considerado na stack e na configuração de containers:
cenas 3D com **react-three-fiber / three.js**, *assets* exportados do
**Blender**, um **banco de dados** e ferramentas em **Python** para o pipeline de
assets/dados. O repasse de **GPU** já está configurado (opcional) para esse
trabalho.

> ℹ️ O repositório é hoje um **esqueleto**: a configuração de containers está
> completa e testada, `app/` contém a estrutura de pastas definida, e o código da
> aplicação é adicionado seguindo o [`app/README.pt-BR.md`](app/README.pt-BR.md).

---

## 🧱 Stack

| Área | Escolha | Observações |
|------|---------|-------------|
| Runtime | Node.js `24.x` | fixado em `docker/.env` (`NODE_VERSION`) |
| UI | React `19` + TypeScript `5.7` | |
| Estilo | SCSS (`sass` `1.83`) | o Vite compila nativamente; `glenn2223.live-sass` é opcional |
| Animação | GSAP `3` | |
| Build | Vite `6` | servidor de dev + HMR + `vite preview` |
| Testes | Vitest `2` + `@vitest/ui` | roda no próprio container |
| Containers | Docker + Compose v2 | imagem multi-stage, override de GPU |
| 3D *(futuro)* | react-three-fiber, three.js, assets do Blender | |
| Pipeline *(futuro)* | Python (ferramentas de asset/dados), um banco de dados | ainda não nos containers |

---

## 🗂️ Estrutura do repositório

```
aegir-hotel/
├── .github/
│   ├── CONTRIBUTING.md · CONTRIBUTING.pt-BR.md   # 📘 O guia de fluxo (branches · issues · PRs · release)
│   ├── CLAUDE.md                      # notas do agente para CI / templates
│   ├── CODEOWNERS                     # revisores obrigatórios por path (roster de 5)
│   ├── ISSUE_TEMPLATE/                # formulários bug / feature / task (GitHub Projects)
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── workflows/release.yml          # CI — roda SOMENTE numa tag v*.*.*
├── .devcontainer/
│   ├── frontend/devcontainer.json     # dev-container VS Code / Codespaces (reusa o compose)
│   └── README.md · README.pt-BR.md · CLAUDE.md
├── app/                               # o cliente web — montado como volume no container
│   ├── index.html                     # documento de entrada do Vite
│   ├── public/                        # arquivos estáticos servidos como estão
│   ├── src/
│   │   ├── assets/ components/ hooks/ lib/ pages/ scenes/ styles/ types/
│   │   └── …                          # por funcionalidade: Foo.tsx + Foo.module.scss juntos
│   └── README.md · README.pt-BR.md · CLAUDE.md
├── docker/
│   ├── Dockerfile.frontend            # multi-stage: base → debugger → build → production
│   ├── docker-compose.yml             # serviços: website + tests
│   ├── docker-compose.override.yml    # repasse opcional de GPU NVIDIA
│   ├── .env / .env.example            # todas as portas e versões
│   └── README.md · README.pt-BR.md · CLAUDE.md
├── scripts/check-docs.sh              # valida todo diagrama Mermaid + links locais
├── LICENSE                            # MIT
├── .dockerignore · .gitignore
├── README.md · README.pt-BR.md
└── CLAUDE.md                          # notas para o agente Claude Code
```

Cada pasta traz um `README.md` em inglês **e** um `README.pt-BR.md`, além de um
`CLAUDE.md` com notas voltadas ao agente.

---

## 🚀 Início rápido

**Requisitos:** Docker Desktop (ou Docker Engine + Compose v2). Nada mais — nem o
Node — precisa estar instalado na máquina.

```bash
git clone <este-repo> aegir-hotel
cd aegir-hotel/docker
cp .env.example .env

docker compose -f docker-compose.yml up      # sem GPU NVIDIA
docker compose up                            # com GPU NVIDIA + Container Toolkit
```

| URL | O quê |
|-----|-------|
| <http://localhost:5173> | o site (servidor de dev do Vite, hot reload) |
| <http://localhost:51204/__vitest__/> | a UI do Vitest *(após existir o primeiro arquivo de teste)* |
| <http://localhost:4173> | `vite preview` (parecido com produção) |
| `localhost:9229` | inspetor do Node.js |

```bash
docker compose down          # parar
docker compose down -v        # parar + remover volumes
```

Detalhes dos containers, notas de GPU, o build multi-stage e o passo a passo de
hot-reload estão em [`docker/README.pt-BR.md`](docker/README.pt-BR.md).

---

## 💻 Desenvolvimento local sem Docker (opcional)

Precisa de Node `24.x` na máquina e da aplicação já inicializada
([`app/README.pt-BR.md`](app/README.pt-BR.md)).

```bash
cd app && npm install && npm run dev
```

O caminho com Docker é o oficialmente suportado.

---

## 🔌 Portas

Definidas uma única vez em `docker/.env`, reutilizadas pelo Dockerfile, pelo
Compose e pelo dev-container.

| Variável | Padrão | Finalidade |
|----------|--------|------------|
| `WEB_DEV_PORT` | `5173` | servidor de dev do Vite |
| `WEB_PREVIEW_PORT` | `4173` | `vite preview` |
| `TEST_UI_PORT` | `51204` | UI do Vitest |
| `NODE_DEBUG_PORT` | `9229` | inspetor do Node.js |

---

## 🎮 GPU

`docker/docker-compose.override.yml` adiciona acesso à GPU NVIDIA no container
`website` e é **mesclado automaticamente** por um `docker compose up` simples.
Máquinas sem suporte a GPU usam `docker compose -f docker-compose.yml up` (ou
apagam o arquivo de override). Detalhe em
[`docker/README.pt-BR.md`](docker/README.pt-BR.md#-gpu).

---

## 🤝 Contribuindo

**Todo o fluxo de contribuição** — ambiente de dev, modelo de branches, issues &
GitHub Projects, pull requests, versionamento e o pipeline de release — está num
único lugar:

### → [`.github/CONTRIBUTING.pt-BR.md`](.github/CONTRIBUTING.pt-BR.md) · [English](.github/CONTRIBUTING.md)

Resumindo: trabalhe num fork, saia de `develop`, abra um PR, receba uma revisão
de [CODEOWNERS](.github/CODEOWNERS) do Neto, e uma tag `v*.*.*` na `main` dispara
[o workflow de release](.github/workflows/release.yml) que publica um GitHub
Release.

---

## 📚 Mapa da documentação

| Arquivo | Conteúdo |
|---------|----------|
| [`README.md`](README.md) · `README.pt-BR.md` | visão geral do projeto (esta página) |
| [`.github/CONTRIBUTING.pt-BR.md`](.github/CONTRIBUTING.pt-BR.md) · [en](.github/CONTRIBUTING.md) | **o guia de fluxo**: ambiente, branches, issues, PRs, releases |
| [`app/README.pt-BR.md`](app/README.pt-BR.md) · [en](app/README.md) | estrutura de pastas + guia passo a passo da aplicação |
| [`docker/README.pt-BR.md`](docker/README.pt-BR.md) · [en](docker/README.md) | imagens, Compose, GPU, fluxo de hot-reload, solução de problemas |
| [`.devcontainer/README.pt-BR.md`](.devcontainer/README.pt-BR.md) · [en](.devcontainer/README.md) | o dev-container do VS Code |
| [`CLAUDE.md`](CLAUDE.md) | convenções para o agente Claude Code |

Cada link local — e qualquer diagrama Mermaid — é validado por
[`scripts/check-docs.sh`](scripts/check-docs.sh).

---

## 📄 Licença

[MIT](LICENSE) © 2026 Carlos Neto
