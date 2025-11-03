# rbac.mission.md
# Agent: RBAC & Policy Agent
# Purpose: Scaffold and enforce role-based access control for Admin, Curator, Animator, Sponsor, Viewer.

agent: rbac
version: 1.0
roles: [ops, security]
tools: [NextAuth (or Web3Auth), role middleware, Gnosis Safe]
outputs:
  - Access policy definitions
  - Middleware for pages & API routes
  - Admin role seeding script

## Task
1. Create roles: Admin, Curator, Animator, Sponsor, Viewer.
2. Implement server-side middleware to gate:
   - /admin/* (Admin only)
   - /animator/* (Animator + Admin)
   - /sponsor/* (Sponsor + Admin)
3. Provide a UI to invite & manage roles (emails + wallet linking).
4. Seed initial Admin(s) from env or multisig mapping.

Acceptance:
- All sensitive APIs gated & tested with unit tests.
