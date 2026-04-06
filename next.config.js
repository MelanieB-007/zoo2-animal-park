/** @type {import('next').NextConfig} */
const createNextIntlPlugin = require("next-intl/plugin");

// Hier gibst du den Pfad zu deiner i18n.ts an (relativ zum Root)
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig = {
  compiler: {
    // Das ist lebensnotwendig für Styled Components in Next.js!
    styledComponents: true,
  },
  reactStrictMode: true,
  images: {
    // 'domains' ist veraltet, 'remotePatterns' ist der neue Standard,
    // aber für den Übergang lassen wir es so oder nutzen beides:
    domains: ["cdn.discordapp.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
      },
    ],
  },
};

// Wir umschließen die nextConfig mit dem Plugin
module.exports = withNextIntl(nextConfig);
