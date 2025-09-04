import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/404',
        destination: '/notfound',
        permanent: false,
      },
      // You can add more redirects here if needed
      {
        source: '/error',
        destination: '/notfound', 
        permanent: false,
      }
    ]
  },
  // If you want to handle actual 404s automatically
  async rewrites() {
    return {
      fallback: [
        {
          source: '/:path*',
          destination: '/notfound',
        }
      ]
    }
  },
  /* other config options here */
};

export default nextConfig;