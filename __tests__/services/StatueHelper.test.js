/**
 * Unit-Tests für StatueHelper (reine Funktionen, keine Mocks nötig)
 *
 * Abgedeckte Funktionen:
 *  - filterStatues  (Suche, Gehege, Level, Kombination)
 *  - sortStatues    (tier.name, tier.gehege.name, tier.stalllevel, Fallback, Richtung)
 *  - paginate       (Seite 1, Seite 2, Randfall)
 */

import {
  filterStatues,
  sortStatues,
  paginate,
} from "../../services/StatueHelper";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const statues = [
  {
    id: 1,
    name: "Löwen-Statue",
    tier: { id: 10, stalllevel: 2, gehege: { name: "Hauptzoo" }, texte: [{ spracheCode: "de", name: "Löwe" }] },
  },
  {
    id: 2,
    name: "Pinguin-Statue",
    tier: { id: 11, stalllevel: 1, gehege: { name: "Polarium" }, texte: [{ spracheCode: "de", name: "Pinguin" }] },
  },
  {
    id: 3,
    name: "Elefant-Statue",
    tier: { id: 12, stalllevel: 3, gehege: { name: "Hauptzoo" }, texte: [{ spracheCode: "de", name: "Elefant" }] },
  },
];

// ─── filterStatues ────────────────────────────────────────────────────────────

describe("filterStatues", () => {
  it("gibt alle Statuen zurück wenn keine Filter aktiv sind", () => {
    expect(
      filterStatues(statues, { searchTerm: "", selectedGehege: "Alle", selectedLevel: "Alle" })
    ).toHaveLength(3);
  });

  it("filtert nach Tiername (case-insensitive)", () => {
    const result = filterStatues(statues, {
      searchTerm: "pingu",
      selectedGehege: "Alle",
      selectedLevel: "Alle",
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(2);
  });

  it("filtert nach Gehege", () => {
    const result = filterStatues(statues, {
      searchTerm: "",
      selectedGehege: "Hauptzoo",
      selectedLevel: "Alle",
    });
    expect(result).toHaveLength(2);
    expect(result.map((s) => s.id)).toEqual(expect.arrayContaining([1, 3]));
  });

  it("filtert nach Stall-Level", () => {
    const result = filterStatues(statues, {
      searchTerm: "",
      selectedGehege: "Alle",
      selectedLevel: "1",
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(2);
  });

  it("kombiniert Suche und Gehege-Filter", () => {
    const result = filterStatues(statues, {
      searchTerm: "elef",
      selectedGehege: "Hauptzoo",
      selectedLevel: "Alle",
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(3);
  });

  it("gibt leeres Array zurück wenn nichts passt", () => {
    expect(
      filterStatues(statues, { searchTerm: "xyz", selectedGehege: "Alle", selectedLevel: "Alle" })
    ).toHaveLength(0);
  });
});

// ─── sortStatues ──────────────────────────────────────────────────────────────

describe("sortStatues", () => {
  it("sortiert nach Tiername (tier.name) aufsteigend", () => {
    const result = sortStatues(statues, { sortBy: "tier.name", sortDirection: "asc" });
    expect(result[0].tier.texte[0].name).toBe("Elefant");
    expect(result[1].tier.texte[0].name).toBe("Löwe");
    expect(result[2].tier.texte[0].name).toBe("Pinguin");
  });

  it("sortiert nach Tiername (tier.name) absteigend", () => {
    const result = sortStatues(statues, { sortBy: "tier.name", sortDirection: "desc" });
    expect(result[0].tier.texte[0].name).toBe("Pinguin");
    expect(result[2].tier.texte[0].name).toBe("Elefant");
  });

  it("sortiert nach Gehege-Name (tier.gehege.name) aufsteigend", () => {
    const result = sortStatues(statues, { sortBy: "tier.gehege.name", sortDirection: "asc" });
    expect(result[0].tier.gehege.name).toBe("Hauptzoo");
    expect(result[result.length - 1].tier.gehege.name).toBe("Polarium");
  });

  it("sortiert nach Stall-Level (tier.stalllevel) aufsteigend", () => {
    const result = sortStatues(statues, { sortBy: "tier.stalllevel", sortDirection: "asc" });
    expect(result[0].tier.stalllevel).toBe(1);
    expect(result[2].tier.stalllevel).toBe(3);
  });

  it("sortiert nach Stall-Level (tier.stalllevel) absteigend", () => {
    const result = sortStatues(statues, { sortBy: "tier.stalllevel", sortDirection: "desc" });
    expect(result[0].tier.stalllevel).toBe(3);
    expect(result[2].tier.stalllevel).toBe(1);
  });

  it("sortiert nach direktem Attribut als Fallback (z.B. statue.name)", () => {
    const result = sortStatues(statues, { sortBy: "name", sortDirection: "asc" });
    expect(result[0].name).toBe("Elefant-Statue");
    expect(result[2].name).toBe("Pinguin-Statue");
  });

  it("mutiert das Original-Array nicht", () => {
    const original = [...statues];
    sortStatues(statues, { sortBy: "tier.name", sortDirection: "asc" });
    expect(statues[0].id).toBe(original[0].id);
  });
});

// ─── paginate ─────────────────────────────────────────────────────────────────

describe("paginate", () => {
  const items = ["a", "b", "c", "d", "e"];

  it("gibt die erste Seite zurück", () => {
    expect(paginate(items, 1, 2)).toEqual(["a", "b"]);
  });

  it("gibt die zweite Seite zurück", () => {
    expect(paginate(items, 2, 2)).toEqual(["c", "d"]);
  });

  it("gibt die letzte (unvollständige) Seite zurück", () => {
    expect(paginate(items, 3, 2)).toEqual(["e"]);
  });

  it("gibt leeres Array zurück wenn Seite außerhalb des Bereichs liegt", () => {
    expect(paginate(items, 10, 2)).toEqual([]);
  });
});
