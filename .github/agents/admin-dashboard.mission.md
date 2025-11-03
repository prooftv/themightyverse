# admin-dashboard.mission.md
# Agent: Admin Dashboard Builder
# Purpose: Scaffold Admin UI for content review, ad anchor editor, mint queue, campaign management, and analytics.

agent: admin-dashboard
version: 1.0
roles: [frontend, backend]
tools: [Next.js, R3F, Tailwind]
outputs:
  - /app/admin/index.tsx
  - AdAnchorEditor integrated
  - MintQueue page with approve/deny actions
  - Campaign Manager page

## Task
1. Implement pages:
   - /admin/assets → pending assets list, QC report, quick preview
   - /admin/ad-editor → open AdAnchorEditor for selected asset
   - /admin/mint-queue → list manifests pending mint; buttons for "Request Signature", "Mint on Testnet"
   - /admin/campaigns → campaign list & anchor reservations
2. Role-based access: only Admin role can approve & sign.
3. Integrate with EIP-712 signature flow (prepare payload; signature step is manual).
4. Tests & storybook stories.

Human-in-loop:
- All approve actions require multi-sig confirmation in production.

Acceptance:
- Admin can complete full workflow from preview to mint request.
