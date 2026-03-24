export function filterStatues(statues, { searchTerm, selectedGehege }) {
  return statues.filter((statue) => {
    const tier = statue.tier;
    const tierName = tier?.texte?.[0]?.name?.toLowerCase() || "";

    const matchesSearch = tierName.includes(searchTerm.toLowerCase());
    const matchesGehege = selectedGehege === "Alle" || tier?.gehege?.name === selectedGehege;

    return matchesSearch && matchesGehege;
  });
}

export function sortStatues(statues, { sortBy, sortDirection }) {
  return [...statues].sort((a, b) => {
    let valA, valB;

    if (sortBy === "tier.name") {
      valA = a.tier?.texte?.[0]?.name || "";
      valB = b.tier?.texte?.[0]?.name || "";
    } else if (sortBy === "stalllevel") {
      valA = a.tier?.stalllevel || 0;
      valB = b.tier?.stalllevel || 0;
    } else {
      valA = a[sortBy] || "";
      valB = b[sortBy] || "";
    }

    if (valA < valB) return sortDirection === "asc" ? -1 : 1;
    if (valA > valB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });
}

// Den paginate-Helper kannst du wahrscheinlich 1:1 von den Tieren übernehmen
export function paginate(items, page, perPage) {
  const from = (page - 1) * perPage;
  const to = from + perPage;
  return items.slice(from, to);
}