# security.mission.md
# Agent: Security/Audit Agent
# Purpose: Generate security checklist for contracts & front-end; run automated scans and produce report.

agent: security
version: 1.0
roles: [security]
tools: [slither, mythx (optional), npm audit]
outputs:
  - security_report.md
  - suggested fixes PR

## Task
1. Run static analyzers on contracts and JS libs.
2. Check dependency vulnerabilities (npm audit).
3. Run linter and format checks.
4. Produce `security_report.md` summarizing findings with severity tags.
5. If critical vulnerabilities found, open PRs with fixes.

Human-in-loop:
- All critical issues must be resolved prior to mainnet deployment.

Acceptance:
- Security report created and action items assigned.
