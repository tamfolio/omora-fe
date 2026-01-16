import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, 

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false, 
  },
  
  async redirects() {
    return [
      {
        source: "/404",
        destination: "/notfound",
        permanent: false,
      },
      {
        source: "/error",
        destination: "/notfound",
        permanent: false,
      },
    ];
  },

  // 👇 THIS IS THE NEW PART
  async rewrites() {
    return [
      {
        // When the frontend calls '/user/api/...'
        source: "/user/api/:path*",
        
        destination: "https://api.omora.com/user/api/:path*", 
      },
    ];
  },
};

export default nextConfig;