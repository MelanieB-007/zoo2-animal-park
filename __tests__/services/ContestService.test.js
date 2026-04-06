import {
  createContest,
  getAllContests,
  getContestById,
  saveContestResults,
  getResultsByContestId,
} from "../../services/ContestService";

// Mock prisma
jest.mock("../../src/lib/prisma", () => ({
  prisma: {
    wettbewerbe: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    wettbewerb_ergebnisse: {
      createMany: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

import { prisma } from "../../src/lib/prisma";

beforeEach(() => {
  jest.clearAllMocks();
});

// ---------------------------------------------------------------------------
// createContest
// ---------------------------------------------------------------------------
describe("createContest", () => {
  test("ruft prisma.wettbewerbe.create mit korrekten Daten auf", async () => {
    prisma.wettbewerbe.create.mockResolvedValue({ id: 1, statuen: [] });

    const data = {
      start: "2025-01-01",
      ende: "2025-01-08",
      aktiv: "1",
      statuenIds: [10, 20, 30],
    };
    await createContest(data);

    expect(prisma.wettbewerbe.create).toHaveBeenCalledTimes(1);
    const callArg = prisma.wettbewerbe.create.mock.calls[0][0];
    expect(callArg.data.aktiv).toBe(1);
    expect(callArg.data.statuen.create).toHaveLength(3);
    expect(callArg.data.statuen.create[0]).toEqual({ statueId: 10 });
  });

  test("konvertiert aktiv-Wert zu Integer (Fallback auf 1)", async () => {
    prisma.wettbewerbe.create.mockResolvedValue({ id: 2, statuen: [] });

    await createContest({
      start: "2025-01-01",
      ende: "2025-01-08",
      aktiv: undefined,
      statuenIds: [1, 2, 3],
    });

    const callArg = prisma.wettbewerbe.create.mock.calls[0][0];
    expect(callArg.data.aktiv).toBe(1);
  });

  test("konvertiert start und ende zu Date-Objekten", async () => {
    prisma.wettbewerbe.create.mockResolvedValue({ id: 3, statuen: [] });

    await createContest({
      start: "2025-06-01",
      ende: "2025-06-08",
      aktiv: 1,
      statuenIds: [1, 2, 3],
    });

    const callArg = prisma.wettbewerbe.create.mock.calls[0][0];
    expect(callArg.data.start).toBeInstanceOf(Date);
    expect(callArg.data.ende).toBeInstanceOf(Date);
  });

  test("gibt das erstellte Objekt zurück", async () => {
    const mockContest = { id: 5, statuen: [{ statueId: 1 }] };
    prisma.wettbewerbe.create.mockResolvedValue(mockContest);

    const result = await createContest({
      start: "2025-01-01",
      ende: "2025-01-08",
      aktiv: 1,
      statuenIds: [1, 2, 3],
    });

    expect(result).toEqual(mockContest);
  });
});

// ---------------------------------------------------------------------------
// getAllContests
// ---------------------------------------------------------------------------
describe("getAllContests", () => {
  test("gibt alle Wettbewerbe zurück", async () => {
    const mockContests = [
      {
        id: 1,
        start: new Date("2020-01-01"),
        ende: new Date("2020-01-08"),
        statuen: [],
      },
    ];
    prisma.wettbewerbe.findMany.mockResolvedValue(mockContests);

    const result = await getAllContests();
    expect(result).toHaveLength(1);
  });

  test("sortiert aktive Wettbewerbe zuerst", async () => {
    const now = new Date();
    const pastStart = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);
    const futureEnd = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);
    const pastEnd = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

    const activeContest = { id: 2, start: pastStart, ende: futureEnd, statuen: [] };
    const inactiveContest = { id: 1, start: pastStart, ende: pastEnd, statuen: [] };

    prisma.wettbewerbe.findMany.mockResolvedValue([inactiveContest, activeContest]);

    const result = await getAllContests();
    expect(result[0].id).toBe(2); // aktiver kommt zuerst
  });

  test("sortiert bei gleicher Aktiv-Status nach Startdatum absteigend", async () => {
    const contest1 = {
      id: 1,
      start: new Date("2025-01-01"),
      ende: new Date("2025-01-08"),
      statuen: [],
    };
    const contest2 = {
      id: 2,
      start: new Date("2025-02-01"),
      ende: new Date("2025-02-08"),
      statuen: [],
    };

    prisma.wettbewerbe.findMany.mockResolvedValue([contest1, contest2]);

    const result = await getAllContests();
    expect(result[0].id).toBe(2); // neueres Startdatum zuerst
  });

  test("ruft findMany mit korrekten Includes auf", async () => {
    prisma.wettbewerbe.findMany.mockResolvedValue([]);
    await getAllContests();

    const callArg = prisma.wettbewerbe.findMany.mock.calls[0][0];
    expect(callArg.include.statuen).toBeDefined();
    expect(callArg.include.statuen.include.statue).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// getContestById
// ---------------------------------------------------------------------------
describe("getContestById", () => {
  test("findet Wettbewerb per ID", async () => {
    const mockContest = { id: 1, statuen: [] };
    prisma.wettbewerbe.findUnique.mockResolvedValue(mockContest);

    const result = await getContestById("1");
    expect(result).toEqual(mockContest);
  });

  test("konvertiert ID-String zu Integer", async () => {
    prisma.wettbewerbe.findUnique.mockResolvedValue({ id: 5, statuen: [] });

    await getContestById("5");

    const callArg = prisma.wettbewerbe.findUnique.mock.calls[0][0];
    expect(callArg.where.id).toBe(5);
  });

  test("gibt null zurück wenn Wettbewerb nicht gefunden", async () => {
    prisma.wettbewerbe.findUnique.mockResolvedValue(null);

    const result = await getContestById("999");
    expect(result).toBeNull();
  });

  test("wirft Fehler wenn Prisma fehlschlägt", async () => {
    prisma.wettbewerbe.findUnique.mockRejectedValue(new Error("DB Error"));

    await expect(getContestById("1")).rejects.toThrow("DB Error");
  });
});

// ---------------------------------------------------------------------------
// saveContestResults
// ---------------------------------------------------------------------------
describe("saveContestResults", () => {
  test("erstellt Einträge für gültige Daten", async () => {
    prisma.wettbewerb_ergebnisse.createMany.mockResolvedValue({ count: 2 });

    const data = {
      10: [
        { level: "5", count: "3" },
        { level: "8", count: "2" },
      ],
    };

    await saveContestResults("1", "42", data);

    expect(prisma.wettbewerb_ergebnisse.createMany).toHaveBeenCalledTimes(1);
    const callArg = prisma.wettbewerb_ergebnisse.createMany.mock.calls[0][0];
    expect(callArg.data).toHaveLength(2);
    expect(callArg.data[0]).toMatchObject({
      contest_id: 1,
      member_id: 42,
      tier_id: 10,
      level: 5,
      anzahl: 3,
    });
  });

  test("wirft Fehler wenn keine gültigen Daten vorhanden sind", async () => {
    // Alle Zeilen ohne level und count
    const data = {
      10: [{ level: null, count: null }],
    };

    await expect(saveContestResults("1", "42", data)).rejects.toThrow(
      "No valid data to save"
    );
  });

  test("überspringt Zeilen ohne level und count", async () => {
    prisma.wettbewerb_ergebnisse.createMany.mockResolvedValue({ count: 1 });

    const data = {
      10: [
        { level: "5", count: "3" }, // gültig
        { level: null, count: null }, // wird übersprungen
      ],
    };

    await saveContestResults("1", "42", data);

    const callArg = prisma.wettbewerb_ergebnisse.createMany.mock.calls[0][0];
    expect(callArg.data).toHaveLength(1);
  });

  test("verarbeitet mehrere Tiere gleichzeitig", async () => {
    prisma.wettbewerb_ergebnisse.createMany.mockResolvedValue({ count: 2 });

    const data = {
      10: [{ level: "5", count: "3" }],
      20: [{ level: "8", count: "1" }],
    };

    await saveContestResults("1", "42", data);

    const callArg = prisma.wettbewerb_ergebnisse.createMany.mock.calls[0][0];
    expect(callArg.data).toHaveLength(2);
    const tierIds = callArg.data.map((d) => d.tier_id);
    expect(tierIds).toContain(10);
    expect(tierIds).toContain(20);
  });
});

// ---------------------------------------------------------------------------
// getResultsByContestId
// ---------------------------------------------------------------------------
describe("getResultsByContestId", () => {
  test("gibt Ergebnisse für den Wettbewerb zurück", async () => {
    const mockResults = [
      { id: 1, contest_id: 5, member_id: 1, tier_id: 10, level: 5, anzahl: 3 },
    ];
    prisma.wettbewerb_ergebnisse.findMany.mockResolvedValue(mockResults);

    const result = await getResultsByContestId("5");
    expect(result).toEqual(mockResults);
  });

  test("filtert nach contest_id als Integer", async () => {
    prisma.wettbewerb_ergebnisse.findMany.mockResolvedValue([]);

    await getResultsByContestId("7");

    const callArg = prisma.wettbewerb_ergebnisse.findMany.mock.calls[0][0];
    expect(callArg.where.contest_id).toBe(7);
  });

  test("inkludiert Mitglied-Daten", async () => {
    prisma.wettbewerb_ergebnisse.findMany.mockResolvedValue([]);

    await getResultsByContestId("1");

    const callArg = prisma.wettbewerb_ergebnisse.findMany.mock.calls[0][0];
    expect(callArg.include.mitglied).toBeDefined();
  });
});
