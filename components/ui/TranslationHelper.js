export function getTranslatedName(item, lang) {
  if (!item) return "";

  // Falls das neue texte-Array vorhanden ist (unser neuer Standard)
  if (item.texte && Array.isArray(item.texte)) {
    const translation = item.texte.find((t) => t.spracheCode === lang);

    if (translation && translation.name) {
      return translation.name;
    }

    // Fallback: Wenn die gewünschte Sprache nicht da ist, versuche Deutsch
    const fallbackDe = item.texte.find((t) => t.spracheCode === 'de');
    if (fallbackDe && fallbackDe.name) return fallbackDe.name;
  }

  // Kompatibilitäts-Fallback:
  // Falls wir alte Datenobjekte haben, die noch name/nameEn direkt nutzen
  switch (lang) {
    case 'en':
      return item.nameEn || item.name || "";
    default:
      return item.name || item.nameEn || "";
  }
}