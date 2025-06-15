import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '6234779.fs1.hubspotusercontent-na1.net' }
    ]
  }
}

export default nextConfig
