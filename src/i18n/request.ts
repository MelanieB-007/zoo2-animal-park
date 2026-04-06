import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

// Definiere deine unterstützten Sprachen
const locales = ["de", "en"];

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  // 1. Validierung (Wichtig für den Typ-Check)
  if (!locales.includes(locale as string)) notFound();

  // 2. Importiere deine JSON-Dateien
  const common = (await import(`../../public/locales/${locale}/common.json`))
    .default;
  const animals = (await import(`../../public/locales/${locale}/animals.json`))
    .default;
  const contests = (
    await import(`../../public/locales/${locale}/contests.json`)
  ).default;

  return {
    locale: locale as string,
    messages: { ...common, ...animals, ...contests },
    timeZone: "Europe/Berlin",
  };
});
