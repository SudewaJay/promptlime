import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    domains: ["lh3.googleusercontent.com"], // ✅ allows Google profile pictures
  },
};

export default nextConfig;

