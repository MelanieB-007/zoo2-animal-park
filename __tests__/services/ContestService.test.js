/**
 * Unit-Tests für ContestService
 *
 * Abgedeckt:
 *  1. createContest    – Transaktion, Wettbewerb + Statuen-Links anlegen
 *  2. getAllContests    – Sortierung (aktiv zuerst, dann neuestes Startdatum)
 *  3. getContestById   – gefunden / null / Fehler weiterwerfen
 *  4. saveContestResults – Filterung, "No valid data"-Fehler, createMany-Aufruf
 *  5. getResultsByContestId – Weiterleitung an Prisma
 */

// ─── Mocks ───────────────────────────────────────────────────────────────────

jest.mock("@/lib/prisma", () => ({
  prisma: {
    $transaction:          jest.fn(),
    wettbewerbe:           { findMany: jest.fn(), findUnique: jest.fn() },
    wettbewerb_ergebnisse: { createMany: jest.fn(), findMany: jest.fn() },
  },
}));

import { prisma } from "@/lib/prisma";
import {
  createContest,
  getAllContests,
  getContestById,
  saveContestResults,
  getResultsByContestId,
} from "../../services/ContestService";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeTx() {
  return {
    wettbewerbe:     { create:     jest.fn() },
    contest_statuen: { createMany: jest.fn() },
  };
}

beforeEach(() => {
  jest.clearAllMocks();
  // Standard-Implementierung: $transaction führt Callback mit frischem tx aus
  prisma.$transaction.mockImplementation((fn) => {
    const tx = makeTx();
    prisma.$transaction._lastTx = tx;
    return fn(tx);
  });
});

// ─── 1. createContest ─────────────────────────────────────────────────────────

describe("1. createContest", () => {
  it("legt einen neuen Wettbewerb in der Transaktion an", async () => {
    prisma.$transaction.mockImplementationOnce(async (fn) => {
      const tx = makeTx();
      tx.wettbewerbe.create.mockResolvedValueOnce({ id: 10 });
      tx.contest_statuen.createMany.mockResolvedValueOnce({});
      return fn(tx);
    });

    await createContest({ start: "2026-01-01", ende: "2026-12-31", aktiv: 1, statuenIds: [1, 2] });

    expect(prisma.$transaction).toHaveBeenCalled();
  });

  it("erstellt contest_statuen-Links für jede statuenId", async () => {
    let capturedTx;
    prisma.$transaction.mockImplementationOnce(async (fn) => {
      const tx = makeTx();
      tx.wettbewerbe.create.mockResolvedValueOnce({ id: 10 });
      tx.contest_statuen.createMany.mockResolvedValueOnce({});
      capturedTx = tx;
      return fn(tx);
    });

    await createContest({ start: "2026-01-01", ende: "2026-12-31", aktiv: 1, statuenIds: [3, 7] });

    expect(capturedTx.contest_statuen.createMany).toHaveBeenCalledWith({
      data: [
        { wettbewerbId: 10, statueId: 3 },
        { wettbewerbId: 10, statueId: 7 },
      ],
    });
  });

  it("gibt den neuen Wettbewerb zurück", async () => {
    const newContest = { id: 10, start: new Date("2026-01-01") };
    prisma.$transaction.mockImplementationOnce(async (fn) => {
      const tx = makeTx();
      tx.wettbewerbe.create.mockResolvedValueOnce(newContest);
      tx.contest_statuen.createMany.mockResolvedValueOnce({});
      return fn(tx);
    });

    const result = await createContest({
      start: "2026-01-01", ende: "2026-12-31", aktiv: 1, statuenIds: [1],
    });

    expect(result).toEqual(newContest);
  });

  it("konvertiert aktiv korrekt zu Integer", async () => {
    let capturedTx;
    prisma.$transaction.mockImplementationOnce(async (fn) => {
      const tx = makeTx();
      tx.wettbewerbe.create.mockResolvedValueOnce({ id: 1 });
      tx.contest_statuen.createMany.mockResolvedValueOnce({});
      capturedTx = tx;
      return fn(tx);
    });

    await createContest({ start: "2026-01-01", ende: "2026-12-31", aktiv: "1", statuenIds: [] });

    expect(capturedTx.wettbewerbe.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ aktiv: 1 }) })
    );
  });
});

// ─── 2. getAllContests – Sortierung ───────────────────────────────────────────

describe("2. getAllContests – Sortierung", () => {
  it("sortiert aktiven Wettbewerb vor abgelaufenem", async () => {
    // active: heute liegt zwischen start und ende
    const active   = { id: 1, start: "2020-01-01", ende: "2099-12-31", statuen: [] };
    const inactive = { id: 2, start: "2020-01-01", ende: "2020-06-01", statuen: [] };
    prisma.wettbewerbe.findMany.mockResolvedValueOnce([inactive, active]);

    const result = await getAllContests();

    expect(result[0].id).toBe(1);
    expect(result[1].id).toBe(2);
  });

  it("sortiert zwei inaktive Wettbewerbe nach Startdatum (neuestes zuerst)", async () => {
    const older = { id: 1, start: "2020-01-01", ende: "2020-06-01", statuen: [] };
    const newer = { id: 2, start: "2021-01-01", ende: "2021-06-01", statuen: [] };
    prisma.wettbewerbe.findMany.mockResolvedValueOnce([older, newer]);

    const result = await getAllContests();

    expect(result[0].id).toBe(2);
    expect(result[1].id).toBe(1);
  });

  it("gibt leeres Array zurück wenn keine Wettbewerbe vorhanden sind", async () => {
    prisma.wettbewerbe.findMany.mockResolvedValueOnce([]);

    const result = await getAllContests();

    expect(result).toEqual([]);
  });

  it("gibt alle Wettbewerbe zurück (keine werden verworfen)", async () => {
    const contests = [
      { id: 1, start: "2025-01-01", ende: "2025-06-01", statuen: [] },
      { id: 2, start: "2024-01-01", ende: "2024-06-01", statuen: [] },
      { id: 3, start: "2020-01-01", ende: "2099-12-31", statuen: [] },
    ];
    prisma.wettbewerbe.findMany.mockResolvedValueOnce(contests);

    const result = await getAllContests();

    expect(result).toHaveLength(3);
  });
});

// ─── 3. getContestById ────────────────────────────────────────────────────────

describe("3. getContestById", () => {
  it("gibt den Wettbewerb zurück wenn er gefunden wurde", async () => {
    const mockContest = { id: 5, start: "2026-01-01" };
    prisma.wettbewerbe.findUnique.mockResolvedValueOnce(mockContest);

    const result = await getContestById(5);

    expect(prisma.wettbewerbe.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 5 } })
    );
    expect(result).toEqual(mockContest);
  });

  it("gibt null zurück wenn der Wettbewerb nicht existiert", async () => {
    prisma.wettbewerbe.findUnique.mockResolvedValueOnce(null);

    const result = await getContestById(99);

    expect(result).toBeNull();
  });

  it("wirft den Fehler weiter wenn Prisma einen Fehler wirft", async () => {
    prisma.wettbewerbe.findUnique.mockRejectedValueOnce(new Error("DB Error"));

    await expect(getContestById(1)).rejects.toThrow("DB Error");
  });

  it("konvertiert die id zu Integer", async () => {
    prisma.wettbewerbe.findUnique.mockResolvedValueOnce({ id: 5 });

    await getContestById("5");

    expect(prisma.wettbewerbe.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 5 } })
    );
  });
});

// ─── 4. saveContestResults ────────────────────────────────────────────────────

describe("4. saveContestResults", () => {
  it("wirft 'No valid data to save' wenn alle Zeilen leer sind", async () => {
    const data = { "10": [{ level: 0, count: 0 }] };

    await expect(saveContestResults(1, 1, data)).rejects.toThrow("No valid data to save");
    expect(prisma.wettbewerb_ergebnisse.createMany).not.toHaveBeenCalled();
  });

  it("wirft 'No valid data to save' wenn data ein leeres Objekt ist", async () => {
    await expect(saveContestResults(1, 1, {})).rejects.toThrow("No valid data to save");
  });

  it("schließt Zeilen ohne level und count aus", async () => {
    prisma.wettbewerb_ergebnisse.createMany.mockResolvedValueOnce({ count: 1 });
    const data = {
      "10": [
        { level: 5, count: 2 },  // wird gespeichert
        { level: 0, count: 0 },  // wird gefiltert
      ],
    };

    await saveContestResults(1, 1, data);

    expect(prisma.wettbewerb_ergebnisse.createMany).toHaveBeenCalledWith({
      data: [{ contest_id: 1, member_id: 1, tier_id: 10, level: 5, anzahl: 2 }],
    });
  });

  it("speichert Zeilen aus mehreren Tieren", async () => {
    prisma.wettbewerb_ergebnisse.createMany.mockResolvedValueOnce({ count: 2 });
    const data = {
      "10": [{ level: 5, count: 2 }],
      "20": [{ level: 3, count: 1 }],
    };

    await saveContestResults(5, 7, data);

    const { data: records } = prisma.wettbewerb_ergebnisse.createMany.mock.calls[0][0];
    expect(records).toHaveLength(2);
    expect(records).toContainEqual({ contest_id: 5, member_id: 7, tier_id: 10, level: 5, anzahl: 2 });
    expect(records).toContainEqual({ contest_id: 5, member_id: 7, tier_id: 20, level: 3, anzahl: 1 });
  });

  it("konvertiert contestId, memberId und tierId zu Integer", async () => {
    prisma.wettbewerb_ergebnisse.createMany.mockResolvedValueOnce({ count: 1 });
    const data = { "10": [{ level: 5, count: 1 }] };

    await saveContestResults("5", "7", data);

    const { data: records } = prisma.wettbewerb_ergebnisse.createMany.mock.calls[0][0];
    expect(records[0]).toMatchObject({ contest_id: 5, member_id: 7, tier_id: 10 });
  });

  it("akzeptiert Zeilen mit nur level (count = 0)", async () => {
    prisma.wettbewerb_ergebnisse.createMany.mockResolvedValueOnce({ count: 1 });
    const data = { "10": [{ level: 3, count: 0 }] };

    await saveContestResults(1, 1, data);

    const { data: records } = prisma.wettbewerb_ergebnisse.createMany.mock.calls[0][0];
    expect(records[0]).toMatchObject({ level: 3, anzahl: 0 });
  });

  it("gibt das Ergebnis von createMany zurück", async () => {
    prisma.wettbewerb_ergebnisse.createMany.mockResolvedValueOnce({ count: 3 });
    const data = { "10": [{ level: 5, count: 2 }] };

    const result = await saveContestResults(1, 1, data);

    expect(result).toEqual({ count: 3 });
  });
});

// ─── 5. getResultsByContestId ─────────────────────────────────────────────────

describe("5. getResultsByContestId", () => {
  it("ruft findMany mit der korrekten contestId auf", async () => {
    prisma.wettbewerb_ergebnisse.findMany.mockResolvedValueOnce([]);

    await getResultsByContestId(42);

    expect(prisma.wettbewerb_ergebnisse.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { contest_id: 42 } })
    );
  });

  it("konvertiert die contestId zu Integer", async () => {
    prisma.wettbewerb_ergebnisse.findMany.mockResolvedValueOnce([]);

    await getResultsByContestId("42");

    expect(prisma.wettbewerb_ergebnisse.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { contest_id: 42 } })
    );
  });

  it("gibt die Ergebnisliste zurück", async () => {
    const mockResults = [{ id: 1, tier_id: 10, member_id: 1 }];
    prisma.wettbewerb_ergebnisse.findMany.mockResolvedValueOnce(mockResults);

    const result = await getResultsByContestId(5);

    expect(result).toEqual(mockResults);
  });
});
