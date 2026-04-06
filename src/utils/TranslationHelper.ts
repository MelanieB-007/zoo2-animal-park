// 1. Definition der Text-Struktur (wie sie aus der Datenbank kommt)
interface TranslationText {
  spracheCode: string;
  name: string;
}

// 2. Definition des Items (Tier, Gehege, Statue etc.)
interface TranslatableItem {
  texte?: TranslationText[];
  name?: string; // Altes Format Fallback
  nameEn?: string; // Altes Format Fallback
}

/**
 * Holt den übersetzten Namen basierend auf der aktuellen Sprache.
 * Unterstützt das neue Array-Format und das alte flache Format.
 */
export function getTranslatedName(
  item: TranslatableItem | null | undefined,
  lang: string
): string {
  if (!item) return "";

  // Falls das neue texte-Array vorhanden ist (unser neuer Standard)
  if (item.texte && Array.isArray(item.texte)) {
    const translation = item.texte.find((t) =>
      t.spracheCode === lang);

    if (translation && translation.name) {
      return translation.name;
    }

    // Fallback: Wenn die gewünschte Sprache nicht da ist, versuche Deutsch
    const fallbackDe = item.texte.find((t) =>
      t.spracheCode === "de");
    if (fallbackDe && fallbackDe.name) return fallbackDe.name;

    // Letzter Versuch innerhalb des Arrays: nimm einfach das erste verfügbare
    if (item.texte.length > 0) return item.texte[0].name;
  }

  // Kompatibilitäts-Fallback für alte Datenobjekte
  switch (lang) {
    case "en":
      return item.nameEn || item.name || "";
    default:
      return item.name || item.nameEn || "";
  }
}
