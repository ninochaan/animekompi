import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'v3.animekompi.fun',
      },
      {
        protocol: 'https',
        hostname: 'i0.wp.com',
      },
      {
        protocol: 'https',
        hostname: 'i1.wp.com',
      },
      {
        protocol: 'https',
        hostname: 'i2.wp.com',
      },
      {
        protocol: 'https',
        hostname: 'i3.wp.com',
      },
      {
        protocol: 'http',
        hostname: 'v3.animekompi.fun',
      },
      {
        protocol: 'https',
        hostname: 'otakudesu.cloud',
      },
      {
        protocol: 'https',
        hostname: '*.otakudesu.cloud',
      },
      {
        protocol: 'https',
        hostname: 'otakudesu.lol',
      },
      {
        protocol: 'https',
        hostname: '*.otakudesu.lol',
      },
      {
        protocol: 'https',
        hostname: 'cdn.myanimelist.net',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'otakudesu.cam',
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;