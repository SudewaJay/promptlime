/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google avatars
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com', // Pinterest full-size
      },
      {
        protocol: 'https',
        hostname: 'pin.it', // Pinterest short links
      },
      {
        protocol: 'https',
        hostname: '*.r2.dev', // Cloudflare R2 Dev URLs
      },
      {
        protocol: 'https',
        hostname: 'images.promptlime.space', // Custom CDN domain
      },
    ],
  },

};

module.exports = nextConfig;