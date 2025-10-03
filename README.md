# IFNOT
The IFNOT Fund

## Charlie Labs AI Integration

IFNOT collaborates with Charlie Labs AI, a Texas-based AI company, to explore and apply advanced AI capabilities.

Website: [www.charlielabs.ai](https://www.charlielabs.ai)

### Scope
This repository does not currently include code-level integration; this README only documents the collaboration. See [To enable Charlie in this repository](#to-enable-charlie-in-this-repository-if-not-already-enabled) below.

### Integration Details

#### Owners
- Repository owner: [@CosmicJesterX](https://github.com/CosmicJesterX)
- Charlie contact: [hello@charlielabs.ai](mailto:hello@charlielabs.ai)

#### Touchpoints

> Prerequisite: Ensure Charlie is enabled for this repo as described in [To enable Charlie in this repository](#to-enable-charlie-in-this-repository-if-not-already-enabled) before using these touchpoints.
- Pull requests: request a review from `@CharlieHelps` to trigger a full review. You can also mention `@CharlieHelps` in a PR comment to ask questions or apply suggestions.
- Issues: mention `@CharlieHelps` to request an implementation plan or ask to open a PR for a fix.
- Note: interactions happen through the CharlieCreates GitHub App; no separate REST API is required for typical use.

#### Request Access
For contributors who want to collaborate here:

1. Open a GitHub issue titled "Access request: IFNOT" and include:
   - Your GitHub username and the role you need (Read/Triage/Write)
   - A brief reason and any time-bound scope
2. A maintainer will review and grant access or follow up with questions.

#### To Enable Charlie in This Repository (if not already enabled)

1. Install the [CharlieCreates GitHub App](https://github.com/apps/charliecreates) for this repo.
   - During installation, choose "Only select repositories" and select this repository (least privilege recommended).
2. Invite the GitHub user `@CharlieHelps` with at least the [Triage role](https://docs.github.com/en/organizations/managing-user-access-to-your-organizations-repositories/repository-roles-for-an-organization) (orgs) or Read access (personal repos) so you can request reviews. Mentions can work without inviting, but automated actions rely on the CharlieCreates app being installed; review requests require collaborator access.
   > Note: The "Triage" role is only available for organization repositories. For personal repositories, invite `@CharlieHelps` as a collaborator with Read access to enable review requests.
3. Then, collaborate by mentioning `@CharlieHelps` in issues/PRs as shown above.

#### Privacy and Permissions
- Review the app’s requested permissions on the [CharlieCreates GitHub App page](https://github.com/apps/charliecreates).
- Prefer installing the app on "Only select repositories" and limit access to what’s required for your workflows.
- Do not include secrets or credentials in issues or PRs; the integration operates via GitHub APIs and does not require access to your infrastructure secrets.

#### Example Prompts
- `@CharlieHelps review this PR and focus on correctness`
- `@CharlieHelps draft a step-by-step plan to add unit tests for <file>`
- `@CharlieHelps open a PR to add a SECURITY.md with a standard responsible disclosure policy`
