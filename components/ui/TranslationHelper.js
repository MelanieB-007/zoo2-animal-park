
export function getTranslatedName (item, lang) {
  if (!item) return "";

  switch (lang) {
    case 'en':
      return item.nameEn || item.name;
   /* case 'dk':
      return item.nameDk || item.nameEn || item.name; // Fallback-Kette*/

    default:
      return item.name || item.nameEn;
  }
}