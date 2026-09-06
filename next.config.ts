import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // Security headers are now handled by middleware.ts for nonce-based CSP
  // This allows us to remove 'unsafe-inline' and 'unsafe-eval'
};

export default nextConfig;
