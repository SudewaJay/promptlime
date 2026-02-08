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
    ],
  },

};

module.exports = nextConfig;