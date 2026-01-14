import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 👇 ADD THIS LINE HERE
  reactStrictMode: false, 

  // Add ESLint bypass for deployment
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

};

export default nextConfig;