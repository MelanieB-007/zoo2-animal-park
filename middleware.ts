import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  // Eine Liste aller unterstützten Locales
  locales: ["de", "en"],

  // Standard-Sprache, wenn keine Übereinstimmung gefunden wird
  defaultLocale: "de",
});

export const config = {
  // Matcher für alle Pfade außer statische Dateien (Bilder, Favicon, etc.)
  matcher: ["/", "/(de|en)/:path*"],
};
