# asset-review.mission.md
# Agent: Asset Review Agent
# Purpose: Validate uploaded animation/video assets, run AI pre-scan (depth + segmentation + tags), and produce metadata suggestions and QC flags.

## Header
agent: asset-review
version: 1.0
roles: [ai, reviewer]
modes: [plan, execute]
tools: [MiDaS (depth), SAM (segmentation), CLIP (visual tags), Whisper (audio transcription)]
outputs:
  - metadata_suggestion.json
  - qc_report.json
  - suggested_ad_anchors.json

## Task
1. Input: asset CID (IPFS), manifest.json (contains frame_rate, duration, contributor list).
2. Actions:
   - Fetch asset from IPFS.
   - Run **MiDaS** depth estimation on provided layer(s) (or frames if video).
   - Run **SAM/YOLO** to identify main subjects, motion zones, and safe zones.
   - Run **Whisper** (or provided transcript) to transcribe audio and produce tempo / BPM estimate.
   - Run **CLIP** for scene mood / style classification.
   - Produce `metadata_suggestion.json` conforming to `metadata_schema.json` (include confidences).
   - Produce `qc_report.json` with `confidence_score` (0–1), issues (file corruption, missing layers, too long, fps mismatch).
   - Produce `suggested_ad_anchors.json` with up to 6 candidate anchors (x,y normalized, z suggestion, frame_start, frame_end, confidence, reason).
3. Human-in-loop:
   - If `confidence_score < 0.8` OR any critical issue, create PR labeled `asset:needs-review` and assign admin curator.
4. Output storage:
   - Pin the three JSON files to nft.storage and log returned CIDs in the asset's pending manifest (store at `/data/pending/{asset_id}/`).

## Acceptance Criteria (for human admin)
- Confirmed metadata matches creative intent.
- No obstructive ad anchors overlapping faces or lyrics text.
- If approved, mark asset status `QC:approved` else `QC:needs-fix`.
