export function filterAnimals(
  animals,
  { searchTerm, selectedGehege, selectedLevel }
) {
  if (!animals) return [];

  const searchLower = searchTerm.toLowerCase();

  return animals.filter((tier) => {
    // 1. Suche in den neuen übersetzten Texten (Array)
    const matchesSearch = !searchTerm || (
      tier.texte?.some(t =>
        t.name?.toLowerCase().includes(searchLower)
      ) ||
      // Sicherheits-Fallback, falls noch alte Datenreste vorhanden sind
      tier.name?.toLowerCase().includes(searchLower) ||
      tier.nameEn?.toLowerCase().includes(searchLower)
    );

    // 2. Filter nach Gehege
    const matchesGehege =
      selectedGehege === "Alle" || tier.gehege?.name === selectedGehege;

    // 3. Filter nach Level
    const matchesLevel =
      selectedLevel === "Alle" || String(tier.stalllevel) === selectedLevel;

    return matchesSearch && matchesGehege && matchesLevel;
  });
}

export function paginate(items, page, itemsPerPage) {
  const start = (page - 1) * itemsPerPage;
  return items.slice(start, start + itemsPerPage);
}

export function sortAnimals(items, { sortBy, sortDirection }) {
  if (!sortBy) return items;

  return [...items].sort((a, b) => {
    let valA = _getNestedValue(a, sortBy);
    let valB = _getNestedValue(b, sortBy);

    if (typeof valA === "string") {
      return sortDirection === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }

    return sortDirection === "asc" ? valA - valB : valB - valA;
  });
}

function _getNestedValue(obj, path) {
  if (path === "xp") {
    return calculateTotalXP(obj);
  }

  if (path === "verkaufswert") {
    return obj.verkaufswert || 0;
  }

  return path.split(".").reduce((acc, part) => acc && acc[part], obj) || 0;
}

export function calculateTotalXP (animal) {
  if (!animal?.xp || !Array.isArray(animal.xp)) {
    return 0;
  }

  const total = animal.xp.reduce(function (acc, eintrag) {
    const punkte = Number(eintrag.wert) || 0;
    return acc + punkte;
  }, 0);

  return total;
}