/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@thirdweb-dev/sdk']
  },
  api: {
    bodyParser: {
      sizeLimit: '100mb',
    },
  },
  serverRuntimeConfig: {
    maxDuration: 60,
  },
}

module.exports = nextConfig