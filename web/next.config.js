/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@thirdweb-dev/sdk']
  },
  api: {
    bodyParser: {
      sizeLimit: '200mb',
    },
  },
  serverRuntimeConfig: {
    maxDuration: 60,
  },
}

module.exports = nextConfig