# deck-viewer.mission.md
# Agent: Deck Viewer Generator
# Purpose: Scaffold & update React components for DeckViewer and HeroCanvas (2.5D).

agent: deck-view
version: 1.0
roles: [frontend]
tools: [React Three Fiber, drei, GSAP, Framer Motion]
outputs:
  - HeroCanvas.tsx
  - DeckViewer.tsx
  - DeckCard.tsx
  - sample integration page /app/deck/[deckId].tsx

## Task
1. Implement HeroCanvas.tsx:
   - Accepts layers from metadata (bg, mg, fg) plus depth_map_cid.
   - Renders planes with textures; uses depth_map to set z-offsets.
   - Provides popOut(index) animation and supports highlight anchors overlay (from ad_anchor.json).
   - Exposes API to switch animator_version and load different decks.
2. Implement DeckViewer.tsx:
   - Loads /data/manifest index; renders cards in a responsive grid; supports shuffle, filter by tag, and "Play only this artist" behavior.
3. Tests:
   - Unit tests for component props, and a Playwright e2e test for "play card" and "pop-out".
4. Deliverables:
   - Add storybook stories for visual verification.

Human review:
- UX should be smooth; performance fallback for mobile lite mode (no depth shader).
