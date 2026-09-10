import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // AVIF first — roughly 30% smaller than WebP on photographic content,
    // which matters at 60+ images (TECH-PLAN §6.2).
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 828, 1080, 1440, 1920, 2560],
    imageSizes: [256, 384, 512],
    minimumCacheTTL: 31536000,
  },
  experimental: {
    optimizePackageImports: ['gsap'],
  },
};

export default nextConfig;
