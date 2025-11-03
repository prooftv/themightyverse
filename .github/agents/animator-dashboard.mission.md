# animator-dashboard.mission.md
# Agent: Animator Dashboard
# Purpose: Create a simple animator portal for uploads, depth guidance, and status tracking.

agent: animator-dashboard
version: 1.0
roles: [frontend]
tools: [Next.js, nft.storage]
outputs:
  - /app/animator/index.tsx
  - Upload flow connected to /api/pinToIPFS
  - Upload checklist with required layer/export specs (png sequences, alpha, fps)
  - Depth map instructions link to /colab/MightyDepth.ipynb

## Task
1. Upload form with validation for required files:
   - bg.png, mg.png, fg.png or webm layers
   - optional precomputed depth maps
   - contributor info (wallet & SAMRO)
2. On submit: pin files to nft.storage; create pending manifest and notify admin queue.
3. Track status: pending → qc_review → approved → minted
4. Simple messaging to admin for clarifications.

Acceptance:
- Animator sees clear checklist and status updates.
