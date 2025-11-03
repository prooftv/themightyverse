# audio-workflows.mission.md
# Agent: Audio Workflow Manager
# Purpose: Handle ISRC generation, audio fingerprinting, tagging, and SAMRO integration.

agent: audio-workflows
version: 1.0
roles: [audio-engineer, admin]
tools: [Whisper (transcript), BPM detection script, ISRC stub, audio fingerprint lib]
outputs:
  - audio_metadata.json (tempo, key, duration)
  - isrc_stub.txt
  - samro_link_record.json

## Task
1. Inputs:
   - audio asset CID(s), contributor list with SAMRO IDs.
2. Actions:
   - Run audio transcription (Whisper) → lyrics for split-sheet automation.
   - Detect BPM & key using audio analysis.
   - Create split-sheet suggestion based on metadata and contributor roles (AI-assisted).
   - Generate RISA-compliant ISRC stub (patterned) and mark for admin RISA registration.
   - Produce `audio_metadata.json` and pin to IPFS.
3. Human-in-loop:
   - Admin confirms ISRC finalization with RISA before mainnet mint.
4. Output:
   - Attach audio metadata to `metadata.json`.

Acceptance:
- All audio metadata present and ISRC reserved/pending RISA registration.
