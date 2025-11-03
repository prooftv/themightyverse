import React from 'react'

export default function Deck({ params }) {
  const { deckId } = params
  return (
    <main style={{padding: 24}}>
      <h2>Deck {deckId} (stub)</h2>
      <p>This page is a stubbed deck viewer. Integrate with the agents API to show cards and assets.</p>
    </main>
  )
}
