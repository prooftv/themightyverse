/** Next.js config for Codespaces */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: []
  },
  async rewrites() {
    return [
      {
        source: '/admin/:path*',
        destination: '/admin/:path*'
      },
      {
        source: '/animator/:path*', 
        destination: '/animator/:path*'
      }
    ];
  }
}

module.exports = nextConfig
