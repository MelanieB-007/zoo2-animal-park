/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');

const nextConfig = {
  i18n,
  compiler: {
    styledComponents: true,
  },
  reactStrictMode: true,
  // Hier kannst du später Bilder von externen Domains (z.B. Discord Avatare) erlauben
  images: {
    domains: ['cdn.discordapp.com'],
  },
};

module.exports = nextConfig;