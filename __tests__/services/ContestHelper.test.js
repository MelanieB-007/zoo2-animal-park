import { calculateTierStats } from "../../services/ContestHelper";

describe("calculateTierStats", () => {
  describe("Randfälle", () => {
    test("gibt leere Ergebnisse zurück wenn results null ist", () => {
      const result = calculateTierStats(1, null);
      expect(result).toEqual({ rankedMembers: [], totalWeighted: 0 });
    });

    test("gibt leere Ergebnisse zurück wenn keine Ergebnisse für das Tier vorhanden sind", () => {
      const result = calculateTierStats(1, []);
      expect(result).toEqual({ rankedMembers: [], totalWeighted: 0 });
    });

    test("filtert Einträge für andere Tier-IDs heraus", () => {
      const results = [
        {
          tier_id: 2,
          member_id: 1,
          level: 100,
          anzahl: 10,
          mitglied: { upjersname: "Alice" },
        },
      ];
      const result = calculateTierStats(1, results);
      expect(result.rankedMembers).toHaveLength(0);
      expect(result.totalWeighted).toBe(0);
    });
  });

  describe("Punktberechnung für ein einzelnes Mitglied", () => {
    test("berechnet rawSum korrekt (level * anzahl)", () => {
      const results = [
        {
          tier_id: 1,
          member_id: 1,
          level: 10,
          anzahl: 5,
          mitglied: { upjersname: "Alice" },
        },
      ];
      const result = calculateTierStats(1, results);
      // rawSum = 10 * 5 = 50
      expect(result.rankedMembers[0].rawSum).toBe(50);
    });

    test("Platz 1 erhält den Multiplikator 4", () => {
      const results = [
        {
          tier_id: 1,
          member_id: 1,
          level: 10,
          anzahl: 5,
          mitglied: { upjersname: "Alice" },
        },
      ];
      const result = calculateTierStats(1, results);
      expect(result.rankedMembers[0].multiplier).toBe(4);
    });

    test("gewichtete Punkte = rawSum * multiplier", () => {
      const results = [
        {
          tier_id: 1,
          member_id: 1,
          level: 10,
          anzahl: 5,
          mitglied: { upjersname: "Alice" },
        },
      ];
      const result = calculateTierStats(1, results);
      // 50 * 4 = 200
      expect(result.rankedMembers[0].weighted).toBe(200);
      expect(result.totalWeighted).toBe(200);
    });
  });

  describe("Multiplikatorregeln (Platzierungen)", () => {
    const results = [
      {
        tier_id: 1,
        member_id: 1,
        level: 100,
        anzahl: 1,
        mitglied: { upjersname: "A" },
      },
      {
        tier_id: 1,
        member_id: 2,
        level: 50,
        anzahl: 1,
        mitglied: { upjersname: "B" },
      },
      {
        tier_id: 1,
        member_id: 3,
        level: 30,
        anzahl: 1,
        mitglied: { upjersname: "C" },
      },
      {
        tier_id: 1,
        member_id: 4,
        level: 10,
        anzahl: 1,
        mitglied: { upjersname: "D" },
      },
    ];

    test("Platz 1 = Multiplikator 4", () => {
      const result = calculateTierStats(1, results);
      expect(result.rankedMembers[0].multiplier).toBe(4);
    });

    test("Platz 2 = Multiplikator 3", () => {
      const result = calculateTierStats(1, results);
      expect(result.rankedMembers[1].multiplier).toBe(3);
    });

    test("Platz 3 = Multiplikator 2", () => {
      const result = calculateTierStats(1, results);
      expect(result.rankedMembers[2].multiplier).toBe(2);
    });

    test("Platz 4+ = Multiplikator 1 (Minimum)", () => {
      const result = calculateTierStats(1, results);
      expect(result.rankedMembers[3].multiplier).toBe(1);
    });

    test("totalWeighted ist die Summe aller gewichteten Punkte", () => {
      const result = calculateTierStats(1, results);
      // 100*4 + 50*3 + 30*2 + 10*1 = 400 + 150 + 60 + 10 = 620
      expect(result.totalWeighted).toBe(620);
    });

    test("rankedMembers sind absteigend nach rawSum sortiert", () => {
      const result = calculateTierStats(1, results);
      const rawSums = result.rankedMembers.map((m) => m.rawSum);
      expect(rawSums).toEqual([100, 50, 30, 10]);
    });
  });

  describe("Namens-Fallback-Logik", () => {
    test("bevorzugt upjersname gegenüber name", () => {
      const results = [
        {
          tier_id: 1,
          member_id: 1,
          level: 1,
          anzahl: 1,
          mitglied: { upjersname: "Gamer123", name: "Max Mustermann" },
        },
      ];
      const result = calculateTierStats(1, results);
      expect(result.rankedMembers[0].name).toBe("Gamer123");
    });

    test("nutzt name als Fallback wenn upjersname fehlt", () => {
      const results = [
        {
          tier_id: 1,
          member_id: 1,
          level: 1,
          anzahl: 1,
          mitglied: { upjersname: null, name: "Max" },
        },
      ];
      const result = calculateTierStats(1, results);
      expect(result.rankedMembers[0].name).toBe("Max");
    });

    test("nutzt 'Mitglied #id' wenn beide Namen fehlen", () => {
      const results = [
        {
          tier_id: 1,
          member_id: 42,
          level: 1,
          anzahl: 1,
          mitglied: { upjersname: null, name: null },
        },
      ];
      const result = calculateTierStats(1, results);
      expect(result.rankedMembers[0].name).toBe("Mitglied #42");
    });
  });

  describe("Mehrere Zeilen pro Mitglied", () => {
    test("summiert rawSum über mehrere Einträge desselben Mitglieds", () => {
      const results = [
        {
          tier_id: 1,
          member_id: 1,
          level: 10,
          anzahl: 2,
          mitglied: { upjersname: "Alice" },
        }, // 20
        {
          tier_id: 1,
          member_id: 1,
          level: 5,
          anzahl: 4,
          mitglied: { upjersname: "Alice" },
        }, // 20
      ];
      const result = calculateTierStats(1, results);
      expect(result.rankedMembers).toHaveLength(1);
      expect(result.rankedMembers[0].rawSum).toBe(40);
    });
  });
});
