/** @type {import('next').NextConfig} */
import withPWAInit from '@ducanh2912/next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  reloadOnOnline: true,
  // disable: process.env.NODE_ENV === 'development',
  register: true,
});

const nextConfigWithPWA = withPWA({
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value:
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://*.google-analytics.com;",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.azuro.org',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/events',
        destination: `/`,
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/',
        destination: '/events',
        permanent: false,
      },
    ];
  },
});

export default nextConfigWithPWA;
