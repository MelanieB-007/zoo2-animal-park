/** @type {import('next').NextConfig} */

// 1. Import der i18n-Konfiguration (die Datei, die wir gerade erstellt haben)
const { i18n } = require('./next-i18next.config');

const nextConfig = {
  // 2. Hier wird die i18n-Konfiguration dem Next-Objekt hinzugefügt
  i18n,

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