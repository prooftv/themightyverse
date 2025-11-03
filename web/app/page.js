import Link from 'next/link';

export default function Home() {
  return (
    <div className="mighty-verse-app min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 mv-fade-in">
          <h1 className="mv-heading-xl mb-6">◈ The Mighty Verse ◈</h1>
          <p className="mv-text-muted text-xl mb-8 max-w-3xl mx-auto">
            2.5D Holographic Blockchain Ecosystem - African Heroes in the Metaverse
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/hub">
              <button className="mv-button text-lg px-8 py-4">
                ◆ Enter Asset Hub ◆
              </button>
            </Link>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Link href="/admin">
            <div className="mv-card mv-holographic p-8 text-center cursor-pointer group">
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-500">◆</div>
              <h3 className="mv-heading-md mb-2">Admin Dashboard</h3>
              <p className="mv-text-muted">Platform administration and content management</p>
            </div>
          </Link>

          <Link href="/animator">
            <div className="mv-card mv-holographic p-8 text-center cursor-pointer group">
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-500">◈</div>
              <h3 className="mv-heading-md mb-2">Animator Portal</h3>
              <p className="mv-text-muted">Create and submit 2.5D holographic content</p>
            </div>
          </Link>

          <Link href="/deck">
            <div className="mv-card mv-holographic p-8 text-center cursor-pointer group">
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-500">◉</div>
              <h3 className="mv-heading-md mb-2">Holographic Deck</h3>
              <p className="mv-text-muted">Experience immersive 3D content viewer</p>
            </div>
          </Link>
        </div>

        {/* Asset Hub Preview */}
        <div className="mv-card mv-holographic p-12 text-center">
          <div className="text-8xl mb-6 animate-pulse">◈</div>
          <h2 className="mv-heading-lg mb-4">2.5D Holographic Media Experience</h2>
          <p className="mv-text-muted text-lg mb-8">
            Discover, play, and manage digital assets with advanced holographic animations
          </p>
          <Link href="/hub">
            <button className="mv-button-secondary text-lg px-8 py-4">
              Explore Asset Hub
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}