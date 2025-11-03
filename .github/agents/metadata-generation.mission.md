# metadata-generation.mission.md
# Agent: Metadata Generation Agent
# Purpose: Build canonical metadata manifest for a card and pin to IPFS.

agent: metadata-gen
version: 1.0
roles: [builder, signer]
tools: [node, nft.storage, ajv]
outputs:
  - metadata.json
  - manifest_cid

## Task
1. Inputs:
   - metadata_suggestion.json (from asset-review)
   - ad_anchor_cid (optional)
   - depth_map_cid
   - contributor wallet addresses and SAMRO IDs
2. Actions:
   - Validate suggestion JSON with `metadata_schema.json` using `ajv`.
   - Enforce required fields (card_id, project, animator_version, layers, timestamp, sha256).
   - Compute/verify `sha256` for asset by fetching file.
   - Merge ad_anchor_cid, depth_map_cid into final `metadata.json`.
   - If data passes validation, sign manifest locally using admin EIP-712 skeleton (prepare signature payload only; do not auto-sign on main).
   - Pin `metadata.json` to nft.storage and return `manifest_cid`.
3. Human-in-loop:
   - Create PR that contains `metadata.json` and `manifest_cid`. Admin must review and add final EIP-712 signature to approve.
4. Output:
   - Place `metadata.json` under `/data/manifest/{card_id}/metadata.json`.
   - Add `manifest_cid` to `pending_registry.json` for minting queue.

Acceptance:
- Schema validated and PR created with all fields present.
