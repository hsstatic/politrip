import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "unpkg.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/sitemap.xml",
        destination: "/sitemap-xml",
      },
      {
        source: "/robots.txt",
        destination: "/robots-txt",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'; object-src 'none'; connect-src 'self' https://*.convex.cloud wss://*.convex.cloud;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
