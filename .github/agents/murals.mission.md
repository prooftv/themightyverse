# murals.mission.md
# Agent: Mural Assembler
# Purpose: Combine animator perspectives into mural templates, produce master timeline, and generate deck slices (cards).

agent: murals
version: 1.0
roles: [curator, assembler]
tools: [timeline editor script, R3F preview]
outputs:
  - mural_manifest.json
  - deck_card_list.json

## Task
1. Inputs:
   - multiple `metadata.json` for animator versions (futuristic, gritty).
2. Actions:
   - Validate timecodes/segments for main artist and feature artist segments.
   - Assemble master mural timeline (default perspective) with mapping to animator versions.
   - For each featured segment produce a `card` entry with `start_frame`, `end_frame`, `animator_version` and `manifest_cid`.
   - Generate `mural_manifest.json` describing versions, timeline, and default deck order.
3. Admin:
   - Curator reviews assembled mural in R3F preview; finalizes default timeline.
4. Output:
   - Save `mural_manifest.json` and pin to IPFS.

Acceptance:
- Mural timeline must be continuous and each card mapped to a manifest with depth maps and ad anchors.
