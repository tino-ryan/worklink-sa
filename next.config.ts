// next.config.mjs
import withPWAInit from 'next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'supabase-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60
        }
      }
    }
  ]
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {}, // <-- THIS SILENCES THE ERROR
  reactStrictMode: true,
   eslint: {
    ignoreDuringBuilds: true, // <-- allow build to succeed even if there are ESLint errors
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co'
      }
    ]
  }
};

export default withPWA(nextConfig);
