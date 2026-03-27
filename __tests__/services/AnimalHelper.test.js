/**
 * Unit-Tests für AnimalHelper (reine Funktionen, keine Mocks nötig)
 *
 * Abgedeckte Funktionen:
 *  - filterAnimals  (Suche, Gehege, Level, Kombination, Nullsicherheit)
 *  - sortAnimals    (String asc/desc, Zahl asc/desc, fehlender sortBy)
 *  - paginate       (Seite 1, Seite 2, letzte unvollständige Seite)
 *  - calculateTotalXP (Summe, leere XP, kein XP, ungültige Werte)
 */

import {
  filterAnimals,
  sortAnimals,
  paginate,
  calculateTotalXP,
} from "../../services/AnimalHelper";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const animals = [
  {
    id: 1,
    name: "Löwe",
    nameEn: "Lion",
    stalllevel: 2,
    gehege: { name: "Hauptzoo" },
    texte: [{ spracheCode: "de", name: "Löwe" }],
    xp: [{ wert: 100 }, { wert: 200 }],
    verkaufswert: 500,
  },
  {
    id: 2,
    name: "Pinguin",
    nameEn: "Penguin",
    stalllevel: 1,
    gehege: { name: "Polarium" },
    texte: [{ spracheCode: "de", name: "Pinguin" }],
    xp: [{ wert: 50 }],
    verkaufswert: 300,
  },
  {
    id: 3,
    name: "Elefant",
    nameEn: "Elephant",
    stalllevel: 3,
    gehege: { name: "Hauptzoo" },
    texte: [{ spracheCode: "de", name: "Elefant" }],
    xp: [],
    verkaufswert: 800,
  },
];

// ─── filterAnimals ─────────────────────────────────────────────────────────────

describe("filterAnimals", () => {
  it("gibt alle Tiere zurück wenn keine Filter aktiv sind", () => {
    expect(
      filterAnimals(animals, { searchTerm: "", selectedGehege: "Alle", selectedLevel: "Alle" })
    ).toHaveLength(3);
  });

  it("filtert nach Tiername im texte-Array (case-insensitive)", () => {
    const result = filterAnimals(animals, {
      searchTerm: "pingu",
      selectedGehege: "Alle",
      selectedLevel: "Alle",
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(2);
  });

  it("filtert nach Fallback-Feld 'name' wenn texte leer ist", () => {
    const animalsWithFallback = [
      { id: 10, name: "Tiger", nameEn: null, stalllevel: 1, gehege: { name: "X" }, texte: [] },
    ];
    const result = filterAnimals(animalsWithFallback, {
      searchTerm: "tiger",
      selectedGehege: "Alle",
      selectedLevel: "Alle",
    });
    expect(result).toHaveLength(1);
  });

  it("filtert nach Gehege", () => {
    const result = filterAnimals(animals, {
      searchTerm: "",
      selectedGehege: "Hauptzoo",
      selectedLevel: "Alle",
    });
    expect(result).toHaveLength(2);
    expect(result.map((a) => a.id)).toEqual(expect.arrayContaining([1, 3]));
  });

  it("filtert nach Stall-Level", () => {
    const result = filterAnimals(animals, {
      searchTerm: "",
      selectedGehege: "Alle",
      selectedLevel: "1",
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(2);
  });

  it("kombiniert Suche und Gehege", () => {
    const result = filterAnimals(animals, {
      searchTerm: "elef",
      selectedGehege: "Hauptzoo",
      selectedLevel: "Alle",
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(3);
  });

  it("gibt leeres Array zurück wenn nichts passt", () => {
    expect(
      filterAnimals(animals, { searchTerm: "xyz", selectedGehege: "Alle", selectedLevel: "Alle" })
    ).toHaveLength(0);
  });

  it("gibt leeres Array zurück wenn animals null ist", () => {
    expect(
      filterAnimals(null, { searchTerm: "", selectedGehege: "Alle", selectedLevel: "Alle" })
    ).toEqual([]);
  });
});

// ─── sortAnimals ──────────────────────────────────────────────────────────────

describe("sortAnimals", () => {
  it("sortiert nach Tiername aufsteigend (texte[0].name via sortBy='texte.0.name')", () => {
    // sortAnimals nutzt _getNestedValue mit path.split(".")
    // Für texte[0].name würde path="texte.0.name" → aber in der App sortBy="name"
    // Teste mit dem tatsächlichen root-Feld "name"
    const result = sortAnimals(animals, { sortBy: "name", sortDirection: "asc" });
    expect(result[0].name).toBe("Elefant");
    expect(result[1].name).toBe("Löwe");
    expect(result[2].name).toBe("Pinguin");
  });

  it("sortiert nach Tiername absteigend", () => {
    const result = sortAnimals(animals, { sortBy: "name", sortDirection: "desc" });
    expect(result[0].name).toBe("Pinguin");
    expect(result[2].name).toBe("Elefant");
  });

  it("sortiert nach stalllevel aufsteigend", () => {
    const result = sortAnimals(animals, { sortBy: "stalllevel", sortDirection: "asc" });
    expect(result[0].stalllevel).toBe(1);
    expect(result[1].stalllevel).toBe(2);
    expect(result[2].stalllevel).toBe(3);
  });

  it("sortiert nach stalllevel absteigend", () => {
    const result = sortAnimals(animals, { sortBy: "stalllevel", sortDirection: "desc" });
    expect(result[0].stalllevel).toBe(3);
    expect(result[2].stalllevel).toBe(1);
  });

  it("sortiert nach verschachteltem Pfad (gehege.name)", () => {
    const result = sortAnimals(animals, { sortBy: "gehege.name", sortDirection: "asc" });
    // Hauptzoo < Polarium
    expect(result[0].gehege.name).toBe("Hauptzoo");
    expect(result[result.length - 1].gehege.name).toBe("Polarium");
  });

  it("sortiert nach verkaufswert aufsteigend", () => {
    const result = sortAnimals(animals, { sortBy: "verkaufswert", sortDirection: "asc" });
    expect(result[0].verkaufswert).toBe(300);
    expect(result[2].verkaufswert).toBe(800);
  });

  it("gibt das Original-Array zurück wenn kein sortBy angegeben", () => {
    const result = sortAnimals(animals, { sortBy: null, sortDirection: "asc" });
    expect(result).toBe(animals); // Referenz-Gleichheit
  });

  it("mutiert das Original-Array nicht", () => {
    const copy = [...animals];
    sortAnimals(animals, { sortBy: "name", sortDirection: "asc" });
    expect(animals[0].id).toBe(copy[0].id);
  });
});

// ─── paginate ─────────────────────────────────────────────────────────────────

describe("paginate", () => {
  const items = [1, 2, 3, 4, 5];

  it("gibt die erste Seite zurück", () => {
    expect(paginate(items, 1, 2)).toEqual([1, 2]);
  });

  it("gibt die zweite Seite zurück", () => {
    expect(paginate(items, 2, 2)).toEqual([3, 4]);
  });

  it("gibt die letzte (unvollständige) Seite zurück", () => {
    expect(paginate(items, 3, 2)).toEqual([5]);
  });

  it("gibt leeres Array zurück wenn Seite außerhalb des Bereichs liegt", () => {
    expect(paginate(items, 10, 2)).toEqual([]);
  });

  it("gibt alle Items zurück wenn itemsPerPage größer als Gesamtlänge", () => {
    expect(paginate(items, 1, 100)).toEqual([1, 2, 3, 4, 5]);
  });
});

// ─── calculateTotalXP ────────────────────────────────────────────────────────

describe("calculateTotalXP", () => {
  it("summiert alle XP-Werte korrekt", () => {
    expect(calculateTotalXP(animals[0])).toBe(300); // 100 + 200
  });

  it("gibt 0 zurück bei leerem xp-Array", () => {
    expect(calculateTotalXP(animals[2])).toBe(0);
  });

  it("gibt 0 zurück wenn kein xp-Feld vorhanden ist", () => {
    expect(calculateTotalXP({ id: 99 })).toBe(0);
  });

  it("gibt 0 zurück wenn animal null ist", () => {
    expect(calculateTotalXP(null)).toBe(0);
  });

  it("ignoriert nicht-numerische Werte (NaN wird als 0 gewertet)", () => {
    const animal = { xp: [{ wert: "ungültig" }, { wert: 100 }] };
    expect(calculateTotalXP(animal)).toBe(100);
  });
});