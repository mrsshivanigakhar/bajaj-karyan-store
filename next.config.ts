import type { NextConfig } from "next";

// Suppress Supabase Node 20 deprecation warning in build & dev console
if (typeof process !== 'undefined') {
  const originalWarn = console.warn;
  console.warn = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Node.js 20 and below are deprecated')
    ) {
      return;
    }
    originalWarn.apply(console, args);
  };
}

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
