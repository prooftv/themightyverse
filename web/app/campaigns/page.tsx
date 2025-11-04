'use client';

import Link from 'next/link';

export default function Campaigns() {
  return (
    <div className="mighty-verse-app min-h-screen">
      <div className="mv-nav mx-4 mt-4">
        <div className="mv-nav-brand">
          <Link href="/" className="mv-heading-lg hover:mv-text-accent transition-colors">
            ◆ The Mighty Verse
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16 mv-fade-in">
          <h1 className="mv-heading-xl mb-6">◇ Campaigns ◇</h1>
          <p className="mv-text-muted text-xl mb-8">
            Live sponsor activations and featured collaborations
          </p>
        </div>

        <div className="mv-card mv-holographic p-12 text-center">
          <div className="text-8xl mb-6">◇</div>
          <h2 className="mv-heading-lg mb-4">Campaign System</h2>
          <p className="mv-text-muted text-lg mb-8">
            Sponsor-driven campaigns with holographic brand placements in 2.5D space
          </p>
          <div className="text-sm mv-text-muted">
            Coming Soon - Campaign Builder & Sponsor Dashboard Integration
          </div>
        </div>
      </div>
    </div>
  );
}