import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Note: 'export' mode removed to support API routes (GitHub OAuth)
  // For static hosting, deploy to Vercel/Netlify which handles API routes
  images: {
    unoptimized: true,
  },
  // Base path for production (adjust based on deployment)
  // basePath: process.env.NODE_ENV === 'production' ? '' : '',
};

export default nextConfig;
