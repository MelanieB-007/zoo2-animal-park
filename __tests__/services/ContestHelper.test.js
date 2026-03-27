/**
 * Unit-Tests für ContestHelper (reine Funktionen, keine Mocks nötig)
 *
 * Abgedeckte Funktion:
 *  - calculateTierStats (Filterung, Gruppierung, Sortierung, Multiplikatoren)
 */

import { calculateTierStats } from "../../services/ContestHelper";

// ─── calculateTierStats ───────────────────────────────────────────────────────

describe("calculateTierStats", () => {
  it("gibt Leer-Ergebnis zurück wenn results null ist", () => {
    const result = calculateTierStats(1, null);
    expect(result).toEqual({ rankedMembers: [], totalWeighted: 0 });
  });

  it("gibt Leer-Ergebnis zurück wenn keine Einträge für dieses Tier vorhanden sind", () => {
    const result = calculateTierStats(99, [
      { tier_id: 1, member_id: 1, level: 5, anzahl: 2, mitglied: { name: "Alice" } },
    ]);
    expect(result).toEqual({ rankedMembers: [], totalWeighted: 0 });
  });

  it("berechnet rawSum eines einzelnen Mitglieds korrekt (level × anzahl)", () => {
    const results = [
      { tier_id: 10, member_id: 1, level: 5, anzahl: 3, mitglied: { upjersname: "Alice", name: "AliceReal" } },
    ];
    const { rankedMembers } = calculateTierStats(10, results);
    expect(rankedMembers[0].rawSum).toBe(15); // 5 × 3
  });

  it("summiert mehrere Einträge desselben Mitglieds", () => {
    const results = [
      { tier_id: 10, member_id: 1, level: 5, anzahl: 3, mitglied: { upjersname: "Alice" } },
      { tier_id: 10, member_id: 1, level: 2, anzahl: 4, mitglied: { upjersname: "Alice" } },
    ];
    const { rankedMembers } = calculateTierStats(10, results);
    expect(rankedMembers).toHaveLength(1);
    expect(rankedMembers[0].rawSum).toBe(23); // 15 + 8
  });

  it("sortiert Mitglieder absteigend nach rawSum", () => {
    const results = [
      { tier_id: 10, member_id: 1, level: 1, anzahl: 1, mitglied: { upjersname: "Alice" } }, // rawSum 1
      { tier_id: 10, member_id: 2, level: 5, anzahl: 4, mitglied: { upjersname: "Bob" } },   // rawSum 20
      { tier_id: 10, member_id: 3, level: 3, anzahl: 2, mitglied: { upjersname: "Cara" } },  // rawSum 6
    ];
    const { rankedMembers } = calculateTierStats(10, results);
    expect(rankedMembers[0].name).toBe("Bob");   // Platz 1
    expect(rankedMembers[1].name).toBe("Cara");  // Platz 2
    expect(rankedMembers[2].name).toBe("Alice"); // Platz 3
  });

  it("wendet Multiplikatoren korrekt an — Formel: Math.max(1, 4 - index)", () => {
    // index 0 → Math.max(1, 4) = 4
    // index 1 → Math.max(1, 3) = 3
    // index 2 → Math.max(1, 2) = 2
    // index 3 → Math.max(1, 1) = 1
    const results = [
      { tier_id: 10, member_id: 1, level: 10, anzahl: 1, mitglied: { upjersname: "A" } }, // rawSum 10
      { tier_id: 10, member_id: 2, level: 8,  anzahl: 1, mitglied: { upjersname: "B" } }, // rawSum 8
      { tier_id: 10, member_id: 3, level: 6,  anzahl: 1, mitglied: { upjersname: "C" } }, // rawSum 6
      { tier_id: 10, member_id: 4, level: 4,  anzahl: 1, mitglied: { upjersname: "D" } }, // rawSum 4
    ];
    const { rankedMembers } = calculateTierStats(10, results);
    expect(rankedMembers[0]).toMatchObject({ multiplier: 4, weighted: 40 }); // 10 × 4
    expect(rankedMembers[1]).toMatchObject({ multiplier: 3, weighted: 24 }); // 8  × 3
    expect(rankedMembers[2]).toMatchObject({ multiplier: 2, weighted: 12 }); // 6  × 2
    expect(rankedMembers[3]).toMatchObject({ multiplier: 1, weighted: 4  }); // 4  × 1
  });

  it("berechnet totalWeighted als Summe aller gewichteten Punkte", () => {
    const results = [
      { tier_id: 10, member_id: 1, level: 10, anzahl: 1, mitglied: { upjersname: "A" } }, // 10 × 4 = 40
      { tier_id: 10, member_id: 2, level: 8,  anzahl: 1, mitglied: { upjersname: "B" } }, // 8  × 3 = 24
      { tier_id: 10, member_id: 3, level: 6,  anzahl: 1, mitglied: { upjersname: "C" } }, // 6  × 2 = 12
    ];
    const { totalWeighted } = calculateTierStats(10, results);
    expect(totalWeighted).toBe(76); // 40 + 24 + 12
  });

  it("verwendet upjersname als Namen wenn vorhanden", () => {
    const results = [
      { tier_id: 10, member_id: 1, level: 1, anzahl: 1, mitglied: { upjersname: "Alice", name: "AliceReal" } },
    ];
    const { rankedMembers } = calculateTierStats(10, results);
    expect(rankedMembers[0].name).toBe("Alice");
  });

  it("verwendet name als Fallback wenn upjersname nicht gesetzt ist", () => {
    const results = [
      { tier_id: 10, member_id: 1, level: 1, anzahl: 1, mitglied: { upjersname: null, name: "Bob" } },
    ];
    const { rankedMembers } = calculateTierStats(10, results);
    expect(rankedMembers[0].name).toBe("Bob");
  });

  it("verwendet 'Mitglied #ID' als Fallback wenn mitglied kein Name hat", () => {
    const results = [
      { tier_id: 10, member_id: 42, level: 1, anzahl: 1, mitglied: { upjersname: null, name: null } },
    ];
    const { rankedMembers } = calculateTierStats(10, results);
    expect(rankedMembers[0].name).toBe("Mitglied #42");
  });

  it("ignoriert Einträge anderer Tiere", () => {
    const results = [
      { tier_id: 10, member_id: 1, level: 5, anzahl: 1, mitglied: { upjersname: "A" } },
      { tier_id: 99, member_id: 2, level: 5, anzahl: 1, mitglied: { upjersname: "B" } },
    ];
    const { rankedMembers } = calculateTierStats(10, results);
    expect(rankedMembers).toHaveLength(1);
    expect(rankedMembers[0].name).toBe("A");
  });
});
