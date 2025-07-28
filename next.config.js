/** @type {import('next').NextConfig} */
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

const isProd = process.env.NODE_ENV === 'production';

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  disable: !isProd,
  skipWaiting: true,
});

module.exports = withPWA(nextConfig);
