# Contributing to IFNOT

Thanks for your interest in improving this project. This repo is intentionally minimal; the goal is to keep documentation clear and workflows safe.

## Push-and-polish checklist

Before you push or open a pull request (PR):

- Run formatting on your changes or rely on CI:
  - The GitHub Action "Push and polish" checks Markdown, JSON, and YAML via Prettier.
- If the repo includes a `package.json`, also run locally (or confirm CI is green):
  - `npm run lint` (if present)
  - `npm run typecheck` (if present)
  - `npm test` (if present)
- Keep diffs small and scoped to the task. Avoid unrelated whitespace or drive-by changes.

## Safety and Review

We take safety seriously. During review:

- Watch for risky changes (examples):
  - Adding or modifying scripts that fetch remote code, execute shell commands, or alter CI/CD in unsafe ways
  - Introducing secrets/credentials, API keys, or tokens into code or configuration
  - Dependency changes that could enable supply-chain risks (typosquats, opaque binaries)
  - Silent telemetry/analytics or privilege escalations without clear justification
- If you suspect malicious intent or risky behavior:
  1. Do not merge.
  2. Convert the PR to Draft.
  3. Add a comment starting with `SAFETY FLAG:` describing the concern.
  4. Mention `@CosmicJesterX` for review.
- Prefer transparency. Keep discussion on the PR unless sensitive details require a private channel.

## How we work

- PRs should be concise and focused. If scope grows, split follow-ups.
- Use clear, action-oriented titles and keep descriptions up to date.
- If you are unsure about wording or triggers in CI, open the PR as a Draft first.

## Local setup (optional)

This repository has no runtime dependencies. If you add a JS/TS project later, standard Node.js workflows are supported by CI. Use `npm install` and scripts as appropriate.

By contributing, you agree that your contributions will be reviewed for safety and scope.
