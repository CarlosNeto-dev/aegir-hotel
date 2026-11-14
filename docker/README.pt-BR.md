# 🐳 `docker/` — referência de containers

<p>
  <img alt="Base image" src="https://img.shields.io/badge/base-node%3A24--bookworm--slim-339933?logo=node.js&logoColor=white">
  <img alt="Prod image" src="https://img.shields.io/badge/prod-node%3A24--bookworm--slim-339933?logo=node.js&logoColor=white">
  <img alt="Compose" src="https://img.shields.io/badge/Compose-v2-2496ED?logo=docker&logoColor=white">
</p>

**🌐 Idioma:** [English](README.md) · **Português**

Definições de containers do projeto — **somente front-end** por enquanto.

> Início rápido, e tabela de portas estão no
> [`README.pt-BR.md`](../README.pt-BR.md) da raiz. Esta página é só o interior
> dos containers.

| Arquivo | Papel |
|---------|-------|
| `Dockerfile.frontend` | imagem multi-stage: `base → debugger → build → production` |
| `docker-compose.yml` | o serviço `website` |
| `.env` / `.env.example` | o único lugar para mudar portas e versões |

O **contexto de build é a raiz do repositório** (`context: ..` no Compose), então
o único `.dockerignore` fica lá. Rode os comandos do Compose a partir de
`docker/` (ou passe `-f docker/docker-compose.yml`).

---

## 🧱 A imagem multi-stage

```bash
docker build -f docker/Dockerfile.frontend --target debugger  -t aegir-web:dev  .   # da raiz do repo
docker build -f docker/Dockerfile.frontend --target production -t aegir-web:prod .
```

| Estágio | A partir de | Contém | Vai p/ produção? |
|---------|-------------|--------|------------------|
| `base` | `node:24-bookworm-slim` | o runtime do Node + `pnpm` via Corepack + `WORKDIR /app` — único lugar onde a versão do Node é definida | não |
| `debugger` | `base` | `base` + `git`, `curl`, `procps`, `serve`, `source-map-explorer` | dev / CI |
| `build` | `base` | `pnpm install` + `pnpm run build` → `/app/.next` (saída standalone) | não |
| `production` | `node:24-bookworm-slim` | **apenas** o servidor standalone do Next.js (`server.js`) + `.next/static` + `public/` | ✅ |

- O `debugger` é o que o Compose e o dev-container usam.
- `build` / `production` precisam de `front-end/package.json`. Num esqueleto novo, só o
  `debugger` compila — que é tudo que o Compose precisa.
- **pnpm via Corepack** — a versão é fixada em `"packageManager"` no
  `front-end/package.json` (não na imagem). O pnpm 12 não conclui o install enquanto uma
  dependência tiver script de build sem decisão, então cada uma é listada em
  `front-end/pnpm-workspace.yaml` (`allowBuilds`). Mude com `pnpm approve-builds <pacote>`.

---

## ⚙️ Como o serviço é montado

A configuração compartilhada é definida uma vez como âncoras YAML
(`x-frontend-build`, `x-frontend-service`, `x-frontend-healthcheck`) e mesclada
com `<<:` — hoje só existe o serviço `website` (havia um `tests` antes, mas foi
removido: ele montava uma UI do Vitest que nunca chegou a ser instalada, então
não fazia nada).

| | `website` |
|-|-----------|
| comando | `pnpm install && next dev …` |
| roda como | `node` (uid 1000) |
| volume | `../front-end → /app` **apenas** |
| portas | `5173`, `4173`, `9229` |
| healthcheck | `node -e "process.exit(0)"` (liveness) |
| restart | `unless-stopped` |

- **`pnpm install` no comando:** as deps são instaladas no `front-end/` montado a cada
  start. Nenhum lock é versionado (`front-end/pnpm-lock.yaml` está no
  `.gitignore`) — o pnpm resolve a partir do `package.json` e grava o lock no
  bind mount a cada execução.
- **`user: "node"`** — a âncora compartilhada fixa o serviço no usuário
  não-privilegiado da imagem, a mesma identidade do dev-container (`remoteUser:
  node`). Sem isso, `docker compose up` grava um `node_modules` **do root** que um
  "Reopen in Container" posterior (rodando como `node`) não consegue alterar —
  `EACCES` em `node_modules`. Se já aconteceu, limpe uma
  vez: `docker compose run --rm -u 0 website rm -rf node_modules`.

---

## 🔥 Fluxo de hot-reload (verificado de ponta a ponta)

```bash
cd docker && docker compose -f docker-compose.yml up -d --build
docker compose logs -f website        # aguarde "✓ Ready in …"
```

| Edição | Resultado (verificado em 2026-11-13) |
|--------|---------------------------------------|
| `front-end/app/**/*.tsx` | `✓ Compiled / in …`, página atualizada, estado do React mantido |
| `.scss` / `.module.scss` | `✓ Compiled in …`, estilo reinjetado, sem reload completo |
| `front-end/next.config.ts` | `⚠ Found a change in next.config.ts. Restarting the server to apply the changes…` — o Next reinicia sozinho |

O hot reload através do bind mount precisa de polling, configurado como variável
de ambiente (não num arquivo de config) no `docker-compose.yml`:

```yaml
environment:
  WATCHPACK_POLLING: "true"
```

```bash
docker compose down          # ou  down -v  para remover volumes também
```

---

## 🩺 Solução de problemas

| Sintoma | Causa / correção |
|---------|------------------|
| Edições não fazem hot-reload | (1) o editor não salvou em disco — dev-container precisa de `files.autoSave` (fica em `onFocusChange` no `.devcontainer/frontend/devcontainer.json`); (2) falta `WATCHPACK_POLLING=true` no `environment` do serviço `website` em `docker-compose.yml`; (3) você editou fora de `front-end/` (só `front-end/` é montado); (4) um import com casing diferente do nome do arquivo — não verificado no Next, vale checar primeiro se suspeitar disso |
| Porta já alocada | mude o valor em `docker/.env` e rode `docker compose up` de novo |
| `ERR_PNPM_IGNORED_BUILDS` | uma dependência tem script de build sem decisão — `pnpm approve-builds <pkg>` (ou `!<pkg>` para negar) grava em `front-end/pnpm-workspace.yaml` |
| `node_modules` velho após mudar dependências | `docker compose down -v` e depois `up` |

---

## 🧭 Documentação relacionada

[🏠 Visão geral](../README.pt-BR.md) ·
[🤝 Fluxo de contribuição](../.github/CONTRIBUTING.pt-BR.md) ·
[🎨 app/](../front-end/README.pt-BR.md) ·
[🧩 .devcontainer/](../.devcontainer/README.pt-BR.md) ·
[🤖 CLAUDE.md](CLAUDE.md)
&nbsp;&nbsp;|&nbsp;&nbsp; 🇬🇧 [English](README.md)
