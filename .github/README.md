# 🤝 `.github/` — automation & contribution workflow

<p>
  <img alt="CI" src="https://img.shields.io/badge/CI-tag--triggered-2088FF?logo=githubactions&logoColor=white">
  <img alt="Reviews" src="https://img.shields.io/badge/reviews-CODEOWNERS-24292e?logo=github&logoColor=white">
  <img alt="Issues" src="https://img.shields.io/badge/issues-forms%20only-0969da?logo=github&logoColor=white">
  <img alt="Versioning" src="https://img.shields.io/badge/versioning-SemVer%20(v*)-orange">
</p>

**🌐 Language:** **English** · [Português](README.pt-BR.md)

This folder holds the repository's automation and community-health files, and
this page is the **single source of truth for the contribution workflow**: dev
environment, branches, issues, pull requests, versioning and releases.

> ⚠️ GitHub surfaces `.github/README.md` **instead of** the root `README.md` on
> the repository home page (precedence: `.github/` → root → `docs/`). That is
> intentional here — contributors land on the workflow. The project overview is
> in [`../README.md`](../README.md).
>
> _Workflow diagrams are temporarily removed and will be re-added here._

---

## 📁 What's in this folder

| Path | Purpose |
|------|---------|
| [`CODEOWNERS`](CODEOWNERS) | required reviewers per path — a 5-person roster (placeholders; replace with real handles) |
| [`ISSUE_TEMPLATE/`](ISSUE_TEMPLATE) | structured issue **forms** — `bug_report`, `feature_request`, `task`; `config.yml` disables blank issues |
| [`PULL_REQUEST_TEMPLATE.md`](PULL_REQUEST_TEMPLATE.md) | the checklist every PR must complete |
| [`workflows/release.yml`](workflows/release.yml) | the **only** CI workflow — runs on a `v*.*.*` tag, never on branches or PRs |

---

## 1 · 🧰 Set up your environment

The **only** supported workflow is the dev-container.

```bash
# 1. fork on GitHub, then:
git clone https://github.com/<you>/aegir-hotel.git
cd aegir-hotel
git remote add upstream https://github.com/CarlosNeto-dev/aegir-hotel.git

# 2. open the editor from the terminal
cursor .            # or:  code .

# 3. in the editor:  Ctrl/Cmd + Shift + P
#    → "Dev Containers: Reopen in Container"
#    → pick  .devcontainer/frontend
```

<!-- diagram (flowchart) removed on request — to be re-added later -->

The container is the same one `docker compose` runs, so what you see is what CI
and production get. See [`../docker/README.md`](../docker/README.md) and
[`../.devcontainer/README.md`](../.devcontainer/README.md).

---

## 2 · 🌿 Branches

`main` = production (tagged). `develop` = integration. Everything else branches
off `develop` and merges back into it.

| Branch | Purpose | Branches from | Merges into | Protected |
|--------|---------|---------------|-------------|-----------|
| `main` | production; every commit is releasable and tagged | — | — | ✅ |
| `develop` | integration of finished work | `main` | `main` (via a release PR) | ✅ |
| `feature/<slug>` | one issue's feature work | `develop` | `develop` | — |
| `fix/<slug>` | non-urgent bug fix | `develop` | `develop` | — |
| `chore/<slug>` | tooling / deps / docs | `develop` | `develop` | — |
| `hotfix/<slug>` | urgent production fix | `main` | `main` **and** `develop` | — |

<!-- diagram (gitGraph) removed on request — to be re-added later -->

- Real branch names carry the issue (`feature/1234-lobby-scene`); `fix/*` and
  `hotfix/*` follow the same shape as the table above.
- Keep branches short-lived. Rebase on `develop` before opening the PR.
- One issue leads to one branch leads to one PR.

---

## 3 · 🧩 Issues & GitHub Projects

<!-- diagram (stateDiagram-v2) removed on request — to be re-added later -->

1. Open an issue with a form
   ([bug](ISSUE_TEMPLATE/bug_report.yml) ·
   [feature](ISSUE_TEMPLATE/feature_request.yml) ·
   [task](ISSUE_TEMPLATE/task.yml)). Blank issues are disabled.
2. A maintainer triages it, applies labels and drops it on the **GitHub Project**
   board (`Triage` → `Todo` → `In progress` → `In review` → `Done`). Set the
   `projects:` key in each form once your board exists.
3. Pick a card in **Todo**, assign yourself, move it to **In progress**.
4. Your PR closes the issue: put `Closes #<id>` in the description. Merging moves
   the card to **Done** automatically.

---

## 4 · 🔁 Pull requests — fork → review → merge

<!-- diagram (sequenceDiagram) removed on request — to be re-added later -->

```bash
git switch develop && git pull upstream develop
git switch -c feature/1234-lobby-scene

# ...work, committing as you go...

npm run lint && npm run typecheck && npm run test && npm run build

git push -u origin feature/1234-lobby-scene
# open the PR on GitHub, base = develop, fill the template
```

**PR rules**

- Base branch is **`develop`** (only release PRs target `main`).
- The [PR template](PULL_REQUEST_TEMPLATE.md) checklist must be complete.
- At least one **[CODEOWNERS](CODEOWNERS)** approval.
- All checks green. Squash-merge; the PR title becomes the changelog line.
- Update docs — `README.md` **and** `README.pt-BR.md` — in the same PR.
- Run [`scripts/check-docs.sh`](../scripts/check-docs.sh) if you touched any
  Mermaid diagram.

**Commit messages** — [Conventional Commits](https://www.conventionalcommits.org):
`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, `test:`, `ci:` … Add `!` for a
breaking change.

---

## 5 · 🏷️ Versioning & release

[SemVer](https://semver.org): `MAJOR.MINOR.PATCH`, tag prefix `v`
(pre-releases: `v1.2.0-rc.1`).

<!-- diagram (sequenceDiagram) removed on request — to be re-added later -->

```bash
# on main, after the release PR is merged:
git switch main && git pull upstream main
git tag v1.2.0
git push upstream v1.2.0        # ← the only trigger for GitHub Actions
```

[`workflows/release.yml`](workflows/release.yml) runs **only** on a `v*.*.*` tag.
Pipeline: `detect` (find `app/package.json`, read `NODE_VERSION` from
`docker/.env.example`) → `quality` (`npm ci`, then lint · format · typecheck ·
test · `npm audit` · build, each `--if-present`) → `release` (`gh release create`
with generated notes and the built `dist/` zipped). Until `app/package.json`
exists, `quality` is skipped and the workflow still publishes a Release for the
tag. **That Release is the final, deliverable artifact.**

---

## 🧭 Related docs

[🏠 Project overview](../README.md) ·
[🎨 app/](../app/README.md) ·
[🐳 docker/](../docker/README.md) ·
[🧩 .devcontainer/](../.devcontainer/README.md) ·
[🤖 CLAUDE.md](../CLAUDE.md)
&nbsp;&nbsp;|&nbsp;&nbsp; 🇧🇷 [Português](README.pt-BR.md)
