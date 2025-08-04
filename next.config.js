/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === "production";

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  disable: !isProd,
  skipWaiting: true,
});

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "referrer-policy", value: "no-referrer" }],
      },
    ];
  },
};

module.exports = withBundleAnalyzer(withPWA(nextConfig));
