# 🐳 `docker/` — referência dos containers

<p>
  <img alt="Imagem base" src="https://img.shields.io/badge/base-node%3A24--bookworm--slim-339933?logo=node.js&logoColor=white">
  <img alt="Imagem de produção" src="https://img.shields.io/badge/prod-node%3A24--bookworm--slim-339933?logo=node.js&logoColor=white">
  <img alt="Compose" src="https://img.shields.io/badge/Compose-v2-2496ED?logo=docker&logoColor=white">
</p>

**🌐 Idioma:** [English](README.md) · **Português**

Definições de containers do projeto — **só front-end** por enquanto.

> O início rápido e a tabela de portas ficam no
> [`README.pt-BR.md`](../README.pt-BR.md) da raiz. Esta página trata só do interior
> dos containers.

| Arquivo | Papel |
|---------|-------|
| `Dockerfile.frontend` | imagem multi-stage: `base → debugger → build → production` |
| `docker-compose.yml` | o serviço `website` |
| `.env.example` | o único lugar para mudar portas e versões; copie para `.env` |
| `.env` *(local, ignorado pelo git)* | sua cópia do `.env.example`, lida pelo Compose |
| `docker-compose.override.yml` *(local, ignorado pelo git, opcional)* | acesso à GPU NVIDIA — veja [Override de GPU](#-override-de-gpu-opcional) |

O **contexto de build é a raiz do repositório** (`context: ..` no Compose), então o
único `.dockerignore` fica lá. Rode os comandos do Compose de dentro de `docker/`,
ou passe `-f docker/docker-compose.yml`.

---

## 🧱 A imagem multi-stage

```bash
docker build -f docker/Dockerfile.frontend --target debugger  -t aegir-web:dev  .   # da raiz do repo
docker build -f docker/Dockerfile.frontend --target production -t aegir-web:prod .
```

| Estágio | A partir de | Contém | Vai para produção? |
|---------|-------------|--------|--------------------|
| `base` | `node:24-bookworm-slim` | o runtime do Node + `pnpm` via Corepack + `WORKDIR /app` — o único lugar onde a versão do Node é definida | não |
| `debugger` | `base` | `base` + `git`, `curl`, `procps`, `serve`, `source-map-explorer` | dev |
| `build` | `base` | `pnpm install` + `pnpm run build` → `/app/.next` (saída standalone) | não |
| `production` | `node:24-bookworm-slim` | **só** o servidor standalone do Next.js (`server.js`) + `.next/static` + `public/`, rodando como `node` na porta `3000` | ✅ |

- **`debugger`** é o que o Compose e o dev-container usam. É tudo de que o Compose
  precisa no dia a dia.
- **`build` / `production`** compilam a aplicação (`pnpm install` + `next build`).
  Eles precisam de internet na primeira vez, porque o `next/font` baixa as fontes do
  Google durante o build.
- **A CI não usa essas imagens.** O `release.yml` roda num runner Ubuntu comum, com
  `setup-node`.
- **O pnpm vem do Corepack.** A versão é fixada pelo `"packageManager"` em
  `front-end/package.json`, não na imagem. O pnpm 12 se recusa a terminar uma
  instalação enquanto uma dependência tiver um script de build sem decisão, então
  cada uma está listada em `front-end/pnpm-workspace.yaml` (`allowBuilds`). Mude com
  `pnpm approve-builds <pkg>`.

---

## ⚙️ Como o serviço é montado

A configuração compartilhada é definida uma vez como âncoras YAML
(`x-frontend-build`, `x-frontend-service`, `x-frontend-healthcheck`) e mesclada com
`<<:`. Hoje existe só um serviço, `website`. Antes existia um serviço `tests`, mas
ele foi removido: ele ligava uma interface do Vitest que nunca foi instalada, então
não fazia nada.

| | `website` |
|-|-----------|
| container | `aegir-website` |
| comando | `pnpm install && pnpm run dev -H 0.0.0.0 -p 5173` |
| roda como | `node` (uid 1000) |
| volume | `../front-end → /app` **apenas** |
| portas | `5173`, `4173`, `9229` |
| healthcheck | `node -e "process.exit(0)"` (está vivo?) |
| restart | `unless-stopped` |

- **`pnpm install` no comando.** As dependências são instaladas no `front-end/`
  montado a cada início. Nenhum lock é commitado (`front-end/pnpm-lock.yaml` é
  ignorado pelo git): o pnpm resolve a partir do `package.json` e grava o lock no
  volume a cada execução.
- **`user: "node"`.** A âncora compartilhada fixa o serviço no usuário sem
  privilégios da imagem, a mesma identidade que o dev-container usa
  (`remoteUser: node`).
  - Sem isso, o `docker compose up` grava um `node_modules` **do root**.
  - Um "Reopen in Container" depois (rodando como `node`) não consegue alterá-lo, e
    aparece `EACCES` no `node_modules`.
  - Se isso já aconteceu, apague uma vez:
    `docker compose run --rm -u 0 website rm -rf node_modules`.
- **Sem volumes nomeados.** O `node_modules` fica no volume montado
  (`front-end/node_modules`), então `docker compose down -v` não remove nada a mais.

---

## 🔥 Fluxo de hot-reload (verificado de ponta a ponta)

```bash
cd docker && docker compose -f docker-compose.yml up -d --build
docker compose logs -f website        # espere por "✓ Ready in …"
```

| Edição | Resultado (verificado em 2026-11-13) |
|--------|--------------------------------------|
| `front-end/app/**/*.tsx` | `✓ Compiled / in …`, página atualizada, estado do React mantido |
| `.scss` / `.module.scss` | `✓ Compiled in …`, estilo reinjetado, sem recarregar tudo |
| `front-end/next.config.ts` | `⚠ Found a change in next.config.ts. Restarting the server to apply the changes…` — o Next reinicia sozinho |

O hot reload pelo volume montado precisa de polling. Ele é ligado por uma variável
de ambiente (não por um arquivo de configuração) no `docker-compose.yml`:

```yaml
environment:
  WATCHPACK_POLLING: "true"
```

```bash
docker compose down
```

---

## 🎮 Override de GPU (opcional)

O `docker-compose.override.yml` é um arquivo **local, ignorado pelo git**. Ele dá ao
`website` acesso à GPU NVIDIA, para o trabalho futuro com WebGL / react-three-fiber
acelerado por hardware e renders do Blender sem interface.

| Comando | O que roda |
|---------|------------|
| `docker compose up` | `docker-compose.yml` **+ o override**, quando o arquivo existe (GPU ligada) |
| `docker compose -f docker-compose.yml up` | só o arquivo base (sem GPU) |

O caminho com GPU precisa de:

- o driver NVIDIA na máquina;
- o NVIDIA Container Toolkit;
- no Docker Desktop, a GPU ligada para o backend WSL2.

Confira dentro do container com `nvidia-smi`. Numa máquina sem isso, use
`-f docker-compose.yml` (ou renomeie o arquivo). O dev-container só lista o
`docker-compose.yml`, então ele nunca recebe a GPU.

---

## 🩺 Solução de problemas

| Sintoma | Causa / correção |
|---------|------------------|
| As edições não recarregam | (1) o editor nunca salvou no disco — o dev-container precisa de `files.autoSave` (definido como `onFocusChange` em `.devcontainer/frontend/devcontainer.json`); (2) falta `WATCHPACK_POLLING=true` no `environment` do serviço `website` em `docker-compose.yml`; (3) você editou um arquivo fora de `front-end/` (só `front-end/` é montado); (4) um import com maiúsculas/minúsculas diferentes do nome do arquivo — não verificado no Next, mas vale conferir primeiro se suspeitar disso |
| Porta já em uso | mude o valor em `docker/.env` e rode `docker compose up` de novo |
| `ERR_PNPM_IGNORED_BUILDS` | uma dependência tem um script de build sem decisão — `pnpm approve-builds <pkg>` (ou `!<pkg>` para negar) grava isso em `front-end/pnpm-workspace.yaml` |
| `node_modules` desatualizado depois de mudar dependências | `docker compose run --rm website rm -rf node_modules`, depois `up` (ele reinstala) |
| O `docker/.env` fala de Vite ou de `TEST_UI_PORT` | o `.env` local é mais velho que o `.env.example` — rode `cp .env.example .env` de novo |
| `could not select device driver "nvidia"` | o override de GPU está sendo mesclado numa máquina sem o toolkit da NVIDIA — use `docker compose -f docker-compose.yml up` |

---

## 🧭 Documentação relacionada

[🏠 Visão geral](../README.pt-BR.md) ·
[🤝 Fluxo de contribuição](../.github/CONTRIBUTING.pt-BR.md) ·
[🎨 app/](../front-end/README.pt-BR.md) ·
[🧩 .devcontainer/](../.devcontainer/README.pt-BR.md) ·
[🤖 CLAUDE.md](CLAUDE.md)
&nbsp;&nbsp;|&nbsp;&nbsp; 🇬🇧 [English](README.md)
