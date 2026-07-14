import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/software/jasper-2026-03-14',
        destination: '/?welcome=true',
        permanent: true,
      },
      {
        source: '/software/jasper-2026-03-14/:path*',
        destination: '/?welcome=true',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
