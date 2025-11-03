# ad-placement.mission.md
# Agent: AI Ad Placement Advisor
# Purpose: Suggest ad anchor positions and render a preview layer for admin review.

agent: ad-placement
version: 1.0
roles: [ai, admin]
tools: [SAM, YOLOv8, R3F preview generator]
outputs:
  - suggested_ad_anchors.json
  - preview_scene (R3F sample with anchors overlay)

## Task
1. Input: metadata_suggestion.json, asset CID, depth_map_cid.
2. Actions:
   - Identify candidate billboards, static props, negative space via segmentation/motion masks.
   - Score each candidate by visibility, duration on-screen, likelihood to occlude important content.
   - Output `suggested_ad_anchors.json` with: anchor_id, x, y, z, start_frame, end_frame, reason, confidence.
   - Generate a lightweight R3F JSON preview that admin can load into AdAnchorEditor to see anchors overlaid on the scene.
3. Human-in-loop:
   - Admin opens editor, accepts/edits anchors. Final anchors saved as `ad_anchor.json` and pinned to IPFS.
4. Output:
   - Save anchor CID to `metadata.json` via `metadata-gen` or patch workflow.

Acceptance:
- Admin must approve and sign anchors before minting. No automatic ad injection without sign-off.
