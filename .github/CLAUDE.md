# CLAUDE.md — `.github/`

Agent notes for the CI / community-health files. Root guidance:
[`../CLAUDE.md`](../CLAUDE.md).

## Contents

| File | Notes |
|------|-------|
| `CONTRIBUTING.md` / `CONTRIBUTING.pt-BR.md` | **the** workflow guide (branches, issues, PRs, release). GitHub surfaces it as the repo's "Contributing guidelines". **Do NOT rename it to `README.md`** — that would replace the root README as the repo home page. **Diagrams removed on request** — `<!-- diagram (...) removed ... -->` placeholders mark where 5 go (flowchart, gitGraph, stateDiagram, 2 sequenceDiagrams). Re-add only here, only when the user asks. |
| `CODEOWNERS` | 5 handles: `@CarlosNeto-dev` + `@member-2..5` (placeholders). Keep the roster at 5+; keep the comment block's role list in sync with the rules. |
| `ISSUE_TEMPLATE/*.yml` | GitHub issue **forms**. `render:` only accepts `shell` + linguist languages (not `markdown`). `projects:` is commented out — real value is `owner/number`. |
| `PULL_REQUEST_TEMPLATE.md` | checklist mirrors the release pipeline steps. |
| `workflows/release.yml` | triggers ONLY on `v[0-9]+.[0-9]+.[0-9]+` tags. Never add branch/PR triggers here — the user was explicit. Jobs: `detect → quality → release`. `quality` steps use `--if-present` so they no-op until `app/package.json` has the scripts. |

## Rules

- Diagrams are **removed for now** (user: "depois eu mando você colocar"). When
  the user asks, re-add them **only** at the placeholders in `CONTRIBUTING.md` +
  `CONTRIBUTING.pt-BR.md` here — never in the root README or `../CLAUDE.md`.
  After any diagram edit run `bash ../scripts/check-docs.sh`.
- **Mermaid must stay ultra-conservative** — the user hit renderer errors twice
  (GitHub / IDE preview). Rules that broke things and are now banned:
  - gitGraph: no `/` in branch names; **no `merge <branch> tag:`**; **never
    combine `id:` and `tag:` on one `commit`** — put `tag:` on its own bare
    `commit`. Keep the graph to `main` / `develop` / one `feature`.
  - any diagram: ASCII only in labels — no `<` `>` `#` `·` `→` `—`, no emoji,
    no `subgraph`.
  - Validated on mermaid-cli 10.2 → 11.4.
- `.yml` under `workflows/` and `ISSUE_TEMPLATE/` must stay valid YAML.
- Edits to workflow triggers, CODEOWNERS roster size, or issue-form structure
  are user decisions — confirm before changing.
