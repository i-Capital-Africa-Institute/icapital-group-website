/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize server components
  serverExternalPackages: ['@apollo/client'],

  experimental: {
    optimizePackageImports: ['react-icons', 'framer-motion', 'react-icons/fa'],
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    // Do not override splitChunks — fixed chunk names (e.g. "vendors")
    // cause CSS to be requested as <script> and fail MIME checks.
    return config;
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/fonts/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/_next/static/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/_next/image(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/(manifest.json|robots.txt)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/knowledge-sharing/east-africa-finance-summit",
        destination: "/eafs",
        permanent: true,
      },
      {
        source: "/knowledge-sharing/east-africa-finance-summit/:path*",
        destination: "/eafs/:path*",
        permanent: true,
      },
    ];
  },

  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    remotePatterns: [
      { protocol: "https", hostname: "icapital-cms.techawks.io" },
      { protocol: "https", hostname: "icapital-cms.frontiertech" },
      { protocol: "https", hostname: "icapital.s3.us-east-2.amazonaws.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "icms.frontiertech.org" },
      { protocol: "http",  hostname: "localhost" },
    ],
  },

  compress: true,
  trailingSlash: false,
  reactStrictMode: true,
  poweredByHeader: false,

  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
