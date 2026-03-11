export const AnimalService = {
  /**
   * Filtert die Tierliste basierend auf Suchbegriff, Gehege und Stalllevel
   */
  filterAnimals(tiere, { searchTerm, selectedGehege, selectedLevel }) {
    if (!tiere) return [];

    return tiere.filter((tier) => {
      const searchLower = searchTerm.toLowerCase();

      // Suche im deutschen und englischen Namen
      const matchesSearch =
        tier.name.toLowerCase().includes(searchLower) ||
        (tier.nameEn && tier.nameEn.toLowerCase().includes(searchLower));

      const matchesGehege =
        selectedGehege === "Alle" ||
        tier.gehege?.name === selectedGehege;

      const matchesLevel =
        selectedLevel === "Alle" ||
        String(tier.stalllevel) === selectedLevel;

      return matchesSearch && matchesGehege && matchesLevel;
    });
  },

  /**
   * Berechnet den Ausschnitt für die aktuelle Seite
   */
  paginate(items, page, itemsPerPage) {
    const start = (page - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  },

  /**
   * Sortiert die Tiere
   */
  sortAnimals(items, { sortBy, sortDirection }) {
    if (!sortBy) return items;

    return [...items].sort((a, b) => {
      let valA = this._getNestedValue(a, sortBy);
      let valB = this._getNestedValue(b, sortBy);

      if (typeof valA === 'string') {
        return sortDirection === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      return sortDirection === 'asc' ? valA - valB : valB - valA;
    });
  },

  _getNestedValue(obj, path) {
    if (path === "xp") {
      return calculateTotalXP(obj);
    }

    if (path === "verkaufswert") {
      return obj.verkaufswert || 0;
    }

    return path.split('.').reduce((acc, part) => acc && acc[part], obj) || 0;
  }
}


export const calculateTotalXP = (tier) => {
  return (tier.xpfuettern || 0) + (tier.xpspielen || 0) + (tier.xpputzen || 0);
};