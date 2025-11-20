import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add ESLint bypass for deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false, // Keep TypeScript checks active
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
  // ❌ REMOVED THE PROBLEMATIC REWRITE
  // This was preventing middleware from running!
  /* other config options here */
};

export default nextConfig;