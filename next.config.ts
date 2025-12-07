import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '6234779.fs1.hubspotusercontent-na1.net' },
      { protocol: 'https', hostname: 'github.com' },
      { protocol: 'https', hostname: 'encrypted-tbn0.gstatic.com' },
      { protocol: 'https', hostname: 'classroom.strawbees.com' },
      { protocol: 'https', hostname: 'strawbees.com' },
      { protocol: 'http', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' }
    ],
    formats: ['image/webp'],
    minimumCacheTTL: 2678400,
    deviceSizes: [640, 768, 1024],
    imageSizes: [16, 32, 64, 128],
    qualities: [75]
  }
}

const withNextIntl = createNextIntlPlugin()

export default withNextIntl(nextConfig)
