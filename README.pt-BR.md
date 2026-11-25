# 🏨 Aegir Hotel

<p>
  <img alt="Node" src="https://img.shields.io/badge/Node-24.x-339933?logo=node.js&logoColor=white">
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-15-000000?logo=next.js&logoColor=white">
  <img alt="Sass" src="https://img.shields.io/badge/SCSS-1.80%2B-CC6699?logo=sass&logoColor=white">
  <img alt="GSAP" src="https://img.shields.io/badge/GSAP-3-88CE02?logo=greensock&logoColor=black">
  <img alt="Docker" src="https://img.shields.io/badge/Docker-Compose%20v2-2496ED?logo=docker&logoColor=white">
  <img alt="License" src="https://img.shields.io/badge/Licen%C3%A7a-MIT-yellow.svg">
  <img alt="Status" src="https://img.shields.io/badge/status-landing%20pronta-blue">
</p>

**🌐 Idioma:** [English](README.md) · **Português**

---

## 📖 Visão geral

Aegir Hotel é um projeto web **front-end** feito com **Next.js (App Router) +
React + TypeScript + SCSS Modules**. É animado com **GSAP + ScrollTrigger**, tem
rolagem suave do **Lenis** e é gerenciado com **pnpm**. Tudo roda dentro do Docker,
então qualquer máquina obtém exatamente o mesmo ambiente com um único comando.

Previsto para depois, e já considerado na stack e na configuração de containers:
cenas 3D com **react-three-fiber / three.js**, *assets* exportados do **Blender**,
um **banco de dados** e ferramentas em **Python** para o pipeline de assets/dados.

> ℹ️ **Estado atual:**
> - A landing (`/`) está pronta: header, main e footer, além dos painéis de
>   Ajustes e de Conta.
> - Na TV (ou com `#tv` no fim do endereço), a landing vira um coverflow curvo, e
>   ninguém precisa rolar uma página comprida com o controle.
> - `/pagamentos` e `/redefinir-senha` ainda são placeholders.
> - `/ambientes-3d` está desligada até as cenas 3D existirem.
>
> Detalhes em [`front-end/README.pt-BR.md`](front-end/README.pt-BR.md).
> O Aegir é um hotel fictício, feito para um projeto acadêmico.

---

## 🧱 Stack

| Área | Escolha | Observações |
|------|---------|-------------|
| Runtime | Node.js `24.x` | definido em `docker/.env.example` (`NODE_VERSION`), copiado para `docker/.env` |
| UI | React `19` + TypeScript `5` | |
| Estilo | SCSS Modules (`sass`) | o Next compila nativamente; `glenn2223.live-sass` é opcional |
| Animação | GSAP `3` (ScrollTrigger) + Lenis `1` | `@gsap/react` para o hook `useGSAP` |
| Framework | Next.js `15` (App Router) | servidor de dev + Fast Refresh |
| Gerenciador de pacotes | pnpm | via Corepack; versão fixada em `front-end/package.json` |
| Containers | Docker + Compose v2 | imagem multi-stage |
| 3D *(futuro)* | react-three-fiber, three.js, assets do Blender | |
| Pipeline *(futuro)* | Python (ferramentas de asset/dados), um banco de dados | ainda não está nos containers |
| Testes *(futuro)* | ainda não instalado | nenhum runner configurado; adicionar quando precisar |

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
├── .claude/agents/                   # agentes para Claude Code / Cursor (tutor, owner, sintaxe, erros/testes, arquitetura, GitHub)
├── .devcontainer/
│   ├── frontend/devcontainer.json     # dev-container VS Code / Codespaces (reusa o compose)
│   └── README.md · README.pt-BR.md · CLAUDE.md
├── front-end/                         # o cliente web — montado como volume no container
│   ├── public/                        # arquivos estáticos servidos como estão (fotos, vídeos, cenas)
│   ├── next.config.ts · tsconfig.json · package.json · pnpm-workspace.yaml
│   ├── app/                           # rotas + _shared/ (compartilhado) + _styles/ (SCSS global)
│   │                                  # uma pasta por componente: Foo/Foo.tsx + Foo/Foo.module.scss
│   └── README.md · README.pt-BR.md · CLAUDE.md
├── docker/
│   ├── Dockerfile.frontend            # multi-stage: base → debugger → build → production
│   ├── docker-compose.yml             # serviço: website (servidor de dev do Next)
│   ├── .env.example                   # todas as portas e versões (copie para .env)
│   └── README.md · README.pt-BR.md · CLAUDE.md
├── scripts/check-docs.sh              # valida todo diagrama Mermaid + links locais
├── LICENSE                            # MIT
├── .dockerignore · .gitignore · .gitattributes
├── README.md · README.pt-BR.md
└── CLAUDE.md                          # notas para o agente Claude Code
```

Cada pasta traz um `README.md` em inglês **e** um `README.pt-BR.md`, além de um
`CLAUDE.md` com notas voltadas ao agente.

---

## 🚀 Início rápido

**Requisitos:** Docker Desktop (ou Docker Engine + Compose v2). Nada mais é
instalado na máquina, nem o Node.

```bash
git clone <este-repo> aegir-hotel
cd aegir-hotel/docker
cp .env.example .env

docker compose up --build
```

| URL | O quê |
|-----|-------|
| <http://localhost:5173> | o site (servidor de dev do Next.js, Fast Refresh) |
| <http://localhost:4173> | reservado para um preview parecido com produção *(sem uso hoje)* |
| `localhost:9229` | inspetor do Node.js |

```bash
docker compose down          # parar
```

Os detalhes dos containers, o build multi-stage, o passo a passo de hot-reload e o
override opcional de GPU estão em [`docker/README.pt-BR.md`](docker/README.pt-BR.md).

---

## 💻 Desenvolvimento local sem Docker (opcional)

Precisa de Node `24.x` e Corepack na máquina.

```bash
cd front-end && corepack enable && pnpm install && pnpm dev
```

O caminho com Docker é o oficialmente suportado.

---

## 🔌 Portas

As portas são definidas uma única vez em `docker/.env`, e o Dockerfile, o Compose e
o dev-container as reutilizam.

| Variável | Padrão | Finalidade |
|----------|--------|------------|
| `WEB_DEV_PORT` | `5173` | servidor de dev do Next.js |
| `WEB_PREVIEW_PORT` | `4173` | reservado para um preview parecido com produção *(sem uso hoje)* |
| `NODE_DEBUG_PORT` | `9229` | inspetor do Node.js |

---

## 🤝 Contribuindo

**Todo o fluxo de contribuição** está num único lugar: o ambiente de dev, o modelo
de branches, issues & GitHub Projects, pull requests, versionamento e o pipeline de
release.

### → [`.github/CONTRIBUTING.pt-BR.md`](.github/CONTRIBUTING.pt-BR.md) · [English](.github/CONTRIBUTING.md)

Resumindo:

1. trabalhe num fork e saia de `develop`;
2. abra um PR e receba uma revisão de [CODEOWNERS](.github/CODEOWNERS) do Neto;
3. uma tag `v*.*.*` na `main` dispara
   [o workflow de release](.github/workflows/release.yml), que publica um GitHub
   Release.

---

## 📚 Mapa da documentação

| Arquivo | Conteúdo |
|---------|----------|
| [`README.md`](README.md) · `README.pt-BR.md` | visão geral do projeto (esta página) |
| [`.github/CONTRIBUTING.pt-BR.md`](.github/CONTRIBUTING.pt-BR.md) · [en](.github/CONTRIBUTING.md) | **o guia de fluxo**: ambiente, branches, issues, PRs, releases |
| [`front-end/README.pt-BR.md`](front-end/README.pt-BR.md) · [en](front-end/README.md) | estrutura de pastas, regras de estrutura, SCSS, scripts, estado atual |
| [`docker/README.pt-BR.md`](docker/README.pt-BR.md) · [en](docker/README.md) | imagens, Compose, fluxo de hot-reload, override de GPU, solução de problemas |
| [`.devcontainer/README.pt-BR.md`](.devcontainer/README.pt-BR.md) · [en](.devcontainer/README.md) | o dev-container do VS Code |
| [`CLAUDE.md`](CLAUDE.md) | convenções para o agente Claude Code |

O [`scripts/check-docs.sh`](scripts/check-docs.sh) valida cada link local e
qualquer diagrama Mermaid.

---

## 📄 Licença

[MIT](LICENSE) © 2026 Carlos Neto
