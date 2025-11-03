# isrc-generator.mission.md
# Agent: ISRC Generator
# Purpose: Provide an ISRC stub generation service and admin flow for RISA registration.

agent: isrc-generator
version: 1.0
roles: [ops, admin]
tools: [node script, admin approval flow]
outputs:
  - isrc_stub (format ZA-XXXX-YY-00001)
  - admin registration checklist

## Task
1. Implement /scripts/generateIsrc.js that:
   - Accepts registrant code (configurable) and sequence number.
   - Produces ISRC in format: CCXXXYYNNNNN (documented).
2. Provide admin UI to "reserve ISRC" (stores stub in pending manifest) and export CSV for RISA.
3. After RISA confirmation, update metadata `isrc` field permanently and re-pin metadata.

Human-in-loop:
- Admin must confirm actual RISA registration before mainnet mint.

Acceptance:
- ISRC stubs generated and exported.
