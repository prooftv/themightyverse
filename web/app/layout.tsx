import './globals.css'

export const metadata = {
  title: 'The Mighty Verse - Holographic 2.5D Blockchain Ecosystem',
  description: 'Revolutionary platform for African heroes in the metaverse with holographic visualization and blockchain integration',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🔮</text></svg>" />
      </head>
      <body className="mighty-verse-app">{children}</body>
    </html>
  )
}
