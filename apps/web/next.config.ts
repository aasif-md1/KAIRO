import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  devIndicators: false,
  async rewrites() {
    return [
      {
        source: '/_assets/:path*',
        destination: '/internal-assets/:path*',
      },
    ];
  },
};

export default nextConfig;
