import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '6234779.fs1.hubspotusercontent-na1.net' },
      { protocol: 'https', hostname: 'github.com' },
      { protocol: 'https', hostname: 'encrypted-tbn0.gstatic.com' },
      { protocol: 'https', hostname: 'classroom.strawbees.com' },
      { protocol: 'http', hostname: 'res.cloudinary.com' }
    ]
  }
}

export default nextConfig
