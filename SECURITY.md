# Security Policy

This repository is public. Keep sensitive data out of the codebase and PRs.

## Secret hygiene checklist

Use this quick checklist before pushing code or opening a PR:

- Never commit secrets (API keys, tokens, private keys, passwords). Prefer environment variables and GitHub Actions Secrets.
- Do not commit local env files. Keep `.env`, `.env.*`, `*.pem`, and similar out of git (add to `.gitignore` if needed). Provide safe examples via `.env.example` only.
- Avoid pasting logs or screenshots that may contain secrets into issues/PRs. If needed, redact first.
- Rotate immediately if exposure is suspected:
  1. Revoke/rotate the credential with the provider.
  2. Remove the secret from git history (use `git filter-repo`/`git filter-branch`) and force‑push the cleaned branch.
  3. Create a follow‑up note in the PR/issue summarizing the rotation action (no secret values).
- Use GitHub protections:
  - Enable Secret scanning alerts for this repo (public repos can enable this for free).
  - Enable Secret scanning push protection to block pushes that contain detected secrets.
- For local scans before commit, consider a scanner like `gitleaks` (optional).

## Reporting a vulnerability

If you discover a security issue in this repository:

1. Do not open a public issue with details.
2. Email the repository owner (GitHub user `@CosmicJesterX`) with a brief, private report.
3. We will acknowledge within 72 hours and coordinate a fix.
