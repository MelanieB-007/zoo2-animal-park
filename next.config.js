/** @type {import('next').NextConfig} */

// next.config.js
const { i18n } = require('./next-i18next.config');

const nextConfig = {
  compiler: {
    // Das ist lebensnotwendig für Styled Components in Next.js!
    styledComponents: true,
  },
  reactStrictMode: true,
  // Hier kannst du später Bilder von externen Domains (z.B. Discord Avatare) erlauben
  images: {
    domains: ['cdn.discordapp.com'],
  },
};

module.exports = nextConfig;