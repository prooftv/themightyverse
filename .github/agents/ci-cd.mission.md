# ci-cd.mission.md
# Agent: CI/CD Agent
# Purpose: Create GitHub Actions workflows for build, test, lint, pinning metadata, and Vercel deploy.

agent: ci-cd
version: 1.0
roles: [ci]
tools: [GitHub Actions, Vercel]
outputs:
  - .github/workflows/ci.yml
  - .github/workflows/pin-metadata.yml

## Task
1. CI Workflow:
   - on: pull_request
   - steps: checkout, node install, lint, run tests, build
2. Pin Metadata Workflow:
   - on: push to main
   - steps: run /scripts/buildMetadata.js, pin to nft.storage (uses NFT_STORAGE_KEY), commit manifest CID, create release note
3. Deploy:
   - on merge to main: build and deploy to Vercel

Acceptance:
- Workflows run on PRs and main; artifacts visible in Actions.
