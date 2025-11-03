# campaigns.mission.md
# Agent: Campaign Manager
# Purpose: Create sponsor campaigns, allocate ad slots across murals/cards, track sponsor spend & schedule.

agent: campaigns
version: 1.0
roles: [ops, finance, admin]
tools: [contracts, offchain ledger (CSV / Google Sheets), web dashboard]
outputs:
  - campaign_manifest.json
  - campaign_payments.log

## Task
1. Input:
   - sponsor details, brand assets, target murals/decks, budget, start/end dates.
2. Actions:
   - Assign available ad_anchor slots across selected cards; mark anchors as reserved (temporarily).
   - Create `campaign_manifest.json` linking sponsor → reserved anchors → contract payment terms.
   - On payment cleared (off-chain or on-chain), change anchor state from `reserved` → `active`.
   - Record impressions / clicks via analytics service; aggregate for payout schedule.
3. Human-in-loop:
   - Finance confirms payment; admin finalizes anchor activation.
4. Output:
   - Campaign dashboard & payment logs; anchors updated in metadata.

Acceptance:
- Sponsor sees preview of placements in R3F preview; invoice generated for sponsor approval.
